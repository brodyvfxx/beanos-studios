// Beanos Studios — Worker entry point.
// Static files (html/css/js/images) are served automatically via the
// ASSETS binding for any request that matches a real file. Anything
// else (the /api/* routes below) is handled here.

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

async function handleRatingsGet(url, env) {
  const film = url.searchParams.get("film");

  if (!film) {
    // No film specified — return aggregated ratings for every film, used for sorting.
    const { results } = await env.DB.prepare(
      "SELECT film_id, COUNT(*) as count, AVG(rating) as average FROM ratings GROUP BY film_id"
    ).all();
    const map = {};
    (results || []).forEach((row) => {
      map[row.film_id] = { count: row.count, average: row.average };
    });
    return json(map);
  }

  const row = await env.DB.prepare(
    "SELECT COUNT(*) as count, AVG(rating) as average FROM ratings WHERE film_id = ?"
  ).bind(film).first();
  return json({ count: row?.count || 0, average: row?.average ?? null });
}

async function handleRatingsPost(request, env) {
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: "bad json" }, 400); }
  const { film_id, rating, client_id } = body;
  if (!film_id || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return json({ error: "invalid input" }, 400);
  }
  const safeFilmId = String(film_id).slice(0, 60);
  const safeClientId = client_id ? String(client_id).slice(0, 80) : null;

  if (safeClientId) {
    // Upsert: changing your rating updates your existing row instead of adding a new one.
    await env.DB.prepare(
      `INSERT INTO ratings (film_id, client_id, rating) VALUES (?, ?, ?)
       ON CONFLICT(film_id, client_id) DO UPDATE SET rating = excluded.rating, created_at = datetime('now')`
    ).bind(safeFilmId, safeClientId, rating).run();
  } else {
    await env.DB.prepare("INSERT INTO ratings (film_id, rating) VALUES (?, ?)")
      .bind(safeFilmId, rating).run();
  }
  return json({ ok: true });
}

async function handleCommentsGet(url, env) {
  const film = url.searchParams.get("film");
  if (!film) return json({ error: "missing film" }, 400);
  const { results } = await env.DB.prepare(
    "SELECT id, name, message, likes, created_at FROM comments WHERE film_id = ? AND reported < 3 ORDER BY created_at DESC LIMIT 100"
  ).bind(film).all();
  return json(results || []);
}

async function handleCommentsPost(request, env) {
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: "bad json" }, 400); }
  const { film_id, name, message } = body;
  if (!film_id || typeof message !== "string" || message.trim().length === 0) {
    return json({ error: "invalid input" }, 400);
  }
  if (message.length > 500) return json({ error: "too long" }, 400);
  const safeName = (name || "").toString().trim().slice(0, 40);
  await env.DB.prepare("INSERT INTO comments (film_id, name, message) VALUES (?, ?, ?)")
    .bind(String(film_id).slice(0, 60), safeName || null, message.trim().slice(0, 500)).run();
  return json({ ok: true });
}

async function handleLikePost(request, env) {
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: "bad json" }, 400); }
  const { comment_id } = body;
  if (!comment_id) return json({ error: "invalid input" }, 400);
  await env.DB.prepare("UPDATE comments SET likes = likes + 1 WHERE id = ?").bind(comment_id).run();
  return json({ ok: true });
}

async function handleReportPost(request, env) {
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: "bad json" }, 400); }
  const { comment_id } = body;
  if (!comment_id) return json({ error: "invalid input" }, 400);
  // Auto-hide after 3 reports (handled by the < 3 filter in handleCommentsGet) —
  // no admin panel needed; check the D1 console directly if you want to review or delete one.
  await env.DB.prepare("UPDATE comments SET reported = reported + 1 WHERE id = ?").bind(comment_id).run();
  return json({ ok: true });
}

async function handleYoutubeStats(url, env) {
  const idsParam = url.searchParams.get("ids");
  if (!idsParam) return json({ error: "missing ids" }, 400);
  if (!env.YOUTUBE_API_KEY) return json({}, 200); // not configured yet — degrade quietly
  const ids = idsParam.split(",").slice(0, 50).join(",");
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${encodeURIComponent(ids)}&key=${env.YOUTUBE_API_KEY}`;
  const ytRes = await fetch(apiUrl);
  if (!ytRes.ok) return json({}, 200); // don't break the page over a YouTube API hiccup
  const data = await ytRes.json();
  const map = {};
  (data.items || []).forEach((item) => {
    map[item.id] = {
      viewCount: Number((item.statistics && item.statistics.viewCount) || 0),
      publishedAt: (item.snippet && item.snippet.publishedAt) || null
    };
  });
  return json(map);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    try {
      if (pathname === "/api/ratings") {
        if (request.method === "GET") return await handleRatingsGet(url, env);
        if (request.method === "POST") return await handleRatingsPost(request, env);
      }
      if (pathname === "/api/comments") {
        if (request.method === "GET") return await handleCommentsGet(url, env);
        if (request.method === "POST") return await handleCommentsPost(request, env);
      }
      if (pathname === "/api/like" && request.method === "POST") {
        return await handleLikePost(request, env);
      }
      if (pathname === "/api/report" && request.method === "POST") {
        return await handleReportPost(request, env);
      }
      if (pathname === "/api/youtube-stats" && request.method === "GET") {
        return await handleYoutubeStats(url, env);
      }
    } catch (err) {
      return json({ error: "server error", detail: String(err) }, 500);
    }

    // Not an /api/ route — serve the static site.
    return env.ASSETS.fetch(request);
  }
};
