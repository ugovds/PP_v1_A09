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
const bcrypt = require('bcrypt');
const MongoStore = require('connect-mongo');

const mongodb = 'mongodb://localhost:27017/PP';
const port = 8080;

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('static'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'propre123',
    store: MongoStore.create({ mongoUrl: mongodb, collectionName: 'sessions' }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 3600000,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    },
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

// Incident detail page
app.get('/incident/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const incident = await Incident.findById(id).lean();
        if (!incident) return res.status(404).render('incident', { username: req.session.username, incident: null });
        res.render('incident', { username: req.session.username, incident });
    } catch (err) {
        console.error('Error fetching incident:', err);
        res.status(500).render('incident', { username: req.session.username, incident: null });
    }
});


app.get('/connexion', (req, res) => {
    res.render('connexion', { username: req.session.username, error: null });
});

// Redirect legacy /register page to the combined connexion page
app.get('/register', (req, res) => {
    res.redirect('/connexion');
});

app.post('/register', async (req, res) => {
    try {
        const { username, password, email, fullname } = req.body;
        if (!username || !password || !email || !fullname) {
            return res.render('register', { username: null, error: 'Tous les champs sont requis' });
        }

        const existing = await User.findOne({ $or: [{ username }, { email }] });
        if (existing) {
            return res.render('register', { username: null, error: 'Nom d\'utilisateur ou email déjà utilisé' });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashed, email, fullname });
        await user.save();
        req.session.regenerate((err) => {
            if (err) {
                console.error('Session regenerate error after register:', err);
                return res.render('register', { username: null, error: 'Erreur de session' });
            }
            req.session.username = user.username;
            req.session.save((err2) => {
                if (err2) console.error('Session save error after register:', err2);
                res.redirect('/');
            });
        });
    } catch (err) {
        console.error('Register error:', err);
        res.render('register', { username: null, error: 'Erreur lors de l\'inscription' });
    }
});


app.post('/report', async (req, res) => {
    try {
        // Require authentication: don't allow creating incidents if not logged in
        if (!req.session || !req.session.username) {
            return res.render('connexion', { username: null, error: 'Vous devez être connecté pour signaler un incident' });
        }

        const { type, description, date, location, details } = req.body;

        const newIncident = new Incident({
            type: type,
            description: description,
            date: date,
            location: location,
            details: details,
            // optionally store the username who reported the incident
            reporter: req.session.username,
        });

        await newIncident.save();

        res.redirect('/');
    } catch (error) {
        console.error('Erreur lors de la soumission de l\'incident:', error);
        res.render('report', { username: req.session.username, error: 'Erreur lors de la soumission' });
    }
});


// Login route: authenticate against DB, protect against session fixation
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.render('connexion', { username: null, error: 'Nom d\'utilisateur et mot de passe requis' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.render('connexion', { username: null, error: 'Utilisateur inconnu' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.render('connexion', { username: null, error: 'MDP incorrect' });
        }

        // Regenerate session to prevent session fixation
        req.session.regenerate((err) => {
            if (err) {
                console.error('Session regenerate error:', err);
                return res.render('connexion', { username: null, error: 'Erreur de session' });
            }
            req.session.username = user.username;
            // Save session before redirection
            req.session.save((err2) => {
                if (err2) console.error('Session save error:', err2);
                res.redirect('/');
            });
        });
    } catch (err) {
        console.error('Login error:', err);
        res.render('connexion', { username: null, error: 'Erreur lors de la connexion' });
    }
});
app.get('/logout', (req, res) => {
    // Destroy session and redirect to home
    req.session.destroy((err) => {
        if (err) console.error('Session destroy error:', err);
        res.clearCookie('connect.sid', { path: '/' });
        res.redirect('/');
    });
});

// Start server after DB connection
const connectDB = async () => {
    try {
        await mongoose.connect(mongodb);
        console.log('Db is running...');
        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Error connecting to DB:', err);
        process.exit(1);
    }
};

connectDB();