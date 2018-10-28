var express = require('express');
var router = express.Router();
var User=require('../models/user');
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;





/* GET home page. */
router.get('/',function(req, res, next) {
  res.render('index', { title: 'Index' });
});



//local strategy

passport.use(new LocalStrategy((username,password,done)=>{
  User.getUserByUsername(username,(err,user)=>{
       if (err) throw err;
       if(!user){
           return done(null,false,{message:'Invalid Username'});
       }
      User.comparePassword(password,user.password,(err,isMatch)=>{
       if (err) throw err;
       if(isMatch){
           return done(null,user);
       }else{
           return done(null,false,{message:'Wrong Password !!'});
       }
      });
  });
}));


passport.serializeUser((user, done) => {
   done(null, user.id);
 });
 
 passport.deserializeUser((id, done) => {
   User.getUserById(id, (err, user) => {
     done(err, user);
   });
 });
 





/* GET register page. */
router.get('/register', function(req, res, next) {

  errors='';
  res.render('register',{errors:errors});

});


/* Process register  */
router.post('/register', function(req, res, next) {
  //res.render('register');

     //res.render('register');
     var name=req.body.name;
     var username=req.body.username;
     var email=req.body.email;
     var password=req.body.password;
     var password2=req.body.password2;


     
     req.checkBody('name','Name Field is Required').notEmpty();
     req.checkBody('username','User Name Field is Required').notEmpty();
     req.checkBody('email','Name Field is Required').isEmail();
     req.checkBody('password','Password Field is Required').notEmpty();
     req.checkBody('password2','Passwords do not match').equals(req.body.password);


    let errors=req.validationErrors();

    if(errors){
        res.render('register',{errors:errors});
    }else{
      const newUser = new User({
        name: name,
        username: username,
        email: email,
        password: password
      });
  
      User.registerUser(newUser, (err, user) => {
        if(err) {
            //throw err;
            req.flash('error_msg', 'Filed To register!! Try Again');
            res.redirect('/register');
        }
        else{
        req.flash('success_msg', 'You are registered and can log in');
        res.redirect('/');
    }
      });
    }
    



});



/* GET register page. */
router.post('/login', function(req, res, next) {

  passport.authenticate('local',{
    successRedirect:'/users',
    failureRedirect:'/',
    failureFlash:true
})(req,res,next);


});


router.get('/logout',function(req,res,next){
  req.logout();
  req.flash('success_msg','Successfully Logged Out!!');
  res.redirect('/');
});


//access control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('error_msg', 'You are not authorized to view that page');
    res.redirect('/');
  }
};


module.exports = router;
