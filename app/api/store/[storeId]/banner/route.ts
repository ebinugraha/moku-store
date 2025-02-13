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
    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 402 });
    }

    if (!label) {
      return new NextResponse("Name not found", { status: 402 });
    }

    if (!imageUrl) {
      return new NextResponse("Image not found", { status: 402 });
    }

    const banner = await db.banner.create({
      data: {
        label: label,
        imageUrl: imageUrl,
        storeId: storeId,
      },
    });

    return NextResponse.json(banner);
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

    const banner = await db.banner.findMany({
      where: {
        storeId: storeId,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 505 });
  }
}
