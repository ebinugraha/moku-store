"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/ui/alert-modal";
import { useState, useTransition } from "react";
import axios from "axios";

type CellAction = {
  id: string;
};

export const CellAction = ({ id }: CellAction) => {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams();

  const onCopyId = () => {
    window.navigator.clipboard.writeText(id);
    toast.success("Sukses di copy");
  };

  const onDelete = async () => {

    startTransition(() => {
      axios.delete(`/api/store/${params.storeId}/color/${id}`).then(() => {
        toast.success("berhasil di hapus");
        router.refresh();
      });
    });
  };

  const onUpdate = () => {
    router.push(`/${params.storeId}/color/${id}`);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onClick={onDelete}
        loading={false}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onCopyId}>
            <div className="flex w-full items-center justify-between">
              <span>Copy Id</span>
              <span>
                <Copy className="h-3 w-3" />
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onUpdate}>
            <div className="flex w-full items-center justify-between">
              <span>Ubah</span>
              <span>
                <Edit className="h-3 w-3 text-yellow-300" />
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <div className="flex w-full items-center justify-between">
              <span>Hapus</span>
              <span>
                <Trash className="h-3 w-3 text-red-500" />
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
