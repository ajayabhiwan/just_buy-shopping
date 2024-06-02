const express = require("express")
const productRoute = express();
const productController = require("../controllers/productController");
productRoute.use(express.json());
productRoute.use(express.urlencoded({extended:true}))
productRoute.use("/product",express.static("./public.images"));

productRoute.get("/products",productController.allproduct)
productRoute.get("/category/:id",productController.categoryDataProduct);
productRoute.get("/details/:id",productController.getSingleProduct);
productRoute.get("/page",productController.pagination);
productRoute.get("/search/:key",productController.search)

module.exports = productRoute

