const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const Sequelize = require('sequelize')
const sequelize = new Sequelize('musics', 'indra', '1', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

// setup CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})


// body parser for parsing data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

// =======================================================
// table albums
const albums = sequelize.define('albums', {
    'album_number': {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    'album_name': Sequelize.STRING
}, {
    feezeTableName: true
})

// route to home
app.get('/', (req, res) => {
    res.send('Welcome to drogon-music API')
})

// get data from albums
app.get('/api/albums', (req, res) => {
    albums.findAll().then(albums => {
        res.json(albums)
    })
})

// post data to albums
app.post('/api/albums', [
    check('album_number')
    .isLength({min: 4}),

    check('album_name')
    .isLength({min: 4})
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.mapped()})
    }
    albums.create({
            album_number: req.body.album_number,
            album_name: req.body.album_name
        })
        .then(newAlbums => {
            res.json({
                "status": "success",
                "message": "albums added",
                "data": newAlbums
            })
        })
})

// sort data with album_number
app.put('/api/albums', (req, res) => {
    const update = {
        album_number: req.body.album_number,
        album_name: req.body.album_name
    }
    albums.update(update, {
            where: {
                album_number: req.body.album_number
            }
        })
        .then(affectedRow => {
            return albums.findOne({
                album_number: req.body.album_number
            }, {
                returning: true,
                where: {}
            })
        })
        .then(DataRes => {
            res.json({
                "status": "success",
                "message": "albums change",
                "data": DataRes
            })
        })
})

// delete data on albums table
app.delete('/api/albums/:album_number', (req, res) => {
    albums.destroy({
            where: {
                album_number: req.body.album_number
            }
        })
        .then(affectedRow => {
            if (affectedRow) {
                return {
                    "status": "success",
                    "message": "albums deleted",
                    "data": null
                }
            }
            return {
                "status": "error",
                "message": "failed",
                "data": null
            }
        })
        .then(deleteData => {
            res.json(deleteData)
        })
})

// =======================================================
// table songs
const songs = sequelize.define('songs', {
    'song_number': {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    'album_number': Sequelize.INTEGER,
    'song_name': Sequelize.STRING,
    'mood': Sequelize.STRING,
    'url_song': Sequelize.STRING
}, {
    freezeTableName: true
})

// get all data from songs
app.get('/api/songs', (req, res) => {
    songs.findAll().then(songs => {
        res.json(songs)
    })
})


// post data to songs
app.post('/api/songs', (req, res) => {
    songs.create({
            song_number: req.body.song_number,
            album_number: req.body.album_number,
            song_name: req.body.song_name,
            mood: req.body.mood,
            url_song: req.body.url_song
        })
        .then(newSongs => {
            res.json({
                "status": "success",
                "messages": "songs added",
                "data": newSongs
            })
        })
})

// edit data sort by song_number
app.put('/api/songs', (req, res) => {
    const update = {
        song_number: req.body.song_number,
        album_number: req.body.album_number,
        song_name: req.body.song_name,
        mood: req.body.mood,
        url_song: req.body.url_song
    }
    songs.update(update, {
            where: {
                song_number: req.body.song_number
            }
        })
        .then(affectedRow => {
            return songs.findOne({
                song_number: req.body.song_number
            }, {
                returning: true,
                where: {}
            })
        })
        .then(DataRes => {
            res.json({
                "status": "success",
                "message": "songs change",
                "data": DataRes
            })
        })
})

app.delete('/api/songs/:song_number', (req, res) => {
    song_number.destroy({
            where: {
                song_number: req.params.emp_no
            }
        })
        .then(affectedRow => {
            if (affectedRow) {
                return {
                    "status": "success",
                    "messages": "songs deleted",
                    "data": null
                }
            }
            return {
                "status": "error",
                "message": "failed",
                "data": null
            }
        })
        .then(deleteData => {
            res.json(deleteData)
        })
})



app.listen(3000, () => console.log('App listen on port 300'))