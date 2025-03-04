class ExpressError extends Error{//this will inherit the properties of the in built error class and make out own error 
    constructor(message,statusCode){
    super();
    this.message=message;
    this.statusCode=statusCode;
}
}

module.exports=ExpressError;