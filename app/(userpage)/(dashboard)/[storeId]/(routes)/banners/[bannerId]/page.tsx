import { BannerForm } from "@/components/banner/banner-form";
import { db } from "@/lib/db";

const BannerCreate = async ({
  params,
}: {
  params: Promise<{ bannerId: string }>;
}) => {
  const { bannerId } = await params;

  const data = await db.banner.findFirst({
    where: {
      id: bannerId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BannerForm banner={data} />
      </div>
    </div>
  );
};

export default BannerCreate;
