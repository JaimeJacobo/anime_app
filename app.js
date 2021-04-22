require('dotenv').config();

const express = require('express')
const hbs = require('hbs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//-------IMPORTAR PAQUETES PASSPORT---------
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/User.model')
//-------MONGOOSE---------
require('./configs/db.config.js')
// const path = require('path')

//-------EXPRESS---------
const app = express()

// Middleware Setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//Configurar session
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
}))

//configurar la serializacion 
passport.serializeUser((user,callback)=>{
  callback(null, user._id)
})
passport.deserializeUser((id,callback)=>{
  User.findById(id)
  .then((result) => {
    callback(null, result)
  })
  .catch((err) => {
    callback(err)
  });
})

//configurar el middelware de flash
app.use(flash())

//Configurar Strategy (despúes de flash)
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, (req, username, password, next )=>{
  User.findOne({username})
  .then((user) => {
    if(!user){ //Si el ususario no existe 
      return next(null, false, {message: 'Incorrect Username'});
    }

    if(!bcrypt.compareSync(password, user.password)){
      return next(null, false, {message: 'Incorrect Password'});
    }

    return next(null, user)
  })
  .catch((err) => {
    next(err);
  });
}));

//Configurar middelware de passport (siempre después de configurar Strategy)
app.use(passport.initialize())
app.use(passport.session())


//-------HBS---------
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
// app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))

//-------ROUTES---------
app.use('/', require('./routes/home.routes'))
app.use('/anime', require('./routes/anime.routes'))
app.use('/', require('./routes/auth.routes'))
app.use('/profile', require('./routes/profile.routes'))

//-------LISTENER---------
app.listen(3000, () => {
  console.log(`Server open at port 3000`)
})






//-----API ENDPOINTS-------

// Todos los animes: https://api.jikan.moe/v3/search/anime?q=&order_by=members&sort=desc&page=1