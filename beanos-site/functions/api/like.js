// POST /api/like  { comment_id }

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: "bad json" }, 400);
  }
  const { comment_id } = body;
  if (!comment_id) return json({ error: "invalid input" }, 400);

  await env.DB.prepare("UPDATE comments SET likes = likes + 1 WHERE id = ?")
    .bind(comment_id)
    .run();

  return json({ ok: true });
}
