const UserModel  = require('../model/user.model');
const registerController = async (req , res) => {
    try {
        const {name , email ,mobile, password  } = req.body;
 if (!email || !password ||!mobile ||!name){
      return res.status(400).json({ success: false, message: "All fields are required" });}

        const isExist = await UserModel.findOne({email});
        if(isExist){
            
            return res.status(400).json({
                message:"User already exist with this email",
                success:false //means failed
                 //400 bad request 
            })
        }

        const newUser = await UserModel.create({name , email , mobile , password});
        const accessToken = newUser.generateAccessToken();
        const refreshToken = newUser.generateRefreshToken();
        
        res.cookie("accessToken", accessToken , {
            httpOnly:true ,
            maxAge: 15 * 60 * 1000
        })
        
        res.cookie("refreshToken", refreshToken , {
            httpOnly:true ,
            maxAge: 24 * 60 * 60 * 1000
        })
        
        return res.status(201).json({
            message:"User created successfully",
            success:true //201 for Created
        })
    } catch (error) {
        console.log("error in register",error)
        return res.status(500).json({
            message:"Internal server error",
            success:false}

        )
    }
}
const loginController = async (req, res) => {
    try {
        const {email , password} = req.body;
         if (!email || !password){
      return res.status(400).json({ success: false, message: "All fields are required" });}

        const isExisted = await UserModel.findOne({email}).select('+password') // beacause we did select:false in schema specifically on password ;
        if(!isExisted){
            return res.status(404).json({
                message:"User with this email does not exist",
                success:false
            })
        }
        const isMatch = await isExisted.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({
                message:"You entered a wrong password",
                success:false
            })
        }
// generating token for isExisted user id
const accessToken = isExisted.generateAccessToken();
const refreshToken = isExisted.generateRefreshToken();
    res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.status(200).json({
            message:"User logged in successfully",
            success:true, 
            user:isExisted
        })


    } catch (error) {
        console.error(`Error in login: ${error.message}`);
        console.log("error in login",error)
           return res.status(500).json({
            message:"Internal server error",
            success:false}
        )
    }
}

module.exports = { registerController , loginController};