import { format } from "date-fns";

import { db } from "@/lib/db";
import { ProductHeader } from "@/components/product/product-header";
import { DataTable } from "@/components/product/table-product/data-table";
import { columns } from "@/components/product/table-product/columns";
import { ApiProductList } from "@/components/product/api-product-list";
import { formatter } from "@/lib/utils";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  const product = await db.product.findMany({
    include: {
      category: true,
      color: true,
      size: true,
    },
    where: {
      storeId: storeId,
    }
  });

  var i = 1;
  const formatedCategory = product.map((item) => ({
    no: i++,
    id: item.id,
    name: item.name,
    category: item.category.name,
    size: item.size.label,
    color: item.color.value,
    isFeature: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    createdAt: format(item.createdAt, "MMMM dd, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductHeader />
        <DataTable columns={columns} data={formatedCategory} />
        <ApiProductList storeId={storeId} />
      </div>
    </div>
  );
};

export default CategoryPage;
