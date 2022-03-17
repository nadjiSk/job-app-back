import mongoose from "mongoose";
import validator from 'validator'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const userSchema =  new mongoose.Schema ({
    name: {
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        },
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8

    },
    type: {
        type: String,
        enum: ["recruiter", "applicant"],
        required: true,
      }, 
tokens:[{
    token: {
        type: String,
        required: true
    }
}]
}, {
    timestamps: true
})

userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password ,8)
    }
    next()
})


userSchema.statics.findByCredentials = async(email, password) => {
    const user =  await User.findOne({email})

    if(!user){
        throw new Error("Unable to login: email does not exist")
    }

    const isMacth = await bcrypt.compare(password, user.password)
    if(!isMacth){
        throw new Error("Unable to login: pass does not match")
    }
    return user
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id:user._id.toString()}, "mysecret")
    console.log("token is: ", token)     
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token

}



const User = mongoose.model("User", userSchema)
export default User