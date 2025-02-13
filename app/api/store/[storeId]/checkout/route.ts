import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await params;
  const { productIds } = await req.json();

  if (!productIds || productIds.length === 0) {
    return NextResponse.json(
      { message: "Product ids are missing" },
      { status: 400 }
    );
  }

  const products = await db.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });


  const order = await db.order.create({
    data: {
      storeId: storeId,
      isPaid: true,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });

  return NextResponse.json({ url: `${process.env.FRONTEND_STORE_URL}/cart?success=1` }, { headers: corsHeaders });
}
