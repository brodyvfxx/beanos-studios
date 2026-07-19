// GET  /api/ratings?film=<id>   -> { count, average }
// POST /api/ratings  { film_id, rating (1-5) }

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

  const row = await env.DB.prepare(
    "SELECT COUNT(*) as count, AVG(rating) as average FROM ratings WHERE film_id = ?"
  ).bind(film).first();

  return json({ count: row?.count || 0, average: row?.average ?? null });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: "bad json" }, 400);
  }
  const { film_id, rating } = body;
  if (!film_id || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return json({ error: "invalid input" }, 400);
  }
  await env.DB.prepare("INSERT INTO ratings (film_id, rating) VALUES (?, ?)")
    .bind(String(film_id).slice(0, 60), rating)
    .run();
  return json({ ok: true });
}
