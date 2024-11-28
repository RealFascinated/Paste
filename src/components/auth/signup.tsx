"use client";

import { authClient } from "@/common/auth-client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export function Signup() {
  const { replace, refresh } = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    setError(null);
    const { error } = await authClient.signUp.email({
      name: username,
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
        description: "You have successfully signed up.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-300">Username</p>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

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

      <Button onClick={handleSignIn}>Signup</Button>
      {error && <p className="text-red-400 text-center">{error}</p>}
    </div>
  );
}
