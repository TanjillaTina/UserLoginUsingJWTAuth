var express = require('express');
var router = express.Router();


//access control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('error_msg', 'You must login to view that page');
    res.redirect('/');
  }
};
/* GET users listing. */
router.get('/',  ensureAuthenticated,function(req, res, next) {
  res.render('user',{user:req.user});
});

module.exports = router;
