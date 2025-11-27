import AuthForm from "@/components/forms/AuthForm";

export default function SignUp() {
  return (
    <AuthForm
      defaultValues={{ name: "", email: "", password: "" }}
      formType="SIGN_UP"
    />
  );
}
