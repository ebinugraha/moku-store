import { format } from "date-fns";

import { db } from "@/lib/db";
import { OrderHeader } from "@/components/order/order-header";
import { DataTable } from "@/components/order/table-order/data-table";
import { ApiOrderList } from "@/components/order/api-order-list";
import { columns } from "@/components/order/table-order/columns";
const OrderPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  const order = await db.order.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  var i = 1;
  const formatedOrder = order.map((item) => ({
    no: i++,
    id: item.id,
    phone: item.phone,
    address: item.address,
    isPaid: item.isPaid,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    totalPrice: item.orderItems.reduce((total, orderItem) => {
      return total + Number(orderItem.product.price);
    }, 0),
    createdAt: format(item.createdAt, "MMMM dd, yyyy"),
  }));



  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderHeader  formatedOrder={formatedOrder}/>
        <DataTable columns={columns} data={formatedOrder} />
      </div>
    </div>
  );
};

export default OrderPage;
