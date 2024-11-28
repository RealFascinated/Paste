import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { SignIn } from "@/components/auth/signin";
import { Signup } from "@/components/auth/signup";

type AuthProps = {
  params: Promise<{
    type: string;
  }>;
};

type AuthType = {
  type: string;
  render: () => ReactNode;
};

const authTypes: AuthType[] = [
  {
    type: "login",
    render: () => <SignIn />,
  },
  {
    type: "signup",
    render: () => <Signup />,
  },
];

export default async function Auth({ params }: AuthProps) {
  const type = (await params).type;
  const auth = authTypes.find((auth) => auth.type === type);
  if (auth == null) {
    return redirect("/");
  }

  return (
    <div className="items-center justify-center w-full h-full flex flex-grow">
      <div className="bg-background-secondary rounded-md p-3 w-[400px]">
        {auth.render()}
      </div>
    </div>
  );
}
