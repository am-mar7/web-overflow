import AuthForm from "@/components/forms/AuthForm";
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
