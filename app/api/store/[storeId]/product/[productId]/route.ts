import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { metadata } from "../../../../../layout";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 404 });
    }

    const { productId } = await params;
    const body = await req.json();

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 402 });
    }

    if (!name) {
      return new NextResponse("Name not found", { status: 402 });
    }

    if (!images || !images.length) {
      return new NextResponse("Image not found", { status: 402 });
    }

    if (!price) {
      return new NextResponse("Price not found", { status: 402 });
    }

    if (!categoryId) {
      return new NextResponse("Category not found", { status: 402 });
    }

    if (!colorId) {
      return new NextResponse("Color not found", { status: 402 });
    }

    if (!sizeId) {
      return new NextResponse("Size not found", { status: 402 });
    }

    const data = await db.product.update({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        images: {
          deleteMany: {},
        },
      },
      where: {
        id: productId,
      },
    });

    const product = await db.product.update({
      where: {
        id: productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: string) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ message: "Internal error" }, { status: 505 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 404 });
    }

    const { productId } = await params;

    const data = await db.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json({ message: "Delete success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal error" }, { status: 505 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    const data = await db.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Internal error" }, { status: 505 });
  }
}
