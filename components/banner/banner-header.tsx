"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Heading } from "../ui/heading";
import { Separator } from "../ui/separator";
import { useParams, useRouter } from "next/navigation";

export const BannerHeader = () => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Banner" description="Atur banner anda di sini" />
        <Button onClick={() => router.push(`/${params.storeId}/banners/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah baru
        </Button>
      </div>
      <Separator />
    </>
  );
};
