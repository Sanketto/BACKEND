const Product = require('../models/product')

module.exports =  async function paginate(req, res, next){
   try {
    
    const {page = 1, limit = 10} = req.query;
    const product = await Product.find()
    .limit(limit * 1)
    .skip((page - 1) * limit)

    const count = await Product.countDocuments();
   
    const data = {
        product,
        totalPages: Math.ceil(count / limit),
        currentPage: page
    }
    res.json(data)
}
    catch(err){
        next(err);
    }
}

