
//login

//get data
var dataSongs=[];
var dataArtists=[];
var songs = []
var bubbleChart = new BubbleChart("bubble-chart");
var spiderChart = new SpiderChart("spider-chart")
var songList = new SongList();

document.getElementById('playlist-chosen').onchange = updateData;
$(".loader").hide();
$(".listWrapper").hide();
$(".a-box").hide();
$(".scroll").hide();
$("#exit").click(function(){
  $(".a-box").fadeOut(1000);
})

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

function updateData(){
  $(".listWrapper").fadeIn(3000);
  $(".scroll").fadeIn(1000);

  
  var select = document.getElementById('playlist-chosen');
  var valueSelected = String(select.options[select.selectedIndex].value);
  var stringSelected = String(select.options[select.selectedIndex].title);
  var adress = "data/" + valueSelected + ".csv"
  d3.csv(adress)
  .then(function(data){
    spiderChart.update(data)
    bubbleChart.update(data);
    songList.update(data)
    
  })

  var tab = document.getElementById("playlistName")
    tab.innerHTML = "looking at " + stringSelected 
  
}



