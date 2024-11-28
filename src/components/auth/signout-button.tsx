"use client";

import { authClient } from "@/common/auth-client";
import { Button } from "@/components/button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

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
              toast({
                title: "Success",
                description: "You have successfully signed out.",
              });
            },
          },
        });
      }}
    >
      Logout
    </Button>
  );
}
