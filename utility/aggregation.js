const Product = require('../models/product')

module.exports = async function aggregation(req, res){
    const {category="", priceMin, priceMax, title="", brand} = req.query;
    
  try{  const product = await Product.aggregate([
        {$match: {brand}},
        {$match:{price: {$gt:priceMin} && {$lt:priceMax}}},
        {$match: {title}},
        {$match: {category}}
           
    ])
    res.json(product)
}
catch(err){
    console.log(err);
}
}