import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const body = await request.text();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: cookieStore.toString(),
    },
    body,
    credentials: "include",
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "text/plain",
    },
  });
}
