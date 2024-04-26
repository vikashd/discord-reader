import { NextRequest, NextResponse } from "next/server";
import { getMessages } from "@/app/_actions/getMessages";

export async function GET(req: NextRequest) {
  const channel = req.nextUrl.searchParams.get("page");
  const page = req.nextUrl.searchParams.get("page");

  if (!channel || !page) {
    return NextResponse.json([], { status: 200 });
  }

  const data = await getMessages(channel, page);

  return NextResponse.json(data, { status: 200 });
}
