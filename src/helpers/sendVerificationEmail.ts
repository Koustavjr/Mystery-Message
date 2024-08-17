import { resend } from "@/lib/resend";
import  {verificationEmail } from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    username:string,
    email:string,
    password:string

):Promise<ApiResponse>
{
    try {

        await resend.emails.send({
            from:'anonymousmessage@support.com',
            to: email,
            subject: 'Verification code for Anonymous message',
            react: verificationEmail({username,otp:password}),
        })
        return {success:true,message:'Verification mail have been sent successfully'}
        
    } catch (error) {
        console.log('Email couldn\'t be send',error);

        return {success:false,message:'Verification mail couldn\'t be send!'}
        
    }
}