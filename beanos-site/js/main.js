// ============================================================
// BEANOS STUDIOS — shared front-end logic
// ============================================================

/* ---------- Nav toggle (mobile) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }
});

/* ---------- Helpers ---------- */
function thumbUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
function embedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
}
function tagLabel(tags) {
  return tags.slice(0, 3).join(" · ");
}
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- Film grid rendering ---------- */
function renderFilmGrid(container, films) {
  container.innerHTML = "";
  films.forEach((film) => {
    const card = document.createElement("button");
    card.className = "tape-card";
    card.setAttribute("data-film-id", film.id);
    card.innerHTML = `
      <div class="tape-thumb">
        <img src="${thumbUrl(film.videoId)}" alt="${escapeHtml(film.title)} thumbnail" loading="lazy">
        <div class="play-badge"><div class="tri"></div></div>
      </div>
      <div class="tape-label">
        <p class="tape-title">${escapeHtml(film.title)}</p>
        <p class="tape-tags">${tagLabel(film.tags)}</p>
        <p class="tape-rating" data-rating-summary="${film.id}">Loading rating…</p>
      </div>
    `;
    card.addEventListener("click", () => openFilmModal(film));
    container.appendChild(card);
    loadRatingSummary(film.id, `[data-rating-summary="${film.id}"]`);
  });
}

/* ============================================================
   MODAL (CRT frame): details, play, rating, comments
   ============================================================ */
let modalEl, currentFilm;

function ensureModal() {
  if (modalEl) return modalEl;
  modalEl = document.createElement("div");
  modalEl.className = "modal-overlay";
  modalEl.innerHTML = `
    <div class="crt" role="dialog" aria-modal="true">
      <button class="crt-close" aria-label="Close">✕</button>
      <div class="crt-screen"></div>
      <div class="crt-body"></div>
    </div>
  `;
  document.body.appendChild(modalEl);
  modalEl.addEventListener("click", (e) => {
    if (e.target === modalEl) closeFilmModal();
  });
  modalEl.querySelector(".crt-close").addEventListener("click", closeFilmModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeFilmModal();
  });
  return modalEl;
}

function closeFilmModal() {
  if (!modalEl) return;
  modalEl.classList.remove("open");
  modalEl.querySelector(".crt-screen").innerHTML = "";
}

function openFilmModal(film) {
  currentFilm = film;
  const modal = ensureModal();
  const screen = modal.querySelector(".crt-screen");
  const body = modal.querySelector(".crt-body");

  screen.innerHTML = `
    <img src="${thumbUrl(film.videoId)}" alt="${escapeHtml(film.title)} thumbnail">
    <div class="play-badge"><div class="tri"></div></div>
  `;
  screen.querySelector("img").addEventListener("click", () => playFilm(film.videoId));
  screen.querySelector(".play-badge").addEventListener("click", () => playFilm(film.videoId));

  const castHtml = film.cast
    .map(([name, role]) => `<span><b>${escapeHtml(name)}</b> — ${escapeHtml(role)}</span>`)
    .join("");

  body.innerHTML = `
    <h2>${escapeHtml(film.title)}</h2>
    <p class="tape-tags">${tagLabel(film.tags)}</p>
    <p class="desc">${escapeHtml(film.description)}</p>
    <div class="crt-cast">${castHtml}</div>

    <div class="rating-row">
      <div class="stars" data-stars></div>
      <span class="rating-summary" data-rating-detail>Loading rating…</span>
    </div>

    <div class="comments-section">
      <h3>Guestbook — what did you think?</h3>
      <form class="comment-form" data-comment-form>
        <div class="row">
          <div class="field" style="flex:1; min-width:160px;">
            <label for="c-name">Name (optional)</label>
            <input type="text" id="c-name" name="name" maxlength="40" placeholder="Anonymous">
          </div>
        </div>
        <div class="field">
          <label for="c-msg">Comment</label>
          <textarea id="c-msg" name="message" rows="2" maxlength="500" required placeholder="What did you think of this one?"></textarea>
        </div>
        <input class="hp-field" tabindex="-1" autocomplete="off" type="text" name="website" placeholder="Leave blank">
        <button type="submit" class="btn btn-primary" style="align-self:flex-start;">Post comment</button>
      </form>
      <div class="comment-list" data-comment-list><p class="empty-note">Loading comments…</p></div>
    </div>
  `;

  buildStars(body.querySelector("[data-stars]"), film.id);
  loadRatingDetail(film.id, body.querySelector("[data-rating-detail]"));
  loadComments(film.id, body.querySelector("[data-comment-list]"));
  body.querySelector("[data-comment-form]").addEventListener("submit", (e) => {
    e.preventDefault();
    submitComment(film.id, e.target);
  });

  modal.classList.add("open");
}

