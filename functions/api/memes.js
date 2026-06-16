port async function onRequest({ request }) {
  const sub = new URL(request.url).searchParams.get("sub") || "memes";
  const allowed = ["memes","dankmemes","shitposting","me_irl","funny"];
  if (!allowed.includes(sub)) {
    return json({ error: "bad sub" }, 400);
  }
 
  try {
    const res = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=50&raw_json=1`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; beanland/1.0)",
        "Accept": "application/json",
      },
      redirect: "follow",
    });
 
    const text = await res.text();
 
    // if reddit gave us HTML (login wall, error page) surface it
    if (!text.trimStart().startsWith("{") && !text.trimStart().startsWith("[")) {
      return json({ error: `reddit returned non-JSON (status ${res.status})`, preview: text.slice(0, 200) }, 502);
    }
 
    return new Response(text, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60",
      }
    });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
 
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });
}
 
