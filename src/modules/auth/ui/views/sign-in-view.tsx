'use client';

import { useState } from 'react';

import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { OctagonAlertIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const SignInView = () => {

  const [error, setError] = useState<string | null>(null);
  const [loading, setloading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setError(null);
    setloading(true);
    authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL:"/"
      },
      {
        onSuccess: () => {
         setloading(false);
         
        },
        onError: ({ error }) => {
          setError(error.message);
            setloading(false);
        },
      }
    );


  };

     const onSocial = (provider : "github" | "google") => {
      setError(null);
      setloading(true);
      authClient.signIn.social(
        {
          provider : provider,
          callbackURL:"/"
        },
        {
          onSuccess: () => {
            setloading(false);
            
          },
          onError: ({ error }) => {
            setloading(false);
            setError(error.message);
          },
        }
      );
    }


  return (
    <div className="flex flex-col gap-6">
      <Card className="p-0 overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome Back</h1>
                  <p className="text-muted-foreground text-balance">
                    Login to your account
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="example@gmail.com" {...field} />
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {!!error && (
                  <Alert variant="destructive" className="border-none">
                    <OctagonAlertIcon className="h-4 w-4 text-destructive" />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}
                <Button disabled={loading} type="submit" className="w-full">
                  Sign In
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-10 after:flex after:items-center after:border-t after:border-border">
                  <span className="bg-card text-muted-foreground relative z-20 px-2">
                    or continue with
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button  
                     onClick={()=> onSocial("google")}
                  disabled={loading}  variant="outline" type="button" className="w-full">
                    <FaGoogle/>
    
                  </Button>
                  <Button 
                   onClick={()=> onSocial("github")}
                  disabled={loading}  variant="outline" type="button" className="w-full">
                    <FaGithub/>
                    
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <Link href="/sign-up" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </Form>

          <div className="bg-radial from-sidebar-accent to-sidebar hidden md:flex flex-col gap-y-4 items-center justify-center">
            <Image src="/logo.svg" alt="Logo" width={102} height={102} />
            <p className="text-2xl font-semibold text-white">Tandemly </p>
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground text-center text-xs text-balance *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you are agreeing to our{' '}
        <Link href="/terms" className="underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
};
