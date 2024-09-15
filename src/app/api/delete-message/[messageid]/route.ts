import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import {  User } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(request:Request,
    {params}:{params:{messageid:string}}
)
{   
    const messageId= params.messageid;
    await dbConnect();
    const session= await getServerSession(authOptions);
    const _user:User = session?.user;

    if(!session || !session.user)
    {
        return Response.json({
            success:false,
            message:"Not authenticated"
        },
    {status:400})
    }

    try {
        const updateResult = await UserModel.updateOne(
            {_id:_user._id},
            {$pull:{messages:{_id:messageId}}}
        )        

        if(updateResult.modifiedCount===0)
        {
            return Response.json({
                success:false,
                message:"Message already deleted"
            },
        {status:404})
        }

        return Response.json({
            success:true,
            message:"Message deleted"
        },
    {status:200})
    } catch (error) {
        return Response.json({
            success:false,
            message:"Error in deleting message"
        },
    {status:500})
    }

}