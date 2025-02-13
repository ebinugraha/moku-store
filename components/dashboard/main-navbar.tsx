"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export const MainNavbar = () => {
  const params = useParams();
  const pathname = usePathname();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Beranda",
      active: pathname === `/${params.storeId}`,
    },

    {
      href: `/${params.storeId}/banners`,
      label: "Banner",
      active: pathname === `/${params.storeId}/banners`,
    },

    {
      href: `/${params.storeId}/category`,
      label: "Kategori",
      active: pathname === `/${params.storeId}/category`,
    },
    {
      href: `/${params.storeId}/size`,
      label: "Ukuran",
      active: pathname === `/${params.storeId}/size`,
    },
    {
      href: `/${params.storeId}/color`,
      label: "Warna",
      active: pathname === `/${params.storeId}/color`,
    },

    {
      href: `/${params.storeId}/product`,
      label: "Produk",
      active: pathname === `/${params.storeId}/product`,
    },
    {
      href: `/${params.storeId}/order`,
      label: "Orderan",
      active: pathname === `/${params.storeId}/order`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Pengaturan",
      active: pathname === `/${params.storeId}/settings`,
    },
  ];

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-thin transition-colors hover:text-primary",
            route.active ? "text-black" : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};
