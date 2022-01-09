function Lollipop(){

    var self = this;
    self.init();
};

// init svg
Lollipop.prototype.init = function(){
    var self = this;
    d3.select("#lollipop").selectAll("*").remove()
    var lolliDiv = d3.select("#lollipop")
    self.margin = {top: 70, right: 50, bottom: 50, left: 50};
    self.svgBounds = lolliDiv.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right - 100;
    self.svgHeight = 400;
    self.svg = lolliDiv.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight+6*self.margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + self.margin.left + "," + self.margin.top + ")");
        
    self.svg.append("text").text("selected artist's top songs").attr("x", "50%").attr("y",12).attr("fill", "white").attr("text-anchor", "middle").attr("id", "artistNameLabel").style("font-size", "22px");
    self.svg.append("text").text("click the image to open to song in Spotify").attr("x", "50%").attr("y",25).attr("fill", "white").attr("text-anchor", "middle");


    self.xAxis = self.svg.append("g")
    .attr("transform", "translate(0," + self.svgHeight + ")")
    .attr("class", "xAxis")

    self.yAxis = self.svg.append("g")
    .attr("class", "yAxis")

    self.defs = self.svg.append('defs');

    // tooltip
    self.tooltip = self.svg.append("g")	
    .attr("class", "tooltipLolli")
    .attr("fill", "#CB88FF")
    .style("opacity", 0);

    let tooltipWidth = 120
    let tooltipHeight = 28
    self.toolTipRect = self.tooltip.append("rect")
    .attr("width", tooltipWidth)
    .attr("height", tooltipHeight)	
    .attr("fill", "#CB88FF")
    .attr("rx", 10)			

    self.tooltipText = self.tooltip.append("text")
    .text("hello")
    .attr("fill", "black")
    .attr("x", tooltipWidth/2)
    .attr("y", tooltipHeight/2)
    .style("text-anchor", "middle")
    .attr("dominant-baseline", "central") ;
  
}

