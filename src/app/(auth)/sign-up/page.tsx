'use client'
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from 'zod'; 
import { useDebounceCallback } from 'usehooks-ts';
import { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {Loader2} from 'lucide-react'
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button"; 
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/schemas/singnUpSchema";
import axios, { AxiosError } from 'axios';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import React from 'react'




export default function SignUpForm() {

    const [username,setUsername]=useState('');
    const [usernameMessage,setUsernameMessage]=useState('')
    const[isCheckingUsername,setIsCheckingUsername]=useState(false)
    const[isSubmitting,setIsSubmitting]=useState(false)
    const debounced = useDebounceCallback(setUsername, 300)
    

  const {toast}=useToast();
  const router= useRouter()
  const form = useForm<z.infer<typeof signUpSchema>>({
        resolver:zodResolver(signUpSchema),
        defaultValues:{
            username:"",
            email:'',
            password:""
        }
  })

    useEffect(()=>{
        const checkUniqueUsername=async ()=>{
          
          if(username)
          {
            setIsCheckingUsername(true);
            setUsernameMessage('');
           try {
            const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`);
            console.log(response);
            setUsernameMessage(response.data.message)
           } catch (error) {
            const axiosError=error as AxiosError<ApiResponse>;
            setUsernameMessage(axiosError.response?.data.message ?? 'Failure in sign-up')
           }finally{
            setIsCheckingUsername(false)
           }

          }
        }
        checkUniqueUsername()
    },
    [username]);
    
    const onSubmit=async(data:z.infer<typeof signUpSchema>)=>{
      setIsSubmitting(true)
      try {
        const response = await axios.post('/api/sign-up',data);
        toast({
          title:"Success",
          description:response.data.message
        })
        router.replace(`/verify/${username}`)
        setIsSubmitting(false)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        let errorMessage = axiosError.response?.data.message ?? 'theres error in signing up';

        toast({
          title:'sign up failed',
          description:errorMessage,
          variant:"destructive"
        })
        setIsSubmitting(false)
      }
    }

    return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1>Join the Mystery Message</h1>
          <p className="mb-4 text-black animate-pulse">Sign up to start your journey</p>
        </div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
             
              <Input placeholder="username" {...field} 
              onChange={(e)=>{
                field.onChange(e);
                debounced(e.target.value)
              }}
              />
              {isCheckingUsername && <Loader2 className="animate-spin"/>}
              {!isCheckingUsername && usernameMessage &&(
                <p className={`text-sm ${usernameMessage==='Username is unique'?'text-green-500':'text-red-500'}`}>
                  State:{usernameMessage}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        
          
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
             
              <Input placeholder="Email" {...field} name="email"
              />
              <p className="text-muted text-blue-400 text-sm">We will send you a verification code</p>
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
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {
            isSubmitting?(
              <>
              <Loader2 className="animate-spin mr-2 h-4 w-4"/>
              </>
            ):(
              'Sign Up'
            )
          }
          </Button>
      </form>
    </Form>
    <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-700 hover:text-blue-900"/>
            Sign in
          </p>
    </div>
      </div>
    
    </div>
  )
}
