import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ bannerId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 404 });
    }

    const { bannerId } = await params;
    const body = await req.json();

    const { label, imageUrl } = body;

    if (!label && !imageUrl) {
      return NextResponse.json(
        { message: "Label or ImageUrl not found" },
        { status: 404 }
      );
    }

    const data = await db.banner.updateMany({
      data: {
        label,
        imageUrl,
      },
      where: {
        id: bannerId,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Internal error" }, { status: 505 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ bannerId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 404 });
    }

    const { bannerId } = await params;

    const data = await db.banner.delete({
      where: {
        id: bannerId,
      },
    });

    return NextResponse.json({ message: "Delete success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal error" }, { status: 505 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ bannerId: string }> }
) {
  try {
    const { bannerId } = await params;

    const data = await db.banner.findUnique({
      where: {
        id: bannerId,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Internal error" }, { status: 505 });
  }
}
