import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import {User} from 'next-auth';
import mongoose from "mongoose";

export async function GET(request:Request)
{
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user: User = session?.user;
    console.log("Session "+session);
    
    
    if(!session || !_user)
    {
       return Response.json({
            success:false,
            message:"Problem in get-messages"
        },
    {status:404});
    }
    const userId= new mongoose.Types.ObjectId(_user._id);

    try {
        const user =await UserModel.aggregate([
            {$match:{_id:userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{'$push':'$messages'}}}

        ])

        if(!user || user.length==0)
        {
            return Response.json({
                success:false,
                message:"User not found"
            },
        {status:404});
        }

        return Response.json({
            success:true,
            messages:user[0].messages
        },
    {status:200});


    } catch (error) {
        return Response.json({
            success:false,
            message:"Problem in get-message"
        },
    {status:500});
    }
}
