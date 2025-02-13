import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 404 });
    }

    const { categoryId } = await params;
    const body = await req.json();

    const { name, bannerId } = body;

    // console.log(bannerId)

    if (!name) {
      return NextResponse.json({ message: "Name not found" }, { status: 404 });
    }

    if (!bannerId) {
      return NextResponse.json(
        { message: "BannerId not found" },
        { status: 404 }
      );
    }

    const data = await db.category.updateMany({
      data: {
        name,
        bannerId,
      },
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Internal error" }, { status: 505 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 404 });
    }

    const { categoryId } = await params;

    const data = await db.category.deleteMany({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Internal error" }, { status: 405 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;

    const data = await db.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        banner: true,
      }
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Internal error" }, { status: 505 });
  }
}
