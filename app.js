const express = require('express');
const path=require('path');

const session = require('express-session')
// const SessionStore = require('connect-mysql-session')(session)

const dotenv = require('dotenv')
const bodyParser = require('body-parser');

const cors = require('cors');

const mysql = require("mysql");
const db=mysql.createConnection({
   host:'localhost',
   user:'root',
   password:'',
   database:'movies'
 });
db.connect(function(error){
   if(!!error){
     console.log(error);
   }else{
     console.log('Connected!:)');
   }
 });  
module.exports = db; 


const app=express()
app.use(express.static(path.join(__dirname,'assets')));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


//parse URL encoded bodies (as sent by html form)
app.use(bodyParser.urlencoded({
    extended:true
}));

//
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
// app.get('/', function(request, response) {
// 	response.sendFile(path.join(__dirname + '/login'));
// });


app.set('view engine','ejs');
app.set('views','views'); //default
app.use(cors());

//define routs
app.use('/',require('./routes/auth.route'));
app.use('/signup', require('./routes/auth.route'));
app.use('/login', require('./routes/auth.route'));


app.listen(3000, (err)=>{
    console.log(err)
    console.log('server listen on port 3000')
});
