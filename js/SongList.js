/*
 * StackedAreaChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the  
 */

function SongList (){

}

SongList.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    var text =  "<h4> Artist: " + tooltip_data.artist + "</h4>";
    text += "<h4> Album: " + tooltip_data.album + "</h4>";
    text += "<h4> Genres: " + tooltip_data.genres + "</h4>";

    return text;
}

/*
 * Initialize visualization 
 */

SongList.prototype.initVis = function(){
	var vis = this;

    var ol = document.createElement('ol');
    document.getElementById('songList').appendChild(ol);
    ol.className = "list-numbered"
  
  vis.data.forEach(function (song, i) {
    let li = document.createElement('li');
    let span = document.createElement('span')
    li.appendChild(span)
    ol.appendChild(li);
    span.innerHTML += song.name;
    var classNameQ = ".class" + String(i)
    li.className = "class" + String(i)
    li.setAttribute("data-toggle", "tooltip")
    li.setAttribute("data-placement" , "right")
    li.setAttribute("desc", text1())
    $(classNameQ).mouseover(onClick)


    function text1(){
        var genres = eval('[' + song.genre + ']')[0]
        tooltip_data = {
                "artist": song.artist,
                "album" : song.album,
                "genres" : genresString(genres)
            }
            return vis.tooltip_render(tooltip_data);
    }

    function genresString(arr){
        var text = "";
        if (arr.length > 0){
            text += arr[0];
            for(var i =0; i < arr.length; i++){
                text += ", " + arr[i];
            }
        }
        return text;
    }

    function onClick(){

        $(".a-box").show();

        //load info
        document.getElementById("song").innerHTML = song.name;
        document.getElementById("songInfo").innerHTML = $(classNameQ).attr("desc");
        //show box

        vis.genreData = song["genre"][0]
          

    for(var i = 0; i < vis.tspan.length; i++){
        vis.tspan[i].classList.remove("highlightGenre")
        for(var j = 0; j < vis.genreData.length; j++){
            if (vis.tspan[i].innerHTML == vis.genreData[j]){
                vis.tspan[i].classList.add("highlightGenre")

            }
        }

    }




        
    }

});
}

SongList.prototype.update = function(data){
    var vis = this;
    vis.data = data
    vis.genreData = ["none"]


    $(".a-box").hide();
    $(".loader").fadeIn(500);
    $(".list-numbered").empty();
    setTimeout(later, 1000);

    function later(){
        vis.initVis()
      $(".loader").fadeOut(500);
      vis.tspan = document.getElementsByTagName("tspan")
      $("tspan").addClass("normal");
        
    }


}