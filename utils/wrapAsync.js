//this is a function that is used to wrap the async function
//so that we can use the try catch block in the controller
//it is more like a middleware that is used to handle the error
//it is used to handle the error from the database
//our own error class now we can custom the error 

function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(err=>next(err));
    }
}

module.exports=wrapAsync;