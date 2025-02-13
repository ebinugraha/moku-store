"use client";

import { Category, Color, Images, Product, Size } from "@prisma/client";
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
import ImageUploud from "../ui/image-uploud";
import { Checkbox } from "../ui/checkbox";

type ProductProps = {
  product:
    | (Omit<Product, "price"> & {
        price: string | number; // Convert Decimal to string or number
        images: Images[];
      })
    | null;

  category: Category[] | null;
  sizes: Size[] | null;
  colors: Color[] | null;
};

export const ProductForm = ({
  product,
  category,
  sizes,
  colors,
}: ProductProps) => {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "name must be at least 2 characters.",
    }),
    images: z
      .object({
        url: z.string(),
      })
      .array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: product
      ? {
          ...product,
          price: parseFloat(String(product?.price)),
        }
      : {
          name: "",
          images: [],
          price: 0,
          categoryId: "",
          colorId: "",
          sizeId: "",
          isFeatured: true,
          isArchived: false,
        },
  });

  const title = product ? "Edit product" : "Tambah product";
  const description = product ? "Edit product" : "Tambah product";
  const toastMessage = product ? "Product Telah ubah" : "Product telah dibuat";
  const action = product ? "Simpan" : "Tambah";

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      if (product) {
        axios
          .patch(
            `/api/store/${params.storeId}/product/${params.productId}`,
            values
          )
          .then(() => {
            toast.success(toastMessage);
            router.push(`/${params.storeId}/product`);
          })
          .catch(() => toast.error("Tidak bisa Mengubah product"));
      } else {
        axios
          .post(`/api/store/${params.storeId}/product`, values)
          .then(() => {
            toast.success(toastMessage);
            router.push(`/${params.storeId}/product`);
          })
          .catch(() => toast.error("Tidak bisa menambah product"));
      }
    });

    router;
  }

  const onDelete = async () => {
    startTransition(() => {
      axios
        .delete(`/api/store/${params.storeId}/product/${params.productId}`)
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
        <Heading title="Product" description="Membuat product" />
        {product && (
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
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUploud
                    value={field.value.map((image) => image.url)}
                    disable={pending}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Masukan Nama Product</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tambah nama product"
                      {...field}
                      disabled={pending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Masukan Harga Product</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Buat harga product"
                      {...field}
                      disabled={pending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pilih kategori</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={pending}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Pilih Kategori"
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {category?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ukuran</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={pending}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Pilih Ukuran"
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes?.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warna</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={pending}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Pilih Warna"
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors?.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          {color.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-4 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Fitur</FormLabel>
                    <FormDescription>
                      Ini akan di tampilkan di halaman
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Arsip</FormLabel>
                    <FormDescription>
                      Tidak akan di tampilkan dimanapun
                    </FormDescription>
                  </div>
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
