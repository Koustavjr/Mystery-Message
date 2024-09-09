"use client";

import { useParams, useRouter } from "next/navigation";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema } from "@/schemas/verifySchema";
import { useForm } from "react-hook-form";
import { Description } from "@radix-ui/react-toast";
import { useToast } from "@/hooks/use-toast";

export default function VerifyAccount() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });
  const params = useParams<{username:string}>();
  const router = useRouter();
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    
    try {
      
      const response = await axios.post<ApiResponse>("/api/verify-code", {
        username: params.username,
        code: data.code,
      });
      console.log("params "+params.username)
      toast({
        title: "Success!",
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "Verification failed",
        description:
          axiosError.response?.data.message ??
          "An Error Occureed. Please try again!",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the Verification Code send to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter OTP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Verify</Button>
          </form>
        </Form>
        
      </div>
    </div>
  );
}
