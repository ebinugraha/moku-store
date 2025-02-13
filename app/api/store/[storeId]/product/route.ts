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

    const product = await db.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return new NextResponse();
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured") || undefined;

    const { storeId } = await params;

    if (!storeId) {
      return NextResponse.json("Store id is missing", { status: 400 });
    }

    const product = await db.product.findMany({
      where: {
        storeId: storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json("Internal Error", { status: 505 });
  }
}
