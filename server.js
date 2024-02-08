const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrlSaves');

const app = express();

mongoose.connect('mongodb://localhost/urlShortner', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs'); // sets ejs as the viewing template
app.use(express.urlencoded({ extended: false})) //for app.post to work

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', {shortUrls: shortUrls})
})

app.post('/short', async (req, res) => {

    await ShortUrl.create({ full: req.body.fullURL })
    res.redirect('/')
})


app.get('/:shortUrl', async (req, res) => {
    const Shorturl = await  ShortUrl.findOne({short: req.params.shortUrl })  
    if (Shorturl == null) return res.sendStatus(404)  // for error handling

    Shorturl.clicks++
    Shorturl.save()

    res.redirect(Shorturl.full)
})




app.listen(process.env.PORT || 5011);