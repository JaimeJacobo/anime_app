const express = require('express');
const router = express.Router();
const axios = require('axios');
let page = 1


/* PRUEBA PASAR PAGINAS */

router.get(`/nextPage`,(req,res)=>{
  page++
  res.redirect(`/anime/all`)
})

router.get(`/firstPage`,(req,res)=>{
  page=1
  res.redirect(`/anime/all`)
})

router.get(`/previousPage`,(req,res)=>{
  page--
  if(page < 1){
    page = 1
    res.redirect(`/anime/all`)
  }else{res.redirect(`/anime/all`)}
})
  

/* GET all anime page */
router.get(`/all`, (req, res)=>{
  axios.get(`https://api.jikan.moe/v3/search/anime?q=&order_by=members&sort=desc&page=${page}`)
    .then(result => {

      const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
     
        res.render('all-anime', {anime: result.data.results, layout: layout} )
      
    })
    .catch(error => {
      console.log(error)
    })
})
/* GET anime details */
router.get(`/anime-details/:id`, (req, res)=>{
    const mal_id = req.params.id
    axios.get(`https://api.jikan.moe/v3/anime/${mal_id}`)
      .then(result => {

        let layout;
        let loggedIn;

        if(req.user){
          layout = '/layouts/auth'
          loggedIn = true
        } else {
          layout = '/layouts/noAuth'
          loggedIn = false
        }

        res.render('detail-anime', {animeDetails: {...result.data, loggedIn}, layout: layout})
      })
      .catch(error => {
        console.log(error)
      })
})

/* Post search form */
router.post('/search', (req, res) => {
  axios.get(`https://api.jikan.moe/v3/search/anime?q=${req.body.search}&page=${page}`)
  .then(result => {

    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
   
      res.render('search-results', {anime: result.data.results, layout: layout} )
    
  })
  .catch(error => {
    console.log(error)
  })
    
  
})



module.exports = router;