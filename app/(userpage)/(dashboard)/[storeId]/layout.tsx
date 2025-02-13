import { Navbar } from "@/components/dashboard/navbar";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const StoreLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}) => {
  const { userId } = await auth();
  const { storeId } = await params;

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await db.store.findFirst({
    where: {
      userId,
      id: storeId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      <div className="p-20">{children}</div>
    </>
  );
};

export default StoreLayout;
