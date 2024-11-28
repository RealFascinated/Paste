"use client";

import { authClient } from "@/common/auth-client";
import { Button } from "@/components/button";
import { useRouter } from "next/navigation";

export function SignoutButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      onClick={() => {
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.refresh();
            },
          },
        });
      }}
    >
      Logout
    </Button>
  );
}
