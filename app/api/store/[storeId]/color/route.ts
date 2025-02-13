import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId } = await params;

    //* ini mengambil value
    const body = await req.json();
    const { label, value } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 402 });
    }

    if (!label) {
      return new NextResponse("Name not found", { status: 402 });
    }

    if (!value) {
      return new NextResponse("Image not found", { status: 402 });
    }

    const color = await db.color.create({
      data: {
        label: label,
        value: value,
        storeId: storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    return new NextResponse();
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;

    if (!storeId) {
      return NextResponse.json("Store id is missing", { status: 400 });
    }

    const color = await db.color.findMany({
      where: {
        storeId: storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 505 });
  }
}
