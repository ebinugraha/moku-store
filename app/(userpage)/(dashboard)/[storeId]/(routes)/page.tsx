import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getTotalSales } from "@/actions/get-total-sales";
import { getTotalStock } from "@/actions/get-total-stock";
import { Cart } from "@/components/dashboard/cart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { formatter } from "@/lib/utils";

type dashboardPage = {
  params: Promise<{ storeId: string }>;
};

const DashboardPage = async ({ params }: dashboardPage) => {
  const { storeId } = await params;

  const totalRevenue = await getTotalRevenue(storeId);
  const salesCount = await getTotalSales(storeId);
  const stockCount = await getTotalStock(storeId);
  const graph = await getGraphRevenue(storeId)

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Atur dashboard anda di sini" />

        <Separator />

        <div className="grid gap-4 grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-4">
              <CardTitle className="text-sm">Total Pendapatan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-4">
              <CardTitle className="text-sm">Total Penjualan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{salesCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-4">
              <CardTitle className="text-sm">Total Produk Di Gudang</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockCount}</div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-4">
            <CardTitle className="text-sm">Total Produk Di Gudang</CardTitle>
          </CardHeader>
          <CardContent>
            <Cart data={graph} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
