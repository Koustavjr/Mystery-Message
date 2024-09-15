import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import {User} from 'next-auth';

export async function POST(request:Request)
{
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user:User= session?.user;

    if(!session || !session.user)
    {
        return Response.json({
            success:false,
            message:"Problem in accept-message"
        },
    {status:402});
    }

    const userId=user._id;
    const {acceptMessages}=await request.json();
    try {
        const newUser= await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessages:acceptMessages},
            {new:true}
        )

        if(!newUser)
        {
            return Response.json({
                success:false,
                message:"User not found"
            },
        {status:404});
        }

        return Response.json({
            success:true,
            message:"message status updated",
            newUser
        },
    {status:200});

    } catch (error) {
        return Response.json({
            success:false,
            message:"Problem in accept-message"
        },
    {status:500});   
    }
    

}

export async function  GET(request:Request)
{
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user:User= session?.user;
    if(!session || !session.user)
    {
        return Response.json({
            success:false,
            message:"not authenticated"
        },
    {status:400});
    }

    const userId = user._id;

    try {
        const foundUser=await UserModel.findById(userId);
        
        if(!foundUser)
        {
            return Response.json({
                success:false,
                message:"user not found"
            },
        {status:404});
        }

       return  Response.json({
            success:true,
            message:foundUser.isAcceptingMessages + " "+foundUser.username
        },
    {status:200});
        
    } catch (error) {
        return Response.json({
            success:false,
            message:"Problem in accept-message"
        },
    {status:500});
    }
}
