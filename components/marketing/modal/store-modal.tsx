"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import axios from "axios";

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
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2).max(50),
});

export const StoreModal = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post("/api/store", values);
      toast.success('berhasil di buat')
      window.location.assign(`/${response.data.id}`)

    } catch (error) {
      toast.error("toko gagal di buat");
    }
  }

  const { isOpen, onClose } = useStoreModal();

  return (
    <Modal
      title="Buat toko anda"
      description="Tambahkan toko untuk memanajemen produk anda"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Toko</FormLabel>
                <FormControl>
                  <Input placeholder="ex: Moku Store..." {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </Modal>
  );
};
