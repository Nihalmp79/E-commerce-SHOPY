const express = require("express");
const Cart = require("../models/Cart");
const { protect } = require("../middleware/authMiddleware");
const Product = require("../models/Product");
const { get } = require("mongoose");

const router = express.Router();

// heleper function to get cart by userId or guestId
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId: guestId });
    }
    return null;
}

// @route   post /api/cart
// @desc    Add a product to cart fot a guest og logged in user
// @access  Public
router.post("/", async (req, res) => {
    const { guestId, productId, size, color, quantity, userId } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Determine if the user is logged in or a guest
        let cart = await getCart(userId, guestId);

        // If the cart exists, update it
        if(cart) {
            const itemIndex = cart.products.findIndex((p) => 
             p.productId.toString() === productId &&
             p.size === size &&
             p.color === color
  );

            if (itemIndex > -1) {
                // if the product exists in the cart, update the quantity
                cart.products[itemIndex].quantity += quantity;
            } else {
                // add new product to cart
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity,
                });
    }

            // recalculate total price
            cart.totalPrice = cart.products.reduce((total, item) => total + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json(cart);
        } else {
            // create a new cart for the guest or user
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products: [{
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity,
                }],
                totalPrice: product.price * quantity,
            });
            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});


// @route GET/api/cart
// @desc upadate product quantity in cart for a guest or logged in user
// @access Public

router.put("/", async (req, res) => {
    const {productId, size, color, quantity, userId, guestId} = req.body;
    try {
        let cart = await getCart(userId, guestId);
        if(!cart) return res.status(404).json({message: "Cart not found"});

        const producttIndex = cart.products.findIndex((p) => p.productId.toString() === productId && p.size == size && p.color === color);

        if(producttIndex > -1){
            // update quantity
            if(quantity > 0){
                cart.products[producttIndex].quantity = quantity;
            } else {
                cart.products.splice(producttIndex, 1); //Remove product if quantity is 0
            }

            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json(cart);
        }else {
            return res.status(404).json({message: "Product not found in cart"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
        
    }
});



// @route DELETE /api/cart
// @desc Remove a product from cart 
// @access Public

router.delete("/", async (req, res) => {
    const {productId, size, color, userId, guestId} = req.body;
    try {
        let cart = await getCart(userId, guestId);
        if(!cart) return res.status(404).json({message: "Cart not found"});

        const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId && p.size == size && p.color === color);

        if(productIndex > -1){
            cart.products.splice(productIndex, 1); //Remove product
            
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json(cart);
        } else{
            return res.status(404).json({message: "Product not found in cart"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
});


// @route GET /api/cart
// @desc Get cart for a guest or logged in user
// @access Public
router.get("/", async (req, res) =>{
    const {userId, guestId} = req.query;

    try{
        const cart = await getCart(userId, guestId);
        if(cart) {
            res.json(cart);
        } else {
            res.status(200).json({message: "Cart not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }

});

// @route Post /api/cart/merge
// @desc Merge guest cart with user cart into user cart on login
// @access Public
router.post("/merge", protect, async (req, res) => {
    const { guestId } = req.body;

    try {
        // Find guest cart and user cart
        const guestCart = await Cart.findOne({ guestId });
        const userCart = await Cart.findOne({ user: req.user._id });

        if (guestCart) {
            if(guestCart.products.length === 0){
                return res.status(404).json({message: "Guest cart is empty"});
            }
            if (userCart) {
                // Merge guest cart into user cart
                guestCart.products.forEach((guestItem) => {
                    const productIndex = userCart.products.findIndex((userItem) => 
                        item.productId.toString() === guestItem.productId.toString() &&
                     item.size === guestItem.size &&
                      item.color === guestItem.color
                    );
                    if (productIndex > -1) {
                        // if the items exists in user cart, update the quantity
                        userCart.products[productIndex].quantity += guestItem.quantity;
                    }else {
                        // other wise, add the gust item to the cart
                        userCart.products.push(guestItem);
                    }
                });

                userCart.totalPrice = userCart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
                await userCart.save();

                // Remove guest cart after merging
                try {
                    await Cart.findByIdAndDelete({ guestId});
                } catch (error) {
                    console.error("Enter deleting guest cart:" , error);
                }
                res.status(200).json(userCart);
            } else {
                // if the user has no existing cart, assighn the guest cart to the user
                guestCart.user = req.user._id;
                guestCart.guestId = undefined;
                await guestCart.save();
                res.status(200).json(guestCart);
            }
        } else{
            if(userCart){
                // guest cart has already been merged, return user cart
                return res.status(200).json(userCart); 
            }
            res.status(404).json({message: "Guest cart not found"});    
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
})


module.exports = router;