function playFilm(videoId) {
  const screen = document.querySelector(".crt-screen");
  screen.innerHTML = `<iframe src="${embedUrl(videoId)}" title="Beanos Studios film" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
}

/* ---------- Star rating ---------- */
function buildStars(container, filmId) {
  container.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = "★";
    b.dataset.value = i;
    b.addEventListener("click", () => submitRating(filmId, i, container));
    container.appendChild(b);
  }
  const storedKey = `beanos-rated-${filmId}`;
  const already = localStorage.getItem(storedKey);
  if (already) highlightStars(container, Number(already));
}

function highlightStars(container, value) {
  container.querySelectorAll("button").forEach((b) => {
    b.classList.toggle("active", Number(b.dataset.value) <= value);
  });
}

async function submitRating(filmId, value, starsContainer) {
  const storedKey = `beanos-rated-${filmId}`;
  if (localStorage.getItem(storedKey)) return; // one rating per browser per film
  highlightStars(starsContainer, value);
  localStorage.setItem(storedKey, String(value));
  try {
    await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ film_id: filmId, rating: value })
    });
  } catch (err) { /* fails silently — rating still shows locally */ }
  loadRatingDetail(filmId, document.querySelector("[data-rating-detail]"));
  loadRatingSummary(filmId, `[data-rating-summary="${filmId}"]`);
}

async function fetchRating(filmId) {
  try {
    const res = await fetch(`/api/ratings?film=${encodeURIComponent(filmId)}`);
    if (!res.ok) throw new Error("bad response");
    return await res.json();
  } catch (err) {
    return { average: null, count: 0 };
  }
}

async function loadRatingSummary(filmId, selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  const { average, count } = await fetchRating(filmId);
  el.textContent = count > 0 ? `★ ${average.toFixed(1)} (${count})` : "No ratings yet";
}

async function loadRatingDetail(filmId, el) {
  if (!el) return;
  const { average, count } = await fetchRating(filmId);
  el.textContent = count > 0 ? `${average.toFixed(1)} / 5 · ${count} rating${count === 1 ? "" : "s"}` : "Be the first to rate this one";
}

/* ---------- Comments ---------- */
async function loadComments(filmId, listEl) {
  listEl.innerHTML = `<p class="empty-note">Loading comments…</p>`;
  try {
    const res = await fetch(`/api/comments?film=${encodeURIComponent(filmId)}`);
    const comments = await res.json();
    renderComments(listEl, comments);
  } catch (err) {
    listEl.innerHTML = `<p class="empty-note">Couldn't load comments right now.</p>`;
  }
}

