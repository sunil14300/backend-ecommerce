const Joi = require('joi');

const signupValidation=(req,res,next)=>{
    const schema=Joi.object({
        username:Joi.string().min(3).max(100).required(),
        email:Joi.string().email().required(),
        password:Joi.string().min(3).max(100).required(),
        phone:Joi.string().pattern(/^\d{10}$/).required()
    });
    const {error}=schema.validate(req.body);
    if(error){
        return res.status(400).json({message:"Bad request"})
    }
    next();
}
const loginvalidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required()
    });

    const { error } = schema.validate(req.body);
    
    if (error) {
        console.log(error.details); // Log detailed error message
        return res.status(400).json({ message: "Bad request", error: error.details });
    }
    
    next();
};
module.exports={signupValidation,loginvalidation}