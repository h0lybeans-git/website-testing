export async function onRequest({ request }) {
  const sub = new URL(request.url).searchParams.get("sub") || "memes";

  const allowed = ["memes","dankmemes","shitposting","me_irl","funny"];
  if (!allowed.includes(sub)) {
    return new Response(JSON.stringify({ error: "bad sub" }), { status: 400 });
  }

  const res = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=50`, {
    headers: {
      "User-Agent": "beanland/1.0",
      "Accept": "application/json",
    }
  });

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=60",
    }
  });
}
