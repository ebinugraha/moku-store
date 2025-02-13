"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";

import { getCldImageUrl } from "next-cloudinary";

import { CldUploadWidget } from "next-cloudinary";

type ImageUploadProps = {
  disable?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
};

const ImageUploud = ({
  disable,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div key={url} className="w-[200px] h-[200px]">
            <Image alt="Image" src={url} width={200} height={200} />
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-center gap-4">
        <CldUploadWidget onSuccess={onUpload} uploadPreset="sw6bojps">
          {({ open }) => {
            const onClick = () => {
              open();
            };

            return (
              <Button
                type="button"
                disabled={disable}
                variant={"secondary"}
                onClick={onClick}
              >
                <ImagePlus />
              </Button>
            );
          }}
        </CldUploadWidget>
        {value.length > 0 && (
          <div className="">
            <Button
              type="button"
              onClick={() => onRemove(value[0])}
              variant={"destructive"}
            >
              <Trash />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploud;
