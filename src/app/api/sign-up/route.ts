import dbConnect from "@/lib/dbConnect";
import bcrypjs from 'bcryptjs';
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User";


export async function POST(request:Request)
{
    await dbConnect();

    try {
        const {username,email,password}= await request.json();
        
        const existingVerifiedUserByUsername= await UserModel.findOne({
            username,
            isVerified:true
        });

        if(existingVerifiedUserByUsername)
        {
            return Response.json({
              success:false,
              message:"username already taken"  
            },
            {status:400}
        )
        }

        const existingUserByEmail= await UserModel.findOne({email});
        let verifyCode= Math.floor(100000 + Math.random() * 900000).toString();
        if(existingUserByEmail)
        {
            if(existingUserByEmail.isVerified)
            {
                return Response.json({
                    success:false,
                    message:"user with this mail already exists"
                },
            {status:400})
            }
            else
            {
                const hashedPassword= await bcrypjs.hash(password,10);
                existingUserByEmail.password=hashedPassword;
                existingUserByEmail.verifyCode=verifyCode;
                existingUserByEmail.verifyCodeExpiry=new Date(Date.now() + 3600000).toString();

                await existingUserByEmail.save()
            }
        }
        else
        {
            const hashedPassword= await bcrypjs.hash(password,10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
            });

            await newUser.save()
        }


        const emailResponse=await sendVerificationEmail(username,email,verifyCode);

        console.log(emailResponse.success)
        if(!emailResponse.success)
        {
            return Response.json({
                success:false,
                message:"error sending verification mail"
            },
        {status:400})
        }

        return Response.json({
            success:true,
            message:"User registered succesfully! please verify through the code!"
        },{
            status:201
        })

    } catch (error) {
        console.log('Error registering user',error);

        return Response.json({
            success:false,
            message:"Registration Failed"
        },
    {
        status:500
    }
    )
        
    }
}