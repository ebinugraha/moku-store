import { CategoryForm } from "@/components/category/category-form";
import { db } from "@/lib/db";

const CategoryCreate = async ({
  params,
}: {
  params: Promise<{ categoryId: string, storeId: string }>;
}) => {
  const { categoryId, storeId } = await params;

  const categoryData = await db.category.findFirst({
    where: {
      id: categoryId,
    },
  });

  const bannerData = await db.banner.findMany({
    where: {
      storeId: storeId,
    }
  }) 

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm category={categoryData} banner={bannerData} />
      </div>
    </div>
  );
};

export default CategoryCreate;
