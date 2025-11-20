import AuthForm from "@/components/forms/AuthForm";
import { SignUpSchema } from "@/lib/validation";

export default function SignUp() {
  return (
    <AuthForm
      defaultValues={{ name: "", email: "", password: "" }}
      formType="SIGN_UP"
      formSchema={SignUpSchema}
    />
  );
}
