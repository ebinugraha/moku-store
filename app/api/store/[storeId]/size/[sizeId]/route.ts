import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ sizeId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 404 });
    }

    const { sizeId } = await params;
    const body = await req.json();

    const { label, value } = body;

    if (!label && !value) {
      return NextResponse.json(
        { message: "Label or Value not found" },
        { status: 404 }
      );
    }

    const data = await db.size.updateMany({
      data: {
        label,
        value,
      },
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Internal error" }, { status: 505 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ sizeId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 404 });
    }

    const { sizeId } = await params;

    const data = await db.size.delete({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json({ message: "Delete success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal error" }, { status: 505 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sizeId: string }> }
) {
  try {
    const { sizeId } = await params;

    const data = await db.size.findUnique({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Internal error" }, { status: 505 });
  }
}
