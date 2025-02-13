import { format } from "date-fns";

import { db } from "@/lib/db";
import { ApiAlert } from "@/components/ui/api-alert";
import { SizeHeader } from "@/components/size/size-header";
import { DataTable } from "@/components/size/table-size/data-table";
import { ApiSizeList } from "@/components/size/api-size-list";
import { columns } from "@/components/size/table-size/columns";

const SizePage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  const size = await db.size.findMany({
    where: {
      storeId
    }
  });

  var i = 1;
  const formatedSize = size.map((item) => ({
    no: i++,
    id: item.id,
    label: item.label,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM dd, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeHeader />
        <DataTable columns={columns} data={formatedSize} />
        <ApiSizeList storeId={storeId} />
      </div>
    </div>
  );
};

export default SizePage;
