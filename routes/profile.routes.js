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

//Add anime to TO SEE
router.post('/tosee-animes', checkForAuth, (req,res)=>{

  User.findByIdAndUpdate(req.user._id, {$push: {toSeeAnimes: req.body}})
  .then((result)=>{
    res.redirect('/profile')
  })
  .catch((error)=>{
    res.send(error)
  })
  
})

//Delete anime from TO SEE
router.post('/tosee-animes/delete/:_id', checkForAuth, (req, res)=>{

  // Favorite.updateOne( {cn: req.params.name}, { $pullAll: {uid: [req.params.deleteUid] } } )
  User.findById(req.user._id)
  .then((user) => {
    const newToSeeAnimes = user.toSeeAnimes.filter((anime)=>{
      return anime.mal_id !== req.params._id
    })
    User.findByIdAndUpdate(req.user._id, {toSeeAnimes: newToSeeAnimes})
    .then(()=>{
      res.redirect('/profile')
    })
  }).catch((err) => {
    console.log(err)
  });
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

router.post('/current-animes/delete/:_id', checkForAuth, (req, res)=>{

  User.findById(req.user._id)
  .then((user) => {
    const newCurrentAnimes = user.currentAnimes.filter((anime)=>{
      return anime.mal_id !== req.params._id
    })
    User.findByIdAndUpdate(req.user._id, {currentAnimes: newCurrentAnimes})
    .then(()=>{
      res.redirect('/profile')
    })
  }).catch((err) => {
    console.log(err)
  });
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

router.post('/watched-animes/delete/:_id', checkForAuth, (req, res)=>{

  User.findById(req.user._id)
  .then((user) => {
    const newWatchedAnimes = user.watchedAnimes.filter((anime)=>{
      return anime.mal_id !== req.params._id
    })
    User.findByIdAndUpdate(req.user._id, {watchedAnimes: newWatchedAnimes})
    .then(()=>{
      res.redirect('/profile')
    })
  }).catch((err) => {
    console.log(err)
  });
})


module.exports = router;