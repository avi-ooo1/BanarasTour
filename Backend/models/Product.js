import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{type:String, required:true},
    description:{type:String, required:true},
    inStock:{type:Boolean, required:true},
    image:{type:String, required:true},
    category:{type:String, required:true},
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
   
},{timestamps:true})  

export const Product = mongoose.models.product || mongoose.model("product",productSchema);

export default Product;