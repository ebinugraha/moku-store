import { db } from "@/lib/db";

export const getTotalStock = async (storeId: string) => {
  const stockCount = await db.product.count({
    where: {
      storeId: storeId,
      isArchived: false,
    },
  });

  return stockCount;
};
