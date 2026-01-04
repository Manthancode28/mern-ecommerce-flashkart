const addToCartModel = require("../../models/cartProduct")

const countAddToCartProduct = async (req, res) => {
    try {
        const userId = req.userId;
        // We look for the squad-id in headers or query params
        const squadId = req.headers['squad-id'];

        let count = 0;

        // Logic: If user is in a squad, count the shared cart.
        // Otherwise, count their individual cart.
        if (squadId && squadId !== "null" && squadId !== "undefined") {
            count = await addToCartModel.countDocuments({
                squadId: squadId
            });
        } else {
            count = await addToCartModel.countDocuments({
                userId: userId
            });
        }

        res.json({
            data: { count: count },
            message: "ok",
            error: false,
            success: true
        });
    } catch (error) {
        res.json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// CRITICAL: Ensure it is exported exactly like this
module.exports = countAddToCartProduct;