const addToCartModel = require("../../models/cartProduct")

const addToCartViewProduct = async(req,res)=>{
    try{
        const currUser = req.userId
        const squadId = req.headers['squad-id']; // 👈 GET FROM HEADERS

        let query = { userId : currUser };
        
        // If in squad, fetch everything for that squad room
        if(squadId && squadId !== "null"){
            query = { squadId : squadId };
        }

        const allProduct = await addToCartModel.find(query).populate("productId")

        res.json({
            data : allProduct,
            success : true,
            error : false
        })

    }catch(err){
        res.json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = addToCartViewProduct