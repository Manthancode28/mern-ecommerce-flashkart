const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    productName : String,
    brandName : String,
    category : String,
    productImage : [],
    description : String,
    price : Number,
    sellingPrice : Number,
    // NEW: Inventory tracking for real-time stock updates
    stock: {
        type: Number,
        default: 50
    },
    // NEW: To support the "Customize item" feature you mentioned
    availableColors: [String],
    availableSizes: [String]
},{
    timestamps : true
})

const productModel = mongoose.model("product",productSchema)

module.exports = productModel