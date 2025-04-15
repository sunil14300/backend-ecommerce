const { login, signup } = require('../controller/Authcontroller');
const { loginvalidation, signupValidation } = require('../middleware/Authvalidation');

const router = require('express').Router();
const Cart=require("./../models/cart");
const User=require('./../models/user');

// Corrected route for signup
router.post("/signup", signupValidation, signup);
router.post("/login", loginvalidation, login);

router.get("/login",async(req,res)=>{
try{
    const data=await User.find();
    console.log('Data fatched');
    res.status(200).json(data);
}catch(err){
    console.error("Error", err);
    res.status(500).json({ error: "Internal server error" });
}
})

router.post("/cart", async (req, res) => {
    try {
        //console.log("Received cart data:", req.body);
        const { product, price, quantity, image } = req.body;

        if (!product || !price || !quantity || !image) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newCartItem = new Cart({ product, price, quantity, image });
        const response = await newCartItem.save();

        console.log("Saved to MongoDB:", response); 
        res.status(201).json(response);
    } catch (err) {
        console.error("Error saving cart item:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.get("/cart",async(req,res)=>{
    try{
        const user=await Cart.find();
        console.log('data factched');
        res.status(200).json(user);

    }catch(err){
        console.log('Error fatching during ',err);
        res.status(500).json({error:'Internal server error'});
    }
})
router.delete("/cart/:id",async(req,res)=>{
    try{
        const cartId=req.params.id;
        const deleteCart=await Cart.findByIdAndDelete(cartId);
        console.log('data deleetd');
        res.status(200).json(deleteCart);
    }catch(err){
        console.log('data deleted');
        res.status(500).json({error:'Internal server error'});
    }
})

module.exports = router;
