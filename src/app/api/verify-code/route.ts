import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request:Request)
{
    await dbConnect();

    try {
        const {username,code}= await request.json();
        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({
            username:decodedUsername
        })

        if(!user)
        {
            return Response.json({
                success:false,
                message:"user doesnot exist"
            },
        {status:404})
        }

        const isCodeValid= user.verifyCode===code;
        const isCodeNotExpired=new Date(user.verifyCodeExpiry)>new Date();

        if(isCodeValid && isCodeNotExpired)
        {
            user.isVerified=true;
            await user.save();

            return Response.json({
                success:true,
                message:"User verified succesfully"
            },
        {status:200})
        }
        else if(!isCodeNotExpired)
        {
            return Response.json({
                success:false,
                message:"verify code expired"
            },{status:400})
        }
        else
        {
            return Response.json({
                success:false,
                message:"Invalid verify code"
            },
        {status:401})
        }

    } catch (error) {
        console.log("Error in verifying the user");
        return Response.json({
            success:false,
            message:"error verifying the user"
        },{
            status:500
        })
        
    }
}