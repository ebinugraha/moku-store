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
    const { name, bannerId } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 402 });
    }

    if (!name) {
      return new NextResponse("Name not found", { status: 402 });
    }

    if (!bannerId) {
      return new NextResponse("Image not found", { status: 402 });
    }

    const category = await db.category.create({
      data: {
        name: name,
        bannerId: bannerId,
        storeId: storeId,
      },
    });

    return NextResponse.json(category);
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

    const category = await db.category.findMany({
      where: {
        storeId: storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 505 });
  }
}
