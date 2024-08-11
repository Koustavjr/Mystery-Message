import mongoose from "mongoose"

type connectionObject={
    isConnected?:number;
}

const connection:connectionObject={}

async function  dbConnect():Promise<void>{
   
    if(connection.isConnected)
    {
        console.log("Database is already connected!");
        return;    
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || '',{});

        connection.isConnected=db.connections[0].readyState;
        console.log(db.connections);
        
        console.log("Database Connection Established!");
        


    } catch (error) {
        console.log("Error while connecting with database! ",error);
        process.exit(1);
        
    }

}

export default dbConnect;