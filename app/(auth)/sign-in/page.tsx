import AuthForm from "@/components/ui/froms/AuthForm";
import { SignInSchema } from "@/lib/validation";
import React from "react";

export default function SignIn() {
  return (
    <AuthForm
      defaultValues={{ email: "", password: "" }}
      formType="SIGN_IN"
      formSchema={SignInSchema}
    />
  );
}