function renderComments(listEl, comments) {
  if (!comments || comments.length === 0) {
    listEl.innerHTML = `<p class="empty-note">No comments yet — say something!</p>`;
    return;
  }
  listEl.innerHTML = comments
    .map((c) => {
      const liked = localStorage.getItem(`beanos-liked-${c.id}`);
      return `
      <div class="comment" data-comment-id="${c.id}">
        <div class="meta">
          <span>${escapeHtml(c.name || "Anonymous")}</span>
          <button class="like-btn ${liked ? "liked" : ""}" data-like="${c.id}">♥ <span data-like-count>${c.likes}</span></button>
        </div>
        <p class="msg">${escapeHtml(c.message)}</p>
      </div>`;
    })
    .join("");

  listEl.querySelectorAll("[data-like]").forEach((btn) => {
    btn.addEventListener("click", () => likeComment(btn));
  });
}

async function submitComment(filmId, form) {
  const name = form.name.value.trim();
  const message = form.message.value.trim();
  const honeypot = form.website.value;
  if (!message) return;
  if (honeypot) return; // bot caught by honeypot, silently drop

  const submitBtn = form.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  try {
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ film_id: filmId, name, message })
    });
    form.reset();
    loadComments(filmId, document.querySelector("[data-comment-list]"));
  } catch (err) {
    alert("Comment couldn't be posted — try again in a moment.");
  } finally {
    submitBtn.disabled = false;
  }
}

async function likeComment(btn) {
  const id = btn.getAttribute("data-like");
  const key = `beanos-liked-${id}`;
  if (localStorage.getItem(key)) return; // one like per browser per comment
  localStorage.setItem(key, "1");
  btn.classList.add("liked");
  const countEl = btn.querySelector("[data-like-count]");
  countEl.textContent = Number(countEl.textContent) + 1;
  try {
    await fetch("/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment_id: id })
    });
  } catch (err) { /* count already optimistically updated */ }
}

/* ============================================================
   QUIZ — "What should I watch?"
   Films are grouped into 7 clear vibes (2 films each). Every
   question offers all 7 vibes, reworded around a different
   angle, so answers reliably converge on one vibe instead of
   scattering across loosely-related tags.
   ============================================================ */
const QUIZ_CATEGORIES = {
  "crime-parody": { label: "Crime Parody", filmIds: ["cf1", "the-gabafather"] },
  "heist-chaos": { label: "Heist & Chaos", filmIds: ["prison-heist", "alone-at-home"] },
  "galaxy-parody": { label: "Galaxy-Sized Parody", filmIds: ["planet-battles", "project-slarp"] },
  "survival-competition": { label: "Survival Competition", filmIds: ["starvation-games", "bolan-supreme"] },
  "somethings-off": { label: "Something's Off", filmIds: ["the-experiment", "water-bottle-kicker"] },
  "family-chaos": { label: "Family Chaos", filmIds: ["earthcake-debbie", "health-project"] },
  "offbeat-heartfelt": { label: "Offbeat & Heartfelt", filmIds: ["fixation", "tales-of-a-tender"] }
};

const QUIZ_QUESTIONS = [
  {
    q: "Pick a scene you'd want to walk into.",
    options: [
      { label: "A crime scene with a wise-cracking detective", cat: "crime-parody" },
      { label: "Prisoners making a break for it", cat: "heist-chaos" },
      { label: "A galaxy far, far away", cat: "galaxy-parody" },
      { label: "An arena where only one person wins", cat: "survival-competition" },
      { label: "A simulation where something's not right", cat: "somethings-off" },
      { label: "A house that's gone completely off the rails", cat: "family-chaos" },
      { label: "A quiet bar with a strange story to tell", cat: "offbeat-heartfelt" }
    ]
  },
  {
    q: "What's the vibe you're chasing?",
    options: [
      { label: "Deadpan and mysterious", cat: "crime-parody" },
      { label: "Fast, chaotic, a little dumb", cat: "heist-chaos" },
      { label: "Big, epic, over-the-top", cat: "galaxy-parody" },
      { label: "Competitive and cutthroat", cat: "survival-competition" },
      { label: "Unsettling, in a funny way", cat: "somethings-off" },
      { label: "Wholesome chaos", cat: "family-chaos" },
      { label: "Sweet, with a twist", cat: "offbeat-heartfelt" }
    ]
  },
  {
    q: "One more — pick a punchline style.",
    options: [
      { label: "A twist you didn't see coming", cat: "crime-parody" },
      { label: "Everything going wrong at once", cat: "heist-chaos" },
      { label: "Something ridiculously over-the-top", cat: "galaxy-parody" },
      { label: "Someone getting way too competitive", cat: "survival-competition" },
      { label: "Something creepy, played for laughs", cat: "somethings-off" },
      { label: "Family members losing it", cat: "family-chaos" },
      { label: "A wish that backfires", cat: "offbeat-heartfelt" }
    ]
  }
];

