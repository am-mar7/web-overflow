"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, FieldValues , useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { SignInSchema, SignUpSchema } from "@/lib/validation";

type AuthFromType<T extends FieldValues> = {
  defaultValues: T;
  formType: "SIGN_IN" | "SIGN_UP";
};
export default function AuthForm<T extends FieldValues>({
  defaultValues,
  formType,  
}: AuthFromType<T>) {
  // ...
  const formSchema :  typeof SignInSchema | typeof SignUpSchema = formType === "SIGN_IN" ? SignInSchema : SignUpSchema;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues as DefaultValues<T>,
  });
  console.log(formType);

  // 2. Define a submit handler.
  const handleSubmit = function () {
    // Handle form submission
    console.log("Form submitted:", form.getValues());
  };

  const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-8">
        {Object.keys(defaultValues).map((field, idx) => {
          return (
            <FormField
              key={field || idx}
              control={form.control}
              name={field as "email" | "password"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="paragraph-medium">
                    {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      type={field.name === "password" ? "password" : "text"}
                      {...field}
                      className="px-3 py-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        <p>
          {formType === "SIGN_IN"
            ? "Don't have account ? "
            : "Already have account ? "}
          {formType === "SIGN_IN" ? (
            <Link className="text-primary-gradient" href={ROUTES.SIGN_UP}>
              sign up
            </Link>
          ) : (
            <Link className="text-primary-gradient" href={ROUTES.SIGN_IN}>
              sign in
            </Link>
          )}
        </p>
        <Button
          type="submit"
          className="w-full bg-primary-gradient py-5 text-light-900 "
        >
          {form.formState.isSubmitting
            ? buttonText === "Sign In"
              ? "Signin in..."
              : "Creating account..."
            : buttonText === "Sign In"
            ? "Sign In"
            : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}
