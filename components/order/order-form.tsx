"use client";

import { Banner, Store } from "@prisma/client";
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

type BannerProps = {
  banner: Banner | null;
};

export const BannerForm = ({ banner }: BannerProps) => {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  const formSchema = z.object({
    label: z.string().min(2, {
      message: "label must be at least 2 characters.",
    }),
    imageUrl: z.string().min(2, {
      message: "Image url must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: banner || {
      label: "",
      imageUrl: "",
    },
  });

  const title = banner ? "Edit banner" : "Tambah banner";
  const description = banner ? "Edit banner" : "Tambah banner";
  const toastMessage = banner ? "Banner Telah ubah" : "Banner telah dibuat";
  const action = banner ? "Simpan" : "Tambah";

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      if (banner) {
        axios
          .patch(
            `/api/store/${params.storeId}/banner/${params.bannerId}`,
            values
          )
          .then(() => {
            toast.success(toastMessage);
            router.push(`/${params.storeId}/banners`);
          })
          .catch(() => toast.error("Tidak bisa Mengubah banner"));
      } else {
        axios
          .post(`/api/store/${params.storeId}/banner`, values)
          .then(() => {
            toast.success(toastMessage);
            router.push(`/${params.storeId}/banner`);
          })
          .catch(() => toast.error("Tidak bisa menambah banner"));
      }
    });

    router;
  }

  const onDelete = async () => {
    startTransition(() => {
      axios
        .delete(`/api/store/${params.storeId}/banner/${params.bannerId}`)
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
        <Heading title="Banner" description="Membuat banner" />
        {banner && (
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUploud
                    value={field.value ? [field.value] : []}
                    disable={pending}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{title}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Buat nama banner"
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
