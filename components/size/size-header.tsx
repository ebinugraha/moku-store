"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Heading } from "../ui/heading";
import { Separator } from "../ui/separator";
import { useParams, useRouter } from "next/navigation";

export const SizeHeader = () => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Ukuran" description="Atur Ukuran di sini" />
        <Button onClick={() => router.push(`/${params.storeId}/size/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah baru
        </Button>
      </div>
      <Separator />
    </>
  );
};
