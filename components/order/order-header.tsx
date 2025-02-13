"use client";

import { Download, Plus, Sheet } from "lucide-react";
import { Button } from "../ui/button";
import { Heading } from "../ui/heading";
import { Separator } from "../ui/separator";
import { useParams, useRouter } from "next/navigation";
import * as XLSX from "xlsx";

export const OrderHeader = ({ formatedOrder }: { formatedOrder: any }) => {
  const onGetExportOrder = async (title?: string, worksheetname?: string) => {
    try {
      // Create Excel workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils?.json_to_sheet(formatedOrder);
      XLSX.utils.book_append_sheet(workbook, worksheet, worksheetname);
      // Save the workbook as an Excel file
      XLSX.writeFile(workbook, `${title}.xlsx`);
      console.log(`Exported data to ${title}.xlsx`);
    } catch (error: any) {
      console.log("#==================Export Error", error.message);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Order" description="Atur order anda di sini" />
        <Button onClick={() => onGetExportOrder("Order", "Order")}>
          Download <Download className="mr-2 h-4 w-4" />
        </Button>
      </div>
      <Separator />
    </>
  );
};
