"use client";

import { authClient } from "@/common/auth-client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export function SignIn() {
  const { replace, refresh } = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    setError(null);
    const { error } = await authClient.signIn.email({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message!);
      return;
    } else {
      replace("/");
      refresh();

      toast({
        title: "Success",
        description: "You have successfully signed in.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-300">Email</p>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-300">Password</p>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full items-center">
        <Button onClick={handleSignIn} className="w-full">
          Sign In
        </Button>
        <Link href="/auth/signup" className="w-full">
          <Button className="w-full" variant="secondary">
            Sign Up
          </Button>
        </Link>
      </div>
      {error && <p className="text-red-400 text-center">{error}</p>}
    </div>
  );
}
