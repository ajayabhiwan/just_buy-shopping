const productModel = require("../models/productModel");

/////get all product
const allproduct = async(req,res)=>{
    try {
        const getproduct = await productModel.find({});
        return res.status(200).json({success:true,message:"All Product Data get Successfully",data:getproduct})
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({success:false,message:error.message})
    }
}

/// get categories product data-----

const categoryDataProduct = async(req,res)=>{
    try {
        const id = req.params.id
        console.log("id----params---",id)

        const result = await productModel.find({categories:id});
        console.log("result-----",result);

        return res.status(200).json({success:true,message:"Category data get Successfully",data:result});
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({success:false,message:error.message})
    }
}

//get single data product-----

const getSingleProduct = async(req,res)=>{
    try {
        const id = req.params.id
        console.log("id----params---",id)

        const result = await productModel.findOne({_id:id});
        console.log("result-----",result);

        return res.status(200).json({success:true,message:"Single Details data Get Successfully",data:result});
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({success:false,message:error.message})
    }
}


/// paginations------
const pagination = async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1
        const limit = 5
        const totalproduct = await productModel.countDocuments();
        const totalpage = Math.ceil(totalproduct/limit)
        const nextpage = page < totalpage ? page +1 : null

        const products = await productModel.find({}).skip(parseInt(page-1)*limit).limit(limit)
        console.log("products-----",products)

        return res.status(200).json({success:true,message:"Pagination data Get Successfully",data:products,page:page,limit:limit,totalproduct:totalproduct,nextpage:nextpage});

    } catch (error) {
        console.log(error.message)
        return res.status(400).json({success:false,message:error.message})
    }
}


//// search api------

const search = async(req,res)=>{
    try {
        // const key = req.params.key
        const products = await productModel.find({
            $or:[
                {categories:{$regex:req.params.key,$options:"i"}},
                {title:{$regex:req.params.key,$options:"i"}},
                {company_name:{$regex:req.params.key,$options:"i"}}
                // {price:{$regex:parseInt(req.params.key),$options:"i"}}
            ]
        }) 

        return res.status(200).json({success:true,message:"search data Get Successfully",data:products})

    } catch (error) {
        console.log(error.message)
        return res.status(400).json({success:false,message:error.message}) 
    }
}

module.exports = {
    getSingleProduct,
    pagination,
    search,
    allproduct,
    categoryDataProduct
}
