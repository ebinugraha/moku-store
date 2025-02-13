"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
const MarketingLayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  } else {
    const store = await db.store.findFirst({
      where: {
        userId,
      },
    });

    if(store){
        redirect(`/${store.id}`)
    }

  }

  return <div>{children}</div>;
};

export default MarketingLayout;
