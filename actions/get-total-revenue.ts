import { db } from "@/lib/db"

export const getTotalRevenue = async (storeId: string) => {
    const paidOrders =  await db.order.findMany({
        where: {
            storeId: storeId,
            isPaid: true,
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                }
            }
        }
    })

    return paidOrders.reduce((total, order) => {
        return total + order.orderItems.reduce((orderTotal, orderItem) => {
            return orderTotal + Number(orderItem.product.price);
        }, 0);
    }, 0);
}