const express = require("express");
const ViteExpress = require("vite-express");
const bodyParser = require('body-parser');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const connection = "mongodb://127.0.0.1:27017/helpdesk";
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const connectEnsureLogin = require('connect-ensure-login');
const session = require('express-session');
const passport = require("passport");
const http = require("http");

const sessionSecret = 'keyboard cat';
mongoose.connect(connection, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connected!'));

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: sessionSecret, resave: false, saveUninitialized: true, cookie: {maxAge: 60 * 60 * 10000}
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Register
app.post('/register', (req, res) => {
    User.register({email: req.body.email, username: req.body.username}, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.status(500).send("Error registering new user please try again.");
        } else {
            res.status(200).send("Successfully registered user");
        }
    });
});

// Login by checking if the hashed password matches the one in the database
app.post('/loginapi', passport.authenticate('local', {failureRedirect: '/'}), function (req, res) {
    req.session.username = req.user.username;
    console.log("Login successful");
    res.status(200).send("Login successful");
});

// Logout
app.get('/logout', (req, res) => {
    req.logout();
    res.status(200).send("Logout Successful")
});

app.get('/authstatus', (req, res) => {
    if (req.isAuthenticated()) {
        // User is authenticated
        res.status(200).json({authenticated: true, user: req.user});
    } else {
        // User is not authenticated
        res.status(401).json({authenticated: false});
    }
});

// CHAT SECTION

const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg.text);
    });


    socket.on('disconnect', () => {
        console.log('a user disconnected');
        socket.broadcast.emit('message', { message: 'User X has left the chat' });
    });
});

server.listen(3000, () => {
    console.log('listening on localhost:3000');
});

ViteExpress.bind(app, server);
