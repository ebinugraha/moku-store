import { SizeForm } from "@/components/size/size-form";
import { db } from "@/lib/db";

const SizeCreate = async ({
  params,
}: {
  params: Promise<{ sizeId: string }>;
}) => {
  const { sizeId } = await params;

  const data = await db.size.findFirst({
    where: {
      id: sizeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm size={data} />
      </div>
    </div>
  );
};

export default SizeCreate;
