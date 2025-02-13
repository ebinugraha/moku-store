"use client";

import { Banner, Category, Store } from "@prisma/client";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { z } from "zod";
import { useState, useTransition } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AlertModal } from "../ui/alert-modal";
import { ApiAlert } from "../ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import ImageUploud from "../ui/image-uploud";
import Link from "next/link";

type CategoryProps = {
  category: Category | null;
  banner: Banner[] | null;
};

export const CategoryForm = ({ category, banner }: CategoryProps) => {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  const formSchema = z.object({
    bannerId: z.string().min(2, {
      message: "label must be at least 2 characters.",
    }),
    name: z.string().min(2, {
      message: "name must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: category || {
      bannerId: "",
      name: "",
    },
  });

  const title = category ? "Edit category" : "Tambah category";
  const description = category ? "Edit category" : "Tambah category";
  const toastMessage = category
    ? "Category Telah ubah"
    : "Category telah dibuat";
  const action = category ? "Simpan" : "Tambah";

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {

    console.log(values)

    startTransition(() => {
      if (category) {
        axios
          .patch(
            `/api/store/${params.storeId}/category/${params.bannerId}`,
            values
          )
          .then(() => {
            toast.success(toastMessage);
            router.push(`/${params.storeId}/category`);
          })
          .catch(() => toast.error("Tidak bisa Mengubah category"));
      } else {
        axios
          .post(`/api/store/${params.storeId}/category`, values)
          .then(() => {
            toast.success(toastMessage);
            router.push(`/${params.storeId}/category`);
          })
          .catch(() => toast.error("Tidak bisa menambah category"));
      }
    });
  }

  const onDelete = async () => {
    startTransition(() => {
      axios
        .delete(`/api/store/${params.storeId}/category/${params.categoryId}`)
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
        <Heading title="Category" description="Membuat category" />
        {category && (
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormItem>
                    <FormLabel>{title}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Buat nama category"
                        {...field}
                        disabled={pending}
                      />
                    </FormControl>
                    <FormDescription>{description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bannerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={pending}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Banner" defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {banner?.map((banner) => (
                        <SelectItem key={banner.id} value={banner.id}>
                          {banner.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Pilih billboard untuk category ini
                  </FormDescription>
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
