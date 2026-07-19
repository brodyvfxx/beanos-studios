// GET  /api/comments?film=<id>  -> [{ id, name, message, likes, created_at }]
// POST /api/comments  { film_id, name, message }

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const film = url.searchParams.get("film");
  if (!film) return json({ error: "missing film" }, 400);

  const { results } = await env.DB.prepare(
    "SELECT id, name, message, likes, created_at FROM comments WHERE film_id = ? ORDER BY created_at DESC LIMIT 100"
  ).bind(film).all();

  return json(results || []);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: "bad json" }, 400);
  }
  const { film_id, name, message } = body;
  if (!film_id || typeof message !== "string" || message.trim().length === 0) {
    return json({ error: "invalid input" }, 400);
  }
  if (message.length > 500) return json({ error: "too long" }, 400);

  const safeName = (name || "").toString().trim().slice(0, 40);
  await env.DB.prepare("INSERT INTO comments (film_id, name, message) VALUES (?, ?, ?)")
    .bind(String(film_id).slice(0, 60), safeName || null, message.trim().slice(0, 500))
    .run();

  return json({ ok: true });
}
