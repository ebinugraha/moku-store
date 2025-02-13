import { db } from "@/lib/db"

export const getTotalSales = async (storeId: string) => {
    const totalSales = await db.order.count({
        where: {
          storeId: storeId,
          isPaid: true
        },
      });
    
      return totalSales;
}