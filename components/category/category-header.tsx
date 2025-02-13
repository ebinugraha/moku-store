"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Heading } from "../ui/heading";
import { Separator } from "../ui/separator";
import { useParams, useRouter } from "next/navigation";

export const CategoryHeader = () => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Category" description="Atur category anda di sini" />
        <Button onClick={() => router.push(`/${params.storeId}/category/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah baru
        </Button>
      </div>
      <Separator />
    </>
  );
};
