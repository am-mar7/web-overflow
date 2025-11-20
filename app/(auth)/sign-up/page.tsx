import AuthForm from "@/components/ui/froms/AuthForm";
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
