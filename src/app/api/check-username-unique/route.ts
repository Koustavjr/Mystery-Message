import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {usernameValidate} from '@/schemas/singnUpSchema'
import {z} from 'zod';

const UsernameQuerySchema=z.object({
    username:usernameValidate
})

export async function GET(request:Request)
{
    await dbConnect();

    try {
        const {searchParams} = new URL(request.url);
        const queryParams= {
            username:searchParams.get('username')
        }

        const result=UsernameQuerySchema.safeParse(queryParams);

        console.log(result);

        if(!result.success)
        {
            const usernameErrors=result.error.format().username?._errors||[];
            return Response.json({
                success:false,
                message:usernameErrors?.length >0?
                        usernameErrors?.join(", "):
                        "invalid username query"
            },{status:400})
        }

        const {username}=result.data;

        const existingVerifiedUser=await UserModel.findOne({
            username,
            isVerified:true
        })
        
        if(existingVerifiedUser)
        {
            return Response.json({
                success:false,
                message:"username already taken`"
            },
        {status:401})
        }

        return Response.json({
            success:true,
            message:"Username is unique"
        },
    {status:200})


    } catch (error) {
        console.log("Error in checking username ",error);
        return Response.json({
            success:false,
            message:"error in checking username"
        },
    {status:500})
        
    }
}