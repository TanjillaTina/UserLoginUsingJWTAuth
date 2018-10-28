const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const Schema=mongoose.Schema;


let userSchema=new Schema({
     name:{type: String,required:true},
     username:{type: String,required:true},
     email:{type: String,required:true},
     password:{type: String,required:true}   

});




const User=mongoose.model('User',userSchema);
module.exports=User;

module.exports.registerUser = function(newUser, callback){
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(callback);
      });
    });
  }



  module.exports.getUserByUsername=function(username,callback){
    const query={username:username}
    User.findOne(query,callback);

  }

  module.exports.getUserById=function(id,callback){
    //const query={username:username}
    User.findById(id,callback);

  }


  module.exports.comparePassword=function(candidatePassword,hash,callback){
  bcrypt.compare(candidatePassword,hash,(err,isMatch)=>{
     if (err) throw err;
     callback(null,isMatch);
  });
  }