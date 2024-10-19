const User=require("../models/user");

module.exports.signupForm=(req,res)=>{
    res.render("user/signup.ejs");
};


module.exports.signupFormData=async(req,res)=>{ 
    try{ 
        let {username,password,email}=req.body; 
        const newUser=new User({email,username}); 
        
        let userregistered=await User.register(newUser,password); 
        
        //this is login after signup user signup and auto login after this 
        req.login(userregistered,(err)=>{ 
            if(err){ // Fixed the condition here
               return next(err); 
            } 
            console.log(userregistered); 
            req.flash("success","Welcome to WanderLust"); 
            res.redirect("/listings"); 
        }); // Moved the closing parenthesis and semicolon here
    } catch (error) { // Added error handling
        console.error(error);
        req.flash("error", "Signup failed. Please try again.");
        res.redirect("/signup"); // Redirect to signup on error
    }
};


module.exports.getLoginForm=(req,res)=>{
    res.render("user/login.ejs");
};


module.exports.loginFormData=async(req,res)=>{
    let {username}=req.body;
req.flash("success",`Welcome Back to WanderLust`);
let redirect=res.locals.redirectUrl || "/listings";
//by this make the flow of the page

res.redirect(redirect);
};


module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
      if(err){
        next(err);
      }
      req.flash("success","You Logged Out Successfully");
      res.redirect("/listings");
    });
};