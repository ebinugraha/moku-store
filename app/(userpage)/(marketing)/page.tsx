"use client"

import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

const MarketingPage = () => {
  const { isOpen, onOpen } = useStoreModal();

  useEffect(() => {
    if (!isOpen) {
        onOpen()
    }
  }, [isOpen, onOpen]);

  return <div>Marketing page</div>;
};

export default MarketingPage;
