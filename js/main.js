fetch("http://192.168.0.118:3000/api/albums")
    .then(response => {
        return response.json();
    })
    .then(data => {
        data.map(insertAlbums);
    });

// fetch("http://192.168.0.118:3000/api/songs")
//     .then(responsesong => {
//         return responsesong.json();
//     })
//     .then(datasongs => {
//         datasongs.map()
//     });

function insertAlbums(array) {
    var albumIndex = [array.album_number];
    var albumName = [array.album_name];

    var printAlbums = document.getElementById("album-lists").innerHTML = document.getElementById("album-lists").innerHTML +
        `<div class='row'> <div class='col'> <p> Album ${albumIndex} </p> </div> <div class='col'> <p> ${albumName} </p> </div> </div>`;
}

// function insertSongs(array) {
//     var songName = [array.song_name];
//     var mood = [array.mood];
//     var songUrl = [array.url_song];


// }
// fetch("http://192.168.0.118:3000/api/songs/")
//     .then(response => {
//         return response.json();
//     })
//     .then(data => {
//         console.log(data[1].url_song);
//     })