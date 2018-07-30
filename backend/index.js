const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const Sequelize = Sequelize('sequelize')
const sequelize = new Sequelize('musics', 'indra', '1', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

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
app.post('/api/albums', (req, res) => {
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

app.listen(3000, () => console.log('App listen on port 300'))