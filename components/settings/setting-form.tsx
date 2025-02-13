"use client";

import { Store } from "@prisma/client";
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

type SettingProps = {
  store: Store | null;
};

export const SettingForm = ({ store }: SettingProps) => {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: store?.name,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      axios
        .patch(`/api/store/${params.storeId}`, values)
        .then(() => {
          router.refresh();
          toast.success("sukses");
        })
        .catch(() => toast.error("error"));
    });

    router;
  }

  const onDelete = async () => {
    startTransition(() => {
      axios.delete(`/api/store/${params.storeId}`).then(() => {
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
        <Heading title="Pengaturan" description="Pengaturan Toko" />
        <Button
          variant={"destructive"}
          size={"icon"}
          disabled={pending}
          onClick={() => setOpen(true)}
        >
          <Trash />
        </Button>
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
                  <FormLabel>Nama Toko</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ubah nama toko"
                      {...field}
                      disabled={pending}
                    />
                  </FormControl>
                  <FormDescription>Ubah nama toko anda.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={pending}>
            Simpan
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/store/${params.storeId}`}
        variant="public"
      />
    </>
  );
};
