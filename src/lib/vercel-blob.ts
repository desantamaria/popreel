import { del } from "@vercel/blob";

export async function Delete(url: string) {
  const { searchParams } = new URL(url);
  const urlToDelete = searchParams.get("url") as string;
  await del(urlToDelete);

  return true;
}
