"use client";

import { Banner, Color, Size, Store } from "@prisma/client";
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

type ColorProps = {
  color: Color | null;
};

export const ColorForm = ({ color }: ColorProps) => {
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
    defaultValues: color || {
      label: "",
      value: "",
    },
  });

  const title = color ? "Edit color" : "Tambah color";
  const description = color ? "Edit color" : "Tambah color";
  const toastMessage = color ? "Color Telah ubah" : "Color telah dibuat";
  const action = color ? "Simpan" : "Tambah";

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      if (color) {
        axios
          .patch(
            `/api/store/${params.storeId}/color/${params.colorId}`,
            values
          )
          .then(() => {
            toast.success(toastMessage);
            router.push(`/${params.storeId}/color`);
          })
          .catch(() => toast.error("Tidak bisa Mengubah color"));
      } else {
        axios
          .post(`/api/store/${params.storeId}/color`, values)
          .then(() => {
            toast.success(toastMessage);
            router.push(`/${params.storeId}/color`);
          })
          .catch(() => toast.error("Tidak bisa menambah color"));
      }
    });

    router;
  }

  const onDelete = async () => {
    startTransition(() => {
      axios
        .delete(`/api/store/${params.storeId}/color/${params.colorId}`)
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
        <Heading title="Color" description="Membuat color" />
        {color && (
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
                      placeholder="Buat nama Warna"
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
                      placeholder="Beri nilai Warna"
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
