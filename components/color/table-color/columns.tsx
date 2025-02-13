"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { CellAction } from "./cell-action";
import { cn } from "@/lib/utils";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ColorType = {
  no: number;
  id: string;
  label: string;
  value: string;
  createdAt: string;
};

export const columns: ColumnDef<ColorType>[] = [
  {
    accessorKey: "no",
    header: "No",
  },
  {
    accessorKey: "label",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Label
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Value
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-2">
          <div className="text-sm text-muted-foreground">
            {row.getValue("value")}
          </div>
          <div
            className={cn(
              "h-6 w-6 rounded-full border-2",
              
            )}
            style={{ backgroundColor: row.getValue("value") }}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const id = row.original.id;

      return <CellAction id={id} />;
    },
  },
];
// id: string;
//     storeId: string;
//     label: string;
//     imageUrl: string;
//     createdAt: Date;
//     updated: Date;
