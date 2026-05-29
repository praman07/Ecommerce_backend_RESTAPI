const mongoose = require('mongoose');
//productschema 
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,"Product name is required"],
        lowercase:true,
    },
    description:{
        type:String,
        trim:true,
        minLength:[5,"Product description cannot be empty"]
    },
    price:{
        type:Number,
        required:[true,"price is required field"],
        trim:true,
        min:[0,"Product price cannot be -ve"]  //with number dtype min works , minlength doesn't

    },
    category:{
        type:String,
        lowercase:true,
    },
    images:{
        type:[String],
        default:[]
    }

},
{
    timestamps:true
})
//productmodel 
const Product = mongoose.model("product",productSchema);
module.exports = Product;