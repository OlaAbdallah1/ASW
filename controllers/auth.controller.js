const req = require('express/lib/request');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require ('bcryptjs');
const request = require('request');
const router = require('../routes/auth.route');
const db=mysql.createConnection({
   host:'localhost',
   user:'root',
   password:'',
   database:'movies'
 });

//  require('http').request()
exports.getSignup=(request,res,next)=>{
    res.render("signup");
}
exports.postSignup =  (request, response, next)=>{
    // response.render('login');
    console.log(request.body);
 
    const {name, email, pass, re_pass} = request.body;
    db.query('SELECT email FROM usertable WHERE email = ?', [email], async (error, result)=>{
        if(error){
            console.log(error);
        }
        if (result.length > 0){ //the email exist breviosly in our db
            return response.render('signup',{
                message:'That email is already in use'

            });
       
            // response.send('The Email is already in use!');

        }
        else if(pass !== re_pass){
            // response.send('The passwords do not match!');
            return response.render('signup',{
                message:'The passwords do not match'
            });
        }

        let hashedPassword = await bcrypt.hash(pass,8);
        console.log(hashedPassword);

        db.query('INSERT INTO usertable SET ?',{username:name, email:email, password:hashedPassword},(error,result) => {
            if(error){
                console.log(error);
                // response.end();
                // response.render('/signup');
            }else {
                console.log(result);
                 response.redirect('/login');
            }
            
           
            response.end();

        });
    }); // the value

   };

exports.getLogin=(req,res,next)=>{
    res.render("login");
}
exports.postLogin = async function(req,res){
    var email= req.body.email;
    var password = req.body.pass;
    db.query('SELECT * FROM usertable WHERE email = ?',[email], async function (error, results, fields) {
      if (error) {
        res.send({
          "code":400,
          "failed":"error ocurred"
        });
      }else{
        if(results.length >0){
          const comparision = await bcrypt.compare(password, results[0].password)
          if(comparision){
              res.send({
                "code":200,
                "message":"login sucessfull"
              })
              //Redirect to home page
          }
          else{
            res.send({
                 "code":204,
                 "message":"Email and password does not match"
            })
            
          }
        }
        else{
          res.send({
            "code":206,
            "message":"Email does not exits"
              });
        }
      }
      });
  };

 

// exports.logout=(req, res) => {
//    req.logout();
//    res.redirect("/");
//   };
