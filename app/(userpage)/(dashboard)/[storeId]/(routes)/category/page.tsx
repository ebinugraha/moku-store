import { format } from "date-fns";

import { db } from "@/lib/db";
import { ApiBannerList } from "@/components/banner/api-bannner-list";
import { DataTable } from "@/components/category/table-category/data-table";
import { columns } from "@/components/category/table-category/columns";
import { CategoryHeader } from "@/components/category/category-header";
import { ApiCategoryList } from "@/components/category/api-category-list";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  const category = await db.category.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      banner: true
    }
  });

  var i = 1;
  const formatedCategory = category.map((item) => ({
    no: i++,
    id: item.id,
    name: item.name,
    label: item.banner.label,
    createdAt: format(item.createdAt, "MMMM dd, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryHeader />
        <DataTable columns={columns} data={formatedCategory} />
        <ApiCategoryList storeId={storeId} />
      </div>
    </div>
  );
};

export default CategoryPage;
