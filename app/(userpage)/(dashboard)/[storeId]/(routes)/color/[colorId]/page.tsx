import { ColorForm } from "@/components/color/color-form";
import { db } from "@/lib/db";

const ColorCreate = async ({
  params,
}: {
  params: Promise<{ colorId: string }>;
}) => {
  const { colorId } = await params;

  const data = await db.color.findFirst({
    where: {
      id: colorId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm color={data} />
      </div>
    </div>
  );
};

export default ColorCreate;
