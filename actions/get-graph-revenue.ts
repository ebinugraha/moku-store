import { db } from "@/lib/db";

type GraphData = {
  month: string;
  desktop: number;
};

export const getGraphRevenue = async (storeId: string) => {
  const paid = await db.order.findMany({
    where: {
      storeId: storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const monthlyRevenue: { [key: number]: number } = {};

  for (const order of paid) {
    const month = order.createdAt.getMonth();
    let revenueOrder = 0;

    for (const item of order.orderItems) {
      revenueOrder += item.product.price.toNumber();
    }

    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueOrder;
  }

  const graphData: GraphData[] = [
    { month: "January", desktop: 0 },
    { month: "February", desktop: 0 },
    { month: "March", desktop: 0 },
    { month: "April", desktop: 0 },
    { month: "May", desktop: 0 },
    { month: "June", desktop: 0 },
    { month: "July", desktop: 0 },
    { month: "August", desktop: 0 },
    { month: "September", desktop: 0 },
    { month: "October", desktop: 0 },
    { month: "November", desktop: 0 },
    { month: "December", desktop: 0 },
  ];

  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].desktop = monthlyRevenue[parseInt(month)];
  }

  return graphData;
};
