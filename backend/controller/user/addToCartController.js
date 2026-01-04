const addToCartModel = require("../../models/cartProduct")

const addToCartController = async(req,res)=>{
    try{
        const { productId, squadId } = req?.body // 👈 GET SQUAD ID FROM BODY
        const currentUser = req.userId

        // Check if item already exists for this user/squad
        const isProductAvailable = await addToCartModel.findOne({ 
            productId, 
            userId: currentUser 
        })

        if(isProductAvailable){
            return res.json({
                message : "Already exists in cart",
                success : false,
                error : true
            })
        }

        const payload  = {
            productId : productId,
            quantity : 1,
            userId : currentUser,
            squadId : squadId, // 👈 SAVE IT HERE
        }

        const newAddToCart = new addToCartModel(payload)
        const saveProduct = await newAddToCart.save()

        res.json({
            data : saveProduct,
            message : "Product Added in Cart",
            success : true,
            error : false
        })

    }catch(err){
        res.json({
            message : err?.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = addToCartController