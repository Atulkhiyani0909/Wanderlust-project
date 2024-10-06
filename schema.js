const Joi = require('joi');//joi is a library that is used to validate the data 

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
