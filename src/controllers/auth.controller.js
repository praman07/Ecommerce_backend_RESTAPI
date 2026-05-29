const {User , hashpass} = require('../model/user.model');
const registerController = async (req , res) => {
    try {
        const {name , email ,mobile, password  } = req.body;

        const isExist = await User.findOne({email});
        if(isExist){
            return res.status(400).json({
                message:"User already exist with this email",
                success:false //means failed
                 //400 bad request 
            })
        }
        const newUser = await User.create({name , email , mobile , password});
        return res.status(201).json({
            message:"User created successfully",
            success:true //201 for Created
        })
    } catch (error) {
        return res.status(500).json({
            message:"Internal server error",
            success:false}

        )
    }
}


const loginController = async (req, res) => {
    try {
        const {email , password} = req.body;
        const isExisted = await User.findOne({email}).select('+password') // beacause we did select:false in schema specifically on password ;
        if(!isExisted){
            return res.status(409).json({
                message:"User with this email does not exist",
                success:false
            })
        }
        const isMatch = isExisted.comparePassword (password);
        if(!isMatch){
            return res.status(401).json({
                message:"You entered a wrong password",
                success:false
            })
        }
        return res.status(200).json({
            message:"User logged in successfully",
            success:true, 
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                
            }
        })


    } catch (error) {
        console.error(`Error in login: ${error.message}`);
           return res.status(500).json({
            message:"Internal server error",
            success:false}
        )
    }
}

module.exports = {registerController , loginController};