'use client'

import {zodResolver} from "@hookform/resolvers/zod";
import * as z from 'zod'; 
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; 
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import React from 'react'
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

export default function SignInForm() {
  
  const {toast}=useToast()
  const router=useRouter()
  const form=useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      identifier:'',
      password:''
    }
  })
    const onSubmit=async(data:z.infer<typeof signInSchema>)=>{
        const result = await signIn('credentials',{
          redirect:false,
          identifier:data.identifier,
          password:data.password
        })

        if(result?.error)
        {
          if(result.error==='CredentialsSignin')
          {
            toast({
              title:"Failed to login",
              description:"Invalid email or password",
              variant:"destructive"
            })
          }
          else
          {
            toast({
              title:"Error",
              description:result.error,
              variant:"destructive"
            })
          }
        }
        if(result?.url)
        {
          router.replace('/dashboard')
        }
    }
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1>Welcome to the Mystery Message</h1>
            <p className="mb-4 text-black animate-pulse">Sign in to continue your journey</p>
          </div>
          <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          
            
          <FormField
            name="identifier"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
               
                <Input placeholder="Email/Username" {...field} name="email"
                />
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
               
                <Input placeholder="password" {...field} 
                name="password"
                />
                
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full flex justify-center items-center" >
            Sign in
             
            </Button>
        </form>
      </Form>
      
        </div>
      
      </div>
    )
 }
