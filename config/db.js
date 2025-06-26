import mongoose from "mongoose";
let cached = global.mongoose || {conn:null, promise:null};
export default async function connectDB (){
     if(cached.conn) return cached.conn;
     if(!cached.promise){
          cached.promise = mongoose.connect(process.env.MONGODB_URI).then((mongoose)=>mongoose);
     }
     try{
          cached.conn = await cached.promise;
     }catch(e){
          console.error("error occured", e);
          cached.promise = null;
          throw e;
     }
     return cached.conn;
}