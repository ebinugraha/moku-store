import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;

    if (!storeId) {
      return NextResponse.json(
        { message: "Store id is missing" },
        { status: 400 }
      );
    }

    const data = await db.store.findFirst({
      where: {
        id: storeId,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Error",
      },
      { status: 505 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { storeId } = await params;
    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 402 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 402 });
    }

    if (!storeId) {
      return new NextResponse("Store is missing", { status: 402 });
    }

    const store = await db.store.updateMany({
      where: {
        id: storeId,
        userId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    return new NextResponse("Internal error");
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 402 });
    }

    if (!storeId) {
      return new NextResponse("Store is missing", { status: 402 });
    }

    const store = await db.store.deleteMany({
      where: {
        id: storeId,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    return new NextResponse("Internal error");
  }
}
