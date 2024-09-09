import { resend } from "@/lib/resend";
import  verificationEmail  from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    username:string,
    email:string,
    verifyCode:string

):Promise<ApiResponse>
{
    try {

        await resend.emails.send({
            from:'onboarding@resend.dev',
            to: "koustavjr11@gmail.com" /*email*/,
            subject: 'Verification code for Anonymous message',
            react: verificationEmail({username,otp:verifyCode}),
        })
        return {success:true,message:'Verification mail have been sent successfully'}
        
    } catch (Emailerror) {
        console.log('Email couldn\'t be send',Emailerror);

        return {success:false,message:'Verification mail couldn\'t be send!'}
        
    }
}