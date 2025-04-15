const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
    product: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
    image: {
        type: String, // Store image URL or filename
        required: true,
    },
    total: {
        type: Number,
    },
});

// Middleware to automatically calculate total before saving
CartSchema.pre("save", function (next) {
    this.total = this.price * this.quantity; // Auto-calculate total
    next();
});

const CartModel = mongoose.model("Cart", CartSchema);
module.exports = CartModel;
