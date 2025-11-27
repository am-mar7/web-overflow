import AuthForm from "@/components/forms/AuthForm";

export default function SignIn() {
  return (
    <AuthForm
      defaultValues={{ email: "", password: "" }}
      formType="SIGN_IN"
    />
  );
}
