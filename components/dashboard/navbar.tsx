import { UserButton } from "@clerk/nextjs";
// import { currentUser } from "@clerk/nextjs/server";
import { MainNavbar } from "./main-navbar";
import { StoreSwitcher } from "./store-switcher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export const Navbar = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await db.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="flex h-16 border-b-2 w-full">
      <div className="flex items-center px-4 justify-between w-full">
        <div>
          <StoreSwitcher items={store} />
        </div>
        <div>
          <MainNavbar />
        </div>
        <div className="flex items-center gap-x-2 ">
          {/* <h1 className="text-sm hidden lg:flex">{user?.fullName}</h1> */}
          <UserButton />
        </div>
      </div>
    </div>
  );
};
