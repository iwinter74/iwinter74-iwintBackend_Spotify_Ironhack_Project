const express = require('express')
const app = express()
// const PORT = process.env.PORT || 3006
const port = 3006
require('dotenv').config()
// display content of .env
console.log(process.env)
const hbs = require("hbs");
hbs.registerPartials(__dirname+'/views/partials');

let artist
let albums

const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
  
  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
      .catch(error => console.log('Something went wrong when retrieving an access token', error));
      

app.set('view engine', 'ejs');
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    res.status(200).render('index')
})
app.get('/artist-search-results', (req, res) => {
    res.status(200).render('artist-search-results', {artist: artist})
})

app.get('/albums', (req, res) => {
  res.status(200).render('albums', {albums: albums})
})

app.get('/tracks', (req, res) => {
  res.status(200).render('tracks', {tracks: tracks})
})
  
app.get('/artist-search', (req, res) => {
    spotifyApi
  .searchArtists(req.query.name)
  .then(data => {
      // console.log('The received data from the API: ', data.body.artists.items);
      // console.log('The received data from the API: ', data.body.artists.items[0].images[0]);
      // console.log('The received data from the API: ', data.body.artists.items[0].images[0].url);
      // res.json(data.body)
      // res.send("test")
      res.status(201).redirect('/artist-search-results')
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      artist= data.body.artists.items
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res) => {
spotifyApi.getArtistAlbums(req.params.artistId).then(
  (data) => {
    // console.log('Artist albums', data.body.items);
    // console.log('Albums pictures', data.body.items[0]);
    // console.log('One picture', data.body.items[0].images[0]);
    // console.log('One url', data.body.items[0].images[0].url);
    res.status(201).redirect('/albums')
    // res.render('albums', {albums: data.body.items})
    albums = data.body.items
  },
  (err) => {
    console.error(err);
  }
);
})

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(
      (data) => {
    console.log(data.body.items);
    res.status(201).redirect('/tracks')
    tracks=data.body.items
  }, (err) => {
    console.log('Something went wrong!', err);
  });
})

  app.listen(process.env.PORT || port, (req, res) => {
    console.log(`Server started`)
  })







  
