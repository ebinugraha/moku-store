"use client";

import { Store } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

export const StoreSwitcher = ({ items = [] }: StoreSwitcherProps) => {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const formatedItems = items.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const currentStore = formatedItems.find(
    (item) => item.value === params.storeId
  );

  const [open, setOpen] = useState(false);

  const onStoreSelected = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          size="sm"
          variant={"outline"}
          aria-expanded={open}
          aria-label="Pilih toko"
          className={cn("w-[200px] justify-between")}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore?.label}
          <ChevronsUpDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Cari Toko..." />
          <CommandList>
            <CommandEmpty>Nama toko tidak ada</CommandEmpty>
            <CommandGroup heading="Toko">
              {formatedItems.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => {
                    setOpen(false);
                    onStoreSelected(item);
                  }}
                >
                  <StoreIcon className="mr-2" />
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      currentStore?.value === item.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup heading="Settings">
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
              >
                <PlusCircle className="mr-2" />
                Buat toko
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
