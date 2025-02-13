import { ProductForm } from "@/components/product/product-form";
import { db } from "@/lib/db";

const ProductCreate = async ({
  params,
}: {
  params: Promise<{ productId: string; storeId: string }>;
}) => {
  const { productId, storeId } = await params;

  const productData = await db.product.findFirst({
    where: {
      id: productId,
    },
    include: {
      images: true,
    },
  });

  const category = await db.category.findMany({
    where: {
      storeId: storeId,
    },
  });

  const sizes = await db.size.findMany({
    where: {
      storeId: storeId,
    },
  });

  const colors = await db.color.findMany({
    where: {
      storeId: storeId,
    },
  });

  const serializedProduct = productData
  ? {
      ...productData,
      price: productData.price.toString(), // or productData.price.toNumber()
    }
  : null;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          product={serializedProduct}
          category={category}
          colors={colors}
          sizes={sizes}
        />
      </div>
    </div>
  );
};

export default ProductCreate;
