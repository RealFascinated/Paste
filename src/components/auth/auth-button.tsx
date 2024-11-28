import { Button } from "@/components/button";
import Link from "next/link";
import { auth } from "@/common/auth";
import { headers } from "next/headers";
import { SignoutButton } from "@/components/auth/signout-button";

export async function AuthButton() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      {session == null ? (
        <Link href="/auth/login">
          <Button type="button">Login</Button>
        </Link>
      ) : (
        <SignoutButton />
      )}
    </>
  );
}
