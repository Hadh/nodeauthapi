const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config =require ('./config/database');

//Database Connection
mongoose.connect(config.database);
mongoose.connection.on('Connected',()=>{
	console.log('Callback to say : connected to database' + config.database);
});

mongoose.connection.on('Error',(err)=>{
	console.log('Callback to say : Database Error' + err);
});

const app = express();

const users = require('./routes/users');
const port=3000;
//Middlewares
app.use(cors());
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//set static folder
app.use(express.static(path.join(__dirname,'public')));
app.use('/users',users);

//Index route
app.get('/',(req,res)=>{
	res.send('Invalid endpoint');
});

app.listen(port, ()=> {
	console.log('Server starting on port'+port);
});
