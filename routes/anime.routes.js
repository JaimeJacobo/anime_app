const express = require('express');
const router = express.Router();
const axios = require('axios');
let page = 1


/* PRUEBA PASAR PAGINAS */

router.get(`/nextPage`,(req,res)=>{
  page++
  res.redirect(`/anime/all/${page}`)
})

router.get(`/previousPage`,(req,res)=>{
  page--
  if(page < 1){
    page = 1
    res.redirect(`/anime/all/${page}`)
  } else {
    res.redirect(`/anime/all/${page}`)
  }
})
  

/* GET all anime page */
router.get(`/all/:page`, (req, res)=>{
  page = Number(req.params.page)
  axios.get(`https://api.jikan.moe/v3/search/anime?q=&page=${req.params.page}&genre=12&genre_exclude=0&order_by=members&sort=desc`)
    .then(result => {

      const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'

      res.render('all-anime', {
        anime: result.data.results, 
        layout: layout,
        page,
        prevPage: page - 1,
        nextPage: page + 1,
        page1: page === 1 ? true : false,
        page2: page === 2 ? true : false,
        page299: page === 299 ? true : false,
        page300: page === 300 ? true : false,
      })
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
  axios.get(`https://api.jikan.moe/v3/search/anime?q=${req.body.search}&page=1`)
  .then(result => {
    const resultSFW = result.data.results.filter((anime)=>anime.rated !== 'Rx')
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'

    res.render('search-results', {anime: resultSFW, layout: layout} )
  })
  .catch(error => {
    console.log(error)
  })
    
  
})



module.exports = router;