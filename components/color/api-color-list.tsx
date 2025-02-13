"use client";

import { useOrigin } from "@/hooks/use-origin";
import { ApiAlert } from "../ui/api-alert";

export const ApiColorList = ({
  storeId,
}: {
  storeId: string;
}) => {
  const origin = useOrigin();
  return (
    <div className="space-y-2">
      <ApiAlert
        title="GET"
        description={`${origin}/api/store/${storeId}/color`}
        variant="public"
      />
      <ApiAlert
        title="GET_API_BY_ID"
        description={`${origin}/api/store/${storeId}/color/{colorId}`}
        variant="public"
      />
    </div>
  );
};
