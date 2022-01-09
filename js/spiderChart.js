/*
 * StackedAreaChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 */

function SpiderChart (_parentElement){
	this.parentElement = _parentElement;
}


SpiderChart.prototype.cleanData = function(){
    var vis = this
    vis.genreDict = {};
    var i  = 0
    vis.data.forEach(function(a, j){
        a.genre = eval('[' + a.genre + ']');
        for(i = 0; i < a.genre[0].length; i++){
            if(vis.genreDict.hasOwnProperty(a.genre[0][i])){
                vis.genreDict[a.genre[0][i]]++;
            } else {
                vis.genreDict[a.genre[0][i]] = 1;
            }
        }
    });
    vis.genreDict = sort_object(vis.genreDict)

    vis.maxGenres = 14
    if(Object.keys(vis.genreDict).length < 14){
        vis.maxGenres = Object.keys(vis.genreDict).length;
    }

    var i = 0
    var dataAxes = []

    for (const [key, value] of Object.entries(this.genreDict)) {
        var tempdict = {}
        tempdict["axis"] = key
        tempdict["value"] = value
        if(i < vis.maxGenres){
            dataAxes.push(tempdict)
            i++
        } else break;
      }
    
      //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
      let shuffledDataAxes = dataAxes
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    
      var newData = [];
      var tempdict2 = {}
      tempdict2["className"] = "genreArea"
      tempdict2["axes"] = shuffledDataAxes;
      tempdict2["color"] = "#CB88FF";
      newData.push(tempdict2)

      vis.data = newData;
    
    this.initVis();


     //https://stackoverflow.com/questions/25500316/sort-a-dictionary-by-value-in-javascript
     function sort_object(obj) {
        items = Object.keys(obj).map(function(key) {
            return [key, obj[key]];
        });
        items.sort(function(first, second) {
            return second[1] - first[1];
        });
        sorted_obj={}
        $.each(items, function(k, v) {
            use_key = v[0]
            use_value = v[1]
            sorted_obj[use_key] = use_value
        })
        return(sorted_obj)
    } 
}


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

SpiderChart.prototype.initVis = function(){
	var vis = this;

	vis.margin = { top: 80, right: 80, bottom: 150, left: 100 };
	vis.width = 300
    vis.height = 300

    var radarChartOptions = {
            w: vis.width,
            h: vis.height,
            margin: vis.margin,
            levels: 5,
            roundStrokes: true,
            color: d3.scaleOrdinal().range(["#CB88FF"]),
            format: '.0f'
          };

          // Draw the chart, get a reference the created svg element :
            
            RadarChart("#" + vis.parentElement, vis.data, radarChartOptions);


}

SpiderChart.prototype.update = function(data){
    var vis = this;
    vis.elementString = "#" + vis.parentElement
    $(vis.elementString).fadeOut(1000);
    setTimeout(later, 2100)

    function later(){
        $(vis.elementString).empty();
        vis.data = data;
        $(vis.elementString).fadeIn(2000);
        vis.cleanData();
    }
}