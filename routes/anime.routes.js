const express = require('express');
const router = express.Router();
const axios = require('axios');

/* GET all anime page */
router.get(`/all`, (req, res)=>{
  axios.get('https://api.jikan.moe/v3/search/anime?q=&order_by=members&sort=desc&page=1')
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


module.exports = router;