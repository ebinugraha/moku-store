"use client";

import { useEffect, useState } from "react";
import { Modal } from "./modal";
import { Button } from "./button";

type AlertModalProps = {
  isOpen: boolean;
  onClick: () => void;
  onClose: () => void;
  loading: boolean;
};

export const AlertModal = ({
  isOpen,
  onClick,
  onClose,
  loading,
}: AlertModalProps) => {
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isMounted) {
      setMounted(true);
    }
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Aapakah anda yakin"
      description="ini akan hilang permanen"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button variant={"default"} onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant={"destructive"} disabled={loading} onClick={onClick}>
          Continue
        </Button>
      </div>
    </Modal>
  );
};
