import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import db from "@/db/drizzle";
import { Store } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const store = await db.insert(Store).values({
      name: name,
      userId: userId,
    });

    console.log("berhasil dibuat ")

    return NextResponse.json(store);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
