const req = require('express/lib/request');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require ('bcryptjs');
const request = require('request');
const flash = require('connect-flash');
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
exports.postSignup =  (req, res, next)=>{
    // response.render('login');
    console.log(req.body);
 
    const {name, email, pass, re_pass} = req.body;
    db.query('SELECT email FROM usertable WHERE email = ?', [email], async (error, result)=>{
        if(error){
            console.log(error);
        }
        if (result.length > 0){ //the email exist breviosly in our db
                return res.render('signup',{
                message: 'That email is already in use'
            });

       
        }
        else if(pass !== re_pass){
                return res.render('signup',{
                    message: 'The passwords do not match'
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
                 res.redirect('/login');
            }
            
           
            res.end();

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
        return res.render('login',{
            message: 'error ocurred'
        });
        
      }else{
        if(results.length >0){
          const comparision = await bcrypt.compare(password, results[0].password)
          if(comparision){
            return res.render('movies',{//Redirect to home page
                message: 'Logged in succesfully'
            });
              
          }
          else{
            return res.render('login',{
                message: 'Email and Password do not match'
            });
            
          }
        }
        else{
            return res.render('login',{
                message: 'Email does not exist'
            });
        }
      }
      });
  };

 

// exports.logout=(req, res) => {
//    req.logout();
//    res.redirect("/");
//   };
