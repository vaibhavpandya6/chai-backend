import mongoose, { Schema } from "mongoose";

const subscriptioSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId, // one who is subscribing
        ref: "User"
    },
    channel:{
        type: Schema.Types.ObjectId, // user which is getting Subscribed
        ref: "User"
    }
},{timestamps:true})

export const Subscription = mongoose.model("Subscription",subscriptioSchema)    