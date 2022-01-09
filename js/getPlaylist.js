$(function(){
    $.ajax({
        Type: GET,
        url: 'https://api.spotify.com/v1/users/nmpmkxm61nsy0jden7z9ezttz/playlists',
        sucsses: function(data){
            console.log(data)
        }
    })
})