// update provided data
Lollipop.prototype.update = function(data){
    var self = this

    let tooltipWidth = 120
    let tooltipHeight = 28
        // tooltip
        // self.tooltip = self.svg.append("g")	
        // .attr("class", "tooltipLolli")
        // .attr("fill", "#CB88FF")
        // .style("opacity", 0);
    
        // let tooltipWidth = 120
        // let tooltipHeight = 28
        // self.tooltip.append("rect")
        // .attr("width", tooltipWidth)
        // .attr("height", tooltipHeight)	
        // .attr("fill", "#CB88FF")
        // .attr("rx", 10)			
    
        // self.tooltipText = self.tooltip.append("text")
        // .text("hello")
        // .attr("fill", "black")
        // .attr("x", tooltipWidth/2)
        // .attr("y", tooltipHeight/2)
        // .style("text-anchor", "middle")
        // .attr("dominant-baseline", "central") ;

    // X axis
    var x = d3.scaleBand()
    .range([ 0, self.svgWidth ])
    .domain(data.map(function(d) {return d["title"]; }))
    .padding(1);


    self.xAxis.transition().duration(1000)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(10,2)rotate(-30)")
    .attr("fill", "#ccebc5")
    .attr('font-family', 'Quicksand')
    .style("text-anchor", "end")

    console.log(data)

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, 100])
    .range([ self.svgHeight, 0]);

    self.yAxis.call(d3.axisLeft(y).ticks(1))
    .selectAll("text")
    .attr("fill", "#ccebc5")
    .attr('font-family', 'Quicksand')

    self.svg.append("text").text("popularity").attr("x", "0").attr("y","0").attr("fill", "white").attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)translate(-"+self.svgHeight/2+",-20)");



    // add lines
    self.svg.selectAll(".lollipopLine")
    .data(data)
    .enter()
    .append("line")
    .attr("x1", function(d) { return x(d.title); })
    .attr("x2", function(d) { return x(d.title); })
    .attr("y1", function(d) { return y(d.popularity); })
    .attr("y2", y(0))
    .attr("class", "lollipopLine")
    .attr("stroke", "#00C4CC")

    // remove lines
    self.svg.selectAll(".lollipopLine")
    .data(data)
    .attr("x1", function(d) { return x(d.title); })
    .attr("x2", function(d) { return x(d.title); })
    .attr("y1", function(d) { return y(d.popularity); })
    .attr("y2", y(0))
    .attr("class", "lollipopLine")
    .attr("stroke", "#00C4CC").exit().remove()



    var imageWidth = 50
    var imageMargin = 6

  
    self.defs.selectAll(".circleClip")
    .data(data)
    .attr("cx", function(d) { return x(d.title); })
    .attr("cy", function(d) { return y(d.popularity); })
    .attr("r", imageWidth/2)
    .attr("class", "circleClip")
    .attr("id", function(d, i) { return "clip"+i}).exit().remove()

    self.defs.selectAll(".circleClipPath")
    .data(data)
    .attr("class", "circleClipPath")
    .attr("id", function(d, i) { return "clipPath"+i}).exit().remove()

    self.defs.selectAll(".circleClip")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return x(d.title); })
    .attr("cy", function(d) { return y(d.popularity); })
    .attr("r", imageWidth/2)
    .attr("class", "circleClip")
    .attr("id", function(d, i) { return "clip"+i})

    self.defs.selectAll(".circleClipPath")
    .data(data)
    .enter()
    .append("clipPath")
    .attr("class", "circleClipPath")
    .attr("id", function(d, i) { return "clipPath"+i})
    .append('use')
    .attr('xlink:href', function(d, i) { return "#clip"+i});

    // remove lollipop images
    self.img = self.svg.selectAll(".lollipopImg")
    .data(data)
    .attr("href", function(d) { return d.imageURL })
    .attr("x", function(d) { return x(d.title)-imageWidth/2 ; })
    .attr("y", function(d) { return y(d.popularity)-imageWidth/2; })
    .attr("width", imageWidth)
    .attr("height", imageWidth)
    .attr("style", "border-radius: 50%")
    .attr("class", "lollipopImg")
    .attr("clip-path", function(d,i) { return 'url(#clipPath'+i+')'})
    .on("mouseover", function(e, d) {	
        self.tooltip.moveToFront()
 
        const[x, y] = d3.pointer(event);	
        self.tooltip.transition()		
            .duration(200)		
            .style("opacity", .8);		
        
        self.tooltip.attr("transform", "translate("+x+", "+(y-imageWidth/2)+")")

        self.tooltipText.text("popularity: "+e.toElement.__data__.popularity+"%")

        // TODO: show overlap
        self.svg.select("#playButton"+data.indexOf(d)).attr("visibility", "visible")
        self.svg.select("#overlay"+data.indexOf(d)).attr("visibility", "visible")
        })					
    .on("mouseout", function(d) {		
        self.tooltip.select("rect").transition()		
            .duration(500)		
            .style("opacity", 0);	
    })
    .exit().remove()

    // remove image overlay
 
        overlay = self.svg.selectAll("circle.lollipopOverlay")
           .data(data)

           .attr("cx", function(d) { return x(d.title) })
           .attr("cy", function(d) { return y(d.popularity) })
           .attr("r", imageWidth/2)
           .attr("fill", "white")
           .attr("opacity", "50%")
           .attr("visibility", "hidden")
           .attr("id", function(d, i) { return "overlay"+i} )	
           .attr("class", "lollipopOverlay")			
        .on("mouseout", function(e, d) {		
            self.tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	

            self.svg.select("#playButton"+data.indexOf(d)).attr("visibility", "hidden")
            self.svg.select("#overlay"+data.indexOf(d)).attr("visibility", "hidden")
        })
        .on("click", function (d, i){
            window.open(i.songUrl);
    
        })
        .exit().remove()

 
        playButton = self.svg.selectAll("path.lollipopPlayButton")
           .data(data)
           .attr("d", function(d) { return "M "+(x(d.title)-(imageWidth * Math.sqrt(3) / 8 - 2))+" "+(y(d.popularity)-(imageWidth / 4))+" v "+(imageWidth/2)+" l "+(imageWidth * Math.sqrt(3) / 4)+" -"+(imageWidth / 4)+" l -"+(imageWidth * Math.sqrt(3) / 4)+" -"+(imageWidth / 4)} )
           .attr("fill", "#4b0bd1")
           .attr("opacity", "80%")
           .attr("visibility", "hidden")
           .attr("id", function(d, i) { return "playButton"+i} )
           .attr("class", "lollipopPlayButton")		
           .on("click", function (d, i){
            window.open(i.songUrl);
    
            })
            .exit().remove()	
        

    self.toolTipRect = self.tooltip.append("rect")
    .attr("width", tooltipWidth)
    .attr("height", tooltipHeight)	
    .attr("fill", "#CB88FF")
    .attr("rx", 10)			

    self.tooltipText = self.tooltip.append("text")
    .text("hello")
    .attr("fill", "black")
    .attr("x", tooltipWidth/2)
    .attr("y", tooltipHeight/2)
    .style("text-anchor", "middle")
    .attr("dominant-baseline", "central") ;


    // add lollipop images
    images = self.svg.selectAll(".lollipopImg")
    .data(data)
    .enter()
    .append("image")
    .attr("href", function(d) { return d.imageURL })
    .attr("x", function(d) { return x(d.title)-imageWidth/2 ; })
    .attr("y", function(d) { return y(d.popularity)-imageWidth/2; })
    .attr("width", imageWidth)
    .attr("height", imageWidth)
    .attr("class", "lollipopImg")
    .attr("clip-path", function(d,i) { return 'url(#clipPath'+i+')'})
    .on("mouseover", function(e, d) {	
        self.tooltip.moveToFront()

        const[x, y] = d3.pointer(event);	
        self.tooltip.transition()		
            .duration(200)		
            .style("opacity", .8);		
        
        self.tooltip.attr("transform", "translate("+x+", "+(y-imageWidth/2)+")")

        self.tooltipText.text("popularity: "+e.toElement.__data__.popularity+"%")

        // TODO: show overlap
        self.svg.select("#playButton"+data.indexOf(d)).attr("visibility", "visible")
        self.svg.select("#overlay"+data.indexOf(d)).attr("visibility", "visible")
    })		



    // overlay.exit().remove()

    // playButton.exit().remove()

        // add image overlay
        overlay = self.svg.selectAll("circle.lollipopOverlay")
           .data(data)
           .enter()
           .append("circle")
           .attr("cx", function(d) { return x(d.title) })
           .attr("cy", function(d) { return y(d.popularity) })
           .attr("r", imageWidth/2)
           .attr("fill", "white")
           .attr("opacity", "50%")
           .attr("visibility", "hidden")
           .attr("id", function(d, i) { return "overlay"+i} )
           .attr("class", "lollipopOverlay")		
        .on("mouseout", function(e, d) {		
            self.tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	

            self.svg.select("#playButton"+data.indexOf(d)).attr("visibility", "hidden")
            self.svg.select("#overlay"+data.indexOf(d)).attr("visibility", "hidden")
        })
        .on("click", function (d, i){
            window.open(i.songUrl);
    
        });
 
        playButton = self.svg.selectAll("path.lollipopPlayButton")
           .data(data)
           .enter()
           .append("path")
           .attr("d", function(d) { return "M "+(x(d.title)-(imageWidth * Math.sqrt(3) / 8 - 2))+" "+(y(d.popularity)-(imageWidth / 4))+" v "+(imageWidth/2)+" l "+(imageWidth * Math.sqrt(3) / 4)+" -"+(imageWidth / 4)+" l -"+(imageWidth * Math.sqrt(3) / 4)+" -"+(imageWidth / 4)} )
           .attr("fill", "#4b0bd1")
           .attr("opacity", "80%")
           .attr("visibility", "hidden")
           .attr("id", function(d, i) { return "playButton"+i} )
           .attr("class", "lollipopPlayButton")
           .on("click", function (d, i){
            window.open(i.songUrl);
    
        })		
       


    
    // playButton
    // .attr("style", "border-radius: 50%")
    // .on("click", function (d, i){
    //     window.open(i.songUrl);

    // })


    // overlay
    // .attr("style", "border-radius: 50%")
    // .on("click", function (d, i){
    //     window.open(i.songUrl);

    // })

    

   
    
}


