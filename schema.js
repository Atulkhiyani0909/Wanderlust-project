const Joi = require('joi');//joi is a library that is used to validate the data 
const review = require('./models/review');

const listingSchema=Joi.object({
   
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().required(),
        
        //image:joi.string().allow('',null),
   
}).required();

module.exports.listingSchema=listingSchema;


// for validating the joi schema for the reviews
module.exports.reviewSchema=Joi.object({
        review: Joi.object({
                rating:Joi.number().required().min(1).max(5),
                comment:Joi.string().required(),
        }).required()
})