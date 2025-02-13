import { SettingForm } from "@/components/settings/setting-form";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const SettingPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { userId } = await auth();
  const { storeId } = await params;

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await db.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingForm store={store}/>
      </div>
    </div>
  );
};

export default SettingPage;