let quizModalEl, quizStep, quizVotes;

function ensureQuizModal() {
  if (quizModalEl) return quizModalEl;
  quizModalEl = document.createElement("div");
  quizModalEl.className = "modal-overlay";
  quizModalEl.innerHTML = `
    <div class="crt" role="dialog" aria-modal="true" style="max-width:560px;">
      <button class="crt-close" aria-label="Close">✕</button>
      <div class="crt-body" data-quiz-body></div>
    </div>
  `;
  document.body.appendChild(quizModalEl);
  quizModalEl.addEventListener("click", (e) => { if (e.target === quizModalEl) closeQuiz(); });
  quizModalEl.querySelector(".crt-close").addEventListener("click", closeQuiz);
  return quizModalEl;
}

function closeQuiz() {
  if (quizModalEl) quizModalEl.classList.remove("open");
}

function startQuiz() {
  quizStep = 0;
  quizVotes = [];
  const modal = ensureQuizModal();
  renderQuizStep();
  modal.classList.add("open");
}

function renderQuizStep() {
  const body = quizModalEl.querySelector("[data-quiz-body]");
  const question = QUIZ_QUESTIONS[quizStep];
  body.innerHTML = `
    <p class="quiz-progress">Question ${quizStep + 1} of ${QUIZ_QUESTIONS.length}</p>
    <h2>${question.q}</h2>
    <div class="quiz-options">
      ${question.options.map((opt, i) => `<button data-opt="${i}">${escapeHtml(opt.label)}</button>`).join("")}
    </div>
  `;
  body.querySelectorAll("[data-opt]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const opt = question.options[Number(btn.dataset.opt)];
      quizVotes.push(opt.cat);
      quizStep++;
      if (quizStep < QUIZ_QUESTIONS.length) {
        renderQuizStep();
      } else {
        renderQuizResult();
      }
    });
  });
}

function renderQuizResult() {
  // Tally votes; ties break toward the first question's pick,
  // since that's the person's strongest initial instinct.
  const tally = {};
  quizVotes.forEach((cat) => (tally[cat] = (tally[cat] || 0) + 1));
  let winner = quizVotes[0];
  let winnerVotes = 0;
  Object.keys(tally).forEach((cat) => {
    if (tally[cat] > winnerVotes) {
      winnerVotes = tally[cat];
      winner = cat;
    }
  });

  const category = QUIZ_CATEGORIES[winner];
  const matches = category.filmIds.map((id) => FILMS.find((f) => f.id === id)).filter(Boolean);

  const body = quizModalEl.querySelector("[data-quiz-body]");
  body.innerHTML = `
    <div class="quiz-result">
      <p class="eyebrow">Your vibe is...</p>
      <h2>${escapeHtml(category.label)}</h2>
      <div class="film-grid" data-result-grid style="margin:18px 0; text-align:left;"></div>
      <button class="btn btn-outline" data-retake>Take quiz again</button>
    </div>
  `;
  renderFilmGrid(body.querySelector("[data-result-grid]"), matches);
  body.querySelector("[data-retake]").addEventListener("click", startQuiz);
  // clicking a result card should close the quiz first
  body.querySelectorAll("[data-result-grid] .tape-card").forEach((card) => {
    card.addEventListener("click", closeQuiz, { once: true });
  });
}
