const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");


const router = express.Router();

// @route POST /api/ products
//@desc create a new product
//@access private/Admin
router.post("/", protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
        } = req.body;

        const product = new Product({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            user: req.user._id,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route Put/ api/products/:id
// @desc Update an existing product ID
// @access Private/Admin

router.put("/:id", protect, admin, async (req, res) => {
    try{
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
        } = req.body;

        // Find product by id
        const product = await Product.findById(req.params.id);

        if(product) {
            // update product fields
            product.name = name || product.name;
            product.description = description || product.description;
            product.price =  price|| product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender = gender || product.gender;
            product.images = images || product.images;
            product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;
            product.sku = sku || product.sku;


            // save the update product

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({message: "Product not found"});
        }

    } catch (error){
        console.error();
        res.status(500).send("Server Error");

    }
});


// @route DELETE / api/products/:id
// @desc delete a product byId
// @access privete/admin
 
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        // Find the product by Id
         const product = await Product.findById(req.params.id);
         if (product) {
            // remove the product from db
            await product.deleteOne();
            res.json({ message: "Product Removed"});
         }else {
            res.status(404).json({ message: "Product not found"});
         }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error")
        
    }
});

// @route Get / api / products
// @desc get all products with optional qury filters
// @access Public

router.get("/", async (req, res) => {
    try{
        const { collection , size,colors , gender, minPrice, maxPrice, sortBy, search, category, material, brand, limit} = req.query;

        let query = {};

        // filter logic
        if(collection && collection.toLocaleLowerCase() !== "all"){
            query.collection = collection;
        }

        if(category && category.toLocaleLowerCase() !== "all"){
            query.category = category;
        }

        if(material){
            query.material = {$in: material.split(",")};    
        }

        if(brand){
            query.brand = {$in: brand.split(",")};    
        }

        if(size){
            query.sizes = {$in: size.split(",")};    
        }

        if(colors){
            query.colors = {$in: [colors]};    
        }

        if(gender){
            query.gender = gender;
        }

        if(minPrice || maxPrice){
            query.price ={};
            if(minPrice) query.price.$gte = Number(minPrice);
            if(maxPrice) query.price.$lte = Number(maxPrice);
        }

        if(search){
            query.$or = [
                {name: {$regex: search, $options:"i"}},
                {description: {$regex: search, $options:"i"}}
            ]
        }
        // sort Logic

        let sort = {};

        if(sortBy){
            switch (sortBy){
              case "priceAsc":
                sort = { price: 1};
                break;
              case "priceDesc":
                sort = { price: -1};
                break;
              case "popularity":
                sort = { rating: -1};
                break;
              default:
                break;
            }
        }


        // Fetch products and apple sorting and limit
        let products = await Product.find(query).sort(sort).limit(Number(limit) || 0);
        res.json(products);

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
        
    }
})



module.exports = router;