import { format } from "date-fns";

import { BannerHeader } from "@/components/banner/banner-header";
import { columns } from "@/components/banner/table-banner/columns";
import { DataTable } from "@/components/banner/table-banner/data-table";
import { db } from "@/lib/db";
import { ApiAlert } from "@/components/ui/api-alert";
import { ApiBannerList } from "@/components/banner/api-bannner-list";

const BannerPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  const banner = await db.banner.findMany({
    where: {
      storeId: storeId,
    }
  });

  var i = 1;
  const formatedBanner = banner.map((item) => ({
    no: i++,
    id: item.id,
    label: item.label,
    imageUrl: item.imageUrl,
    createdAt: format(item.createdAt, "MMMM dd, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BannerHeader />
        <DataTable columns={columns} data={formatedBanner} />
        <ApiBannerList storeId={storeId} />
      </div>
    </div>
  );
};

export default BannerPage;
