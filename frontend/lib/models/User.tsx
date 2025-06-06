import mongoose from "mongoose";

const FundRaiseSchema=new mongoose.Schema({
    name:{
        type:String,
        default:""
    },
    address:{
        type:String,
        required:true
    },
    upvoted:{
        type:Array<Number>,
        default:[]
    },
    created:{
        type:Array<Number>,
        default:[]
    }
    
})

const FundRaise=mongoose.models.FundRaise||mongoose.model("FundRaise",FundRaiseSchema);

export default FundRaise;