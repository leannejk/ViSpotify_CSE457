
/*
 * Timeline - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the  data set that contains the artitsts in the playlist
 */

function BubbleChart (_parentElement, _data){
    this.parentElement = _parentElement;
    // this.data = _data;
    this.dataArtists = []

    // this.initVis();
}

BubbleChart.prototype.initVis = function(){
   
    var vis = this; 
    d3.select("#" + vis.parentElement).selectAll("*").remove()
    vis.lollipop = new Lollipop('lollipop', vis.dataArtists)

	vis.width = 800
    vis.height = 700

    self.margin = {top: 60, right: 20, bottom: 50, left: 50};
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width)
        .attr("height", vis.height)
        .attr("class", "bubblePlot")
        .attr("transform",
        "translate(" + self.margin.left + "," + self.margin.top + ")");;

    var bubble = d3.pack()
            .size([630, 630])
            .padding(1);

    //https://observablehq.com/@d3/color-schemes
    var colorScale= d3.scaleOrdinal(["#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#0868ac","#084081"]);
    freqData=[];
    for (var i=0; i< vis.data.length; i++){
        if (vis.data[i].artist!=""){
            var exists=false
            for (var j=0; j< freqData.length; j++){
                if (freqData[j][0]==vis.data[i].artist){
                    freqData[j][1]=freqData[j][1]+1;
                    exists=true;
                }
            }
            if(exists==false){
                freqData.push([vis.data[i].artist, 1]);
            }
        }

    }
    vis.freqData=freqData;

    //https://multimedia.report/classes/coding/2018/exercises/basicbubblepackchart/
    var root = d3.hierarchy({children: freqData})
        .sum(function(d) { return d[1]; })
        .sort(function(a, b) { return b[1] - a[2]; });
         bubble(root);

    var bubbles = vis.svg.selectAll(".bubblePlot")
        .data(root.children)
        .enter();
    var circles= bubbles.append("circle")
        .attr("class", "circle")
        .attr("r", function(d){ 
            return d.r; 
        })
        .attr("cx", function(d){ 
            return d.x;
        })
        .attr("cy", function(d){ return d.y+50;
        })
        .attr("fill", function(d) { return colorScale(d.value); })
        .on("click", function(d, i){
            var tab = document.getElementById("artistName")
            tab.innerHTML = i.data[0] + "'s Top Songs"
            console.log(i.data[0])
            circles.attr("stroke","none");
            d3.select(this).attr("stroke","#CB88FF").attr("stroke-width", 5);
            d3.json("data/AllArtists.json")
                .then(function(data1) {
                    vis.dataArtists = data1[i["data"][0]]
                    vis.lollipop.update(vis.dataArtists)
            })
            window.location = '#lollipop'
        })

    circles.append("title")
        .text(function(d) { return ""+d.data[0]+";"+d.data[1]+""});
  

    bubbles.append("text")
        .data(root.children)
        .attr("x", function(d){ return d.x; })
        .attr("y", function(d){ return d.y + 50; })
        .attr("text-anchor", "middle")
        .style("font-size", function(d){
            if (d.data[1]==1 && vis.freqData.length>40){
                //alert("here")
                return "8px"
            }
            else if(d.data[1]==3){
                return "11px"
            }
            else if(d.data[1]>5){
                return "15px"
            }
            else{
                return "10px"
            }
        })
        .text(function(d){ 
                song= d.data[0]
                song= song.substring(0, 22);
                if(d.data[1]==1&& d.data[0].length>12 && vis.freqData.length>40 ){
                    song= song.substring(0, 12)+".";
                }
                return song;
        });
    bubbles.append("text")
        .data(root.children)
        .attr("x", function(d){ return d.x; })
        .attr("y", function(d){ return d.y+60 ; })
        .attr("text-anchor", "middle")
        .style("font-size", function(d){
            if (d.data[1]==1 && vis.freqData.length>40){
                return "6px"
            }
            else if(d.data[1]>4){
                return "10px"
            }
            else{
                return "8px"
            }
        })
        .text(function(d){ 
                return d.data[1];
        });

vis.svg.append("text").text("Some artists were shortened. Hover over circles to reveal the artist and frequency of each artist").attr("x", "50%").attr("y",36).attr("fill", "white").attr("text-anchor", "middle");
vis.svg.append("text").text("Click a circle to reveal an artist's top songs").attr("x", "50%").attr("y",19).attr("text-anchor", "middle").attr("fill", "white").style("font-size", "22px")

vis.svg.append("text").text("Frequency of").attr("x", 650).attr("y",330).attr("fill", "white").style("font-size", "22px");
vis.svg.append("text").text("Artists in").attr("x", 650).attr("y",350).attr("fill", "white").style("font-size", "22px");
vis.svg.append("text").text("The Playlist").attr("x", 650).attr("y",370).attr("fill", "white").style("font-size", "22px");

}

BubbleChart.prototype.update = function(data){
    var vis = this;
    vis.elementString = "#" + vis.parentElement
    $(vis.elementString).fadeOut(1000);
    setTimeout(later, 1000)

    function later(){
        $(vis.elementString).empty();
        vis.data = data;
        $(vis.elementString).fadeIn(1000);
        vis.initVis();
    }
}