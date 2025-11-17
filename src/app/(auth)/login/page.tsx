"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Logo from "@/components/logo";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  remember: z.boolean().optional(),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Mock API call
    console.log("Submitting login form", values);
    if (values.email && values.password) {
      // In a real app, you'd store a token in localStorage or a cookie
      localStorage.setItem("user", JSON.stringify({ email: values.email }));
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      router.push("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please check your email and password.",
      });
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <Logo className="mb-4 justify-center" />
        <CardTitle className="font-headline text-2xl">Sign In</CardTitle>
        <CardDescription>Use your StudioForge account to sign in.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link href="/forgot-password" passHref>
                      <Button variant="link" size="sm" className="p-0 h-auto">Forgot password?</Button>
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Remember me
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-brand-purple text-primary-foreground">Sign In</Button>
            <Button variant="outline" className="w-full">Sign In with Google</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" passHref>
            <Button variant="link" className="p-0 h-auto">Create account</Button>
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

    