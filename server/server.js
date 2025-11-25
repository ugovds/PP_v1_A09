var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose')
var app = express ();
var bodyParser = require("body-parser");
var https = require('https');
var fs = require('fs');
var Incident = require('./models/incidents')
var User = require('./models/user');
const { createCipheriv } = require('crypto');

const mongodb = "mongodb://localhost:27017/PP"

const port = 8080;
const default_passwrd = "1234";

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('static'));

app.use(bodyParser.urlencoded({ extended: true })); 

app.use(session({
  secret: "propre123",
  resave: false,
  saveUninitialized: true,
  cookie: { 
    path: '/', 
    httpOnly: true, 
    maxAge: 3600000
  }
}));


app.get('/', async (req, res)=> {
    try {
        const dateAjrd = new Date();
        const incidents = await Incident.find().sort({ createdAt: -1 }); 

        res.render('index', { date:dateAjrd, username:req.session.username,incidents:incidents});
    } catch (error) {
        console.error("erreur", error);
        res.render('index', {date: new Date(), username: req.session.username,incidents: []});
    }
});


app.get('/report', (req, res) => {
    res.render('report', { username: req.session.username });
});


app.get('/connexion', (req, res) => {
    res.render('connexion', { username: req.session.username, error: null });
});


app.post('/report', async (req, res) => {
    try {
        const { type, description, date, location, details } = req.body; 
        
        const newIncident = new Incident({
            type: type,
            description: description,
            date: date, 
            location: location,    
            details: details,
        });


        await newIncident.save();

        res.render('report', { username: req.session.username });
    } catch (error) {
        console.error("Erreur lors de la soumission de l'incident:");
        res.render('report', { username: req.session.username });


    }
});


app.get('/connexion', (req, res) => {
    res.render('connexion', { username: req.session.username, error: null });
});
app.post('/login', (req,res)=> {
    const { username, password} = req.body;
    if(password===default_passwrd){
        req.session.username = username;
        res.redirect('/');
    }else{
        res.render('connexion', {username: null, error: "MDP incorrect"});
    }
})
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
});


app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
});


app.listen(port, ()=>{
    console.log(`Server started at http://localhost:${port}`);
});


const connectDB = async () =>{
    try{
        await mongoose.connect(mongodb)
        console.log("Db is running...")

    }catch{
        console.log("Error")
    }
}

connectDB()