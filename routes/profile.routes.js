const express = require('express')
const router = express.Router();

const User = require('../models/User.model')

//Middleware de checkForAuth
const checkForAuth = (req,res,next) => {
  if(req.isAuthenticated()){
    return next()
  }else{
    res.redirect('/login')
  }
}

router.get('/', checkForAuth ,(req, res) => {
  const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'

  const randomNumber = Math.floor(Math.random()*5)

  const image = {
    0: 'gif1',
    1: 'gif2',
    2: 'gif3',
    3: 'gif4',
    4: 'gif5',
  }[randomNumber]

  const data = {...req.user._doc, image: image}

  res.render('profile/profile', {data, layout})
})


router.post('/tosee-animes', checkForAuth, (req,res)=>{

  User.findByIdAndUpdate(req.user._id, {$push: {toSeeAnimes: req.body}})
  .then((result)=>{
    res.redirect('/profile')
  })
  .catch((error)=>{
    res.send(error)
  })
  
})
router.post('/current-animes', checkForAuth, (req,res)=>{
  User.findByIdAndUpdate(req.user._id, {$push: {currentAnimes: req.body}})
  .then((result)=>{
    res.redirect('/profile')
  })
  .catch((error)=>{
    res.send(error)
  })
  
})
router.post('/watched-animes', checkForAuth, (req,res)=>{
  
  User.findByIdAndUpdate(req.user._id, {$push: {watchedAnimes: req.body}})
  .then((result)=>{
    res.redirect('/profile')
  })
  .catch((error)=>{
    res.send(error)
  })
})


module.exports = router;



/* router.post('/new', (req, res)=>{
    Sport.create(req.body)
    .then((result) => {
      User.findByIdAndUpdate(req.user._id, {$push: {sports: result._id}})
      .then((result) => {
        res.redirect('/profile')
      })
    })
    .catch((err) => {
      res.render('error')
    });
  }) */