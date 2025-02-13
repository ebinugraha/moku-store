"use client";

import { Banner, Size, Store } from "@prisma/client";
import { Heading } from "../ui/heading";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { Separator } from "../ui/separator";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { useState, useTransition } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AlertModal } from "../ui/alert-modal";
import { ApiAlert } from "../ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import ImageUploud from "../ui/image-uploud";

type SizeProps = {
  size: Size | null;
};

export const SizeForm = ({ size }: SizeProps) => {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  const formSchema = z.object({
    label: z.string().min(2, {
      message: "label must be at least 2 characters.",
    }),
    value: z.string().min(1, {
      message: "value must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: size || {
      label: "",
      value: "",
    },
  });

  const title = size ? "Edit size" : "Tambah size";
  const description = size ? "Edit size" : "Tambah size";
  const toastMessage = size ? "Size Telah ubah" : "Size telah dibuat";
  const action = size ? "Simpan" : "Tambah";

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      if (size) {
        axios
          .patch(
            `/api/store/${params.storeId}/size/${params.sizeId}`,
            values
          )
          .then(() => {
            toast.success(toastMessage);
            router.push(`/${params.storeId}/size`);
          })
          .catch(() => toast.error("Tidak bisa Mengubah size"));
      } else {
        axios
          .post(`/api/store/${params.storeId}/size`, values)
          .then(() => {
            toast.success(toastMessage);
            router.push(`/${params.storeId}/size`);
          })
          .catch(() => toast.error("Tidak bisa menambah size"));
      }
    });

    router;
  }

  const onDelete = async () => {
    startTransition(() => {
      axios
        .delete(`/api/store/${params.storeId}/size/${params.sizeId}`)
        .then(() => {
          router.refresh();
          toast.success("sukses menghapus");
        });
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onClick={onDelete}
        loading={false}
      />
      <div className="flex items-center justify-between">
        <Heading title="Size" description="Membuat size" />
        {size && (
          <Button
            variant={"destructive"}
            size={"icon"}
            disabled={pending}
            onClick={() => setOpen(true)}
          >
            <Trash />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{title}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Buat nama Ukuran"
                      {...field}
                      disabled={pending}
                    />
                  </FormControl>
                  <FormDescription>{description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{title}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Buat nilai Ukuran"
                      {...field}
                      disabled={pending}
                    />
                  </FormControl>
                  <FormDescription>{description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={pending}>
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
      
    </>
  );
};
