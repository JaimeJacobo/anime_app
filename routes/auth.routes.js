const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const passport = require('passport')

const User = require('../models/User.model')

router.get('/signup', (req, res) => {
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
    res.render('auth/signup', {layout: layout})
})

router.post('/signup', (req, res) =>{
    const {username, password} = req.body

    if (username === '' || password === ''){
        const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
        res.render('auth/signup', {errMsg: 'Please fill every field', layout: layout})
        return
    }

    User.findOne({username})
    .then((result) => {
        if (result) {
            const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
            res.render('auth/signup', {errMsg: 'This user already exists', layout: layout})
        } else {
            const hashedPassword = bcrypt.hashSync(password, 10)
            User.create({username: username, password: hashedPassword})
            .then((result) => {
                res.redirect('/login')
            })
        }
    })
    .catch((err) => {
        res.send(err)
    })
})

router.get('/login', (req, res) => {
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
    res.render('auth/login', {errMsg: req.flash('error'), layout: layout})
})

router.post('/login', passport.authenticate ('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
}))

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router