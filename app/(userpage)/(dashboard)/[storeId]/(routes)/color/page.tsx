import { format } from "date-fns";

import { db } from "@/lib/db";
import { ApiAlert } from "@/components/ui/api-alert";
import { ColorHeader } from "@/components/color/color-header";
import { DataTable } from "@/components/color/table-color/data-table";
import { columns } from "@/components/color/table-color/columns";
import { ApiColorList } from "@/components/color/api-color-list";

const ColorPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  const color = await db.color.findMany({
    where: {
      storeId: storeId,
    }
  });

  var i = 1;
  const formatedColor = color.map((item) => ({
    no: i++,
    id: item.id,
    label: item.label,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM dd, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorHeader />
        <DataTable columns={columns} data={formatedColor} />
        <ApiColorList storeId={storeId} />
      </div>
    </div>
  );
};

export default ColorPage;
