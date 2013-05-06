//bc.svg = d3.select("#svg-temphum");

bc.line = d3.svg.line()
             .x(function(d){return bc.db_scale(d.db)})
             .y(function(d){return bc.rh_scale(d.rh)})
             .interpolate('cardinal')

bc.drawRange = function(factor, incr){
	rangeYes = true;
	rangefactor = factor;
	d3.selectAll(".comfortzone-temphum").remove();
	d3.selectAll("path.comfortzone-temphum-range").remove();
    d3.selectAll("circle").remove();
	bc.removeRHcurve();
	$('.inputfield').css('background-color', '#DCE7F7');
	$('#ta-lab, #inputfield-ta').css('visibility', 'hidden');
	
	setFactors(factor);
	
    var fakeFactor_1 = factor_1 * 1000;
    var fakeFactor_2 = factor_2 * 1000;

    if (fakeFactor_1 < fakeFactor_2) {
		  for (var x=fakeFactor_1; x<=fakeFactor_2; x+=incr) {
	     	d[factor] = x/1000;
	        console.log(x);
	    	bc.drawNewZone(d, factor, x);
	     	}
		  last_value = (x - incr)/1000;
		
		  var curve = bc.findRHcurve(d, 0.5, factor);
		  setTimeout(function(){bc.drawRHcurve(curve)}, 10); 
		
		  $('#output-ranges').show();
		  $('.factor-name').html(factor_names[rangefactor]);
		  $('#factor-name').html(factor_names[rangefactor]);
	      $("#inputfield-"+ factor).css('background-color', '#CECEE3');
			
		} else {
			alert("insert the min and max values of the range");
		}
}

bc.drawNewZone = function (d, factor, x) {
	var bound = bc.findComfortBoundary(d, 0.5)
	bc.drawComfortRegion(bound)
	d3.select("path.comfortzone-temphum")
      .attr("class", "comfortzone-temphum-range")
	  .on("mouseover", function(){
								  d3.select(this).attr("class", "comfortzone-temphum-rangeover");
								  pc.writeFactor(x);
								 })
      .on("mouseout", function(){d3.select(this).attr("class", "comfortzone-temphum-range");
								pc.hideFactor();
								})  
}

bc.drawRHcurve = function(data){
	    d3.select("#svg-temphum").append("path")
	        .attr("clip-path", "url(#clip)")
	        .attr("d", bc.pline(data)).attr("id", "rh-curve-temphum")   
	        .attr("class", "rh-curve-temphum-off")	        
	        .on("mouseover", function(){bc.drawTempLines();})
	        .on("mouseout", function(){bc.removeTempLines();})
			
	   if(temphum_inner_range > 0){		
		     $("#inner-range-width").html( (temphum_inner_range).toFixed(1) );
	     } else {
			$("#inner-range-width").html( "0.0" );
	    }
	
	    $("#outer-range-width").html( (temphum_right.db - temphum_left.db).toFixed(1) )
		if(isCelsius){
	       $("#range-output1").html( (temphum_left.db).toFixed(1) )
	       $("#range-output2").html( (temphum_right.db).toFixed(1) )
        }else{
	       $("#range-output1").html( CtoF(temphum_left.db).toFixed(1) )
	       $("#range-output2").html( CtoF(temphum_right.db).toFixed(1) )
		}
}

bc.redrawRHcurve = function(){
	bc.removeRHcurve();	
	setFactors(rangefactor);
	var curve = bc.findRHcurve(d, 0.5, rangefactor);
	bc.drawRHcurve(curve);
}

bc.findRHcurve = function(d, pmvlimit, factor) {
  var RHcurve = []

 	function solve(rh, target){
    var epsilon = 0.001
    var a = 0
    var b = 100
    var fn = function(db){
      return comf.pmvElevatedAirspeed(db, d.tr, d.vel, rh, d.met, d.clo, d.wme)[0][0]
    }
    t = util.bisect(a, b, fn, epsilon, target)
    return {"db": t, "rh": rh}
  }

   d[factor] = factor_1;
   var left_1 = solve(d.rh, -pmvlimit);
   var right_1 = solve(d.rh, pmvlimit);
   d[factor] = last_value;
   var left_2 = solve(d.rh, -pmvlimit);
   var right_2 = solve(d.rh, pmvlimit); 

   var left_db = Math.min(left_1.db, left_2.db);
   var right_db = Math.max(right_1.db, right_2.db);
   var inner_left_db = Math.max(left_1.db, left_2.db);
   var inner_right_db = Math.min(right_1.db, right_2.db);

   temphum_left = {"db": left_db, "rh": d.rh}
   temphum_right = {"db": right_db, "rh": d.rh}

   temphum_inner_left = {"db": inner_left_db, "rh": d.rh}
   temphum_inner_right = {"db": inner_right_db, "rh": d.rh}
   temphum_inner_range = inner_right_db - inner_left_db
  
  RHcurve.push(temphum_left)

  RHcurve.push(temphum_right)

  return RHcurve;
}


bc.removeTempLines = function(){
		d3.select(".rh-curve-temphum").attr("class", "rh-curve-temphum-off")
		d3.selectAll(".temp-line-temphum").remove()
		d3.selectAll(".temp-label-temphum").remove()
}

bc.drawTempLines = function() {
	 var left_line = [temphum_left].concat([{"db": temphum_left.db, "rh": 0}])
	 var right_line = [temphum_right].concat([{"db": temphum_right.db, "rh": 0}])
	 
	 var inner_left_line = [temphum_inner_left].concat([{"db": temphum_inner_left.db, "rh": 0}])
	 var inner_right_line = [temphum_inner_right].concat([{"db": temphum_inner_right.db, "rh": 0}])
	
	 d3.select(".rh-curve-temphum-off").attr("class", "rh-curve-temphum")
	
	 // for the outer range:
   d3.select("#svg-temphum").append("path")
         .attr("clip-path", "url(#clip)")
         .attr("d", bc.line(left_line))   
         .attr("class", "temp-line-temphum").attr("id", "left-line-temphum")
   d3.select("#svg-temphum").append("path")
         .attr("clip-path", "url(#clip)")
	       .attr("d", bc.line(right_line))   
	       .attr("class", "temp-line-temphum").attr("id", "right-line-temphum")
   if(isCelsius){
   		d3.select("#svg-temphum").append("text").text(temphum_left.db.toFixed(1)).attr("class", "temp-label-temphum").attr("id", "left-temp-label-temphum")
	       .attr("x", bc.db_scale(temphum_left.db) - 31)
	       .attr("y", bc.rh_scale(0) - 2)
	       .attr("clip-path", "url(#clip)")
   		d3.select("#svg-temphum").append("text").text(temphum_right.db.toFixed(1)).attr("class", "temp-label-temphum").attr("id", "right-temp-label-temphum")
	       .attr("x", bc.db_scale(temphum_right.db) + 4)
	       .attr("y", bc.rh_scale(0) - 2)
	       .attr("clip-path", "url(#clip)")
	} else {
		d3.select("#svg-temphum").append("text").text(CtoF(temphum_left.db).toFixed(1)).attr("class", "temp-label-temphum").attr("id", "left-temp-label-temphum")
	       .attr("x", bc.db_scale(temphum_left.db) - 31)
	       .attr("y", bc.rh_scale(0) - 2)
	       .attr("clip-path", "url(#clip)")
    	d3.select("#svg-temphum").append("text").text(CtoF(temphum_right.db).toFixed(1)).attr("class", "temp-label-temphum").attr("id", "right-temp-label-temphum")
	       .attr("x", bc.db_scale(temphum_right.db) + 4)
	       .attr("y", bc.rh_scale(0) - 2)
	       .attr("clip-path", "url(#clip)")
	}
	
	 // for the inner range:
   if(temphum_inner_range > 0){
     d3.select("#svg-temphum").append("path")
           .attr("clip-path", "url(#clip)")
           .attr("d", bc.line(inner_left_line))   
           .attr("class", "temp-line-temphum").attr("id", "inner_left-line-temphum")
     d3.select("#svg-temphum").append("path")
	       .attr("d", bc.line(inner_right_line))   
	       .attr("class", "temp-line-temphum").attr("id", "inner_right-line-temphum")
	 if(isCelsius){
		 d3.select("#svg-temphum").append("text").text(temphum_inner_left.db.toFixed(1)).attr("class", "temp-label-temphum").attr("id", "temphum_left-temp-label")
		       .attr("x", bc.db_scale(temphum_inner_left.db) - 31)
		       .attr("y", bc.rh_scale(0) - 2)
		 d3.select("#svg-temphum").append("text").text(temphum_inner_right.db.toFixed(1)).attr("class", "temp-label-temphum").attr("id", "temphum_inner_right-temp-label")
		       .attr("x", bc.db_scale(temphum_inner_right.db) + 4)
		       .attr("y", bc.rh_scale(0) - 2)
	  } else {
			d3.select("#svg-temphum").append("text").text(CtoF(temphum_inner_left.db).toFixed(1)).attr("class", "temp-label-temphum").attr("id", "temphum_left-temp-label")
		       .attr("x", bc.db_scale(temphum_inner_left.db) - 31)
		       .attr("y", bc.rh_scale(0) - 2)
		    d3.select("#svg-temphum").append("text").text(CtoF(temphum_inner_right.db).toFixed(1)).attr("class", "temp-label-temphum").attr("id", "temphum_inner_right-temp-label")
		       .attr("x", bc.db_scale(temphum_inner_right.db) + 4)
		       .attr("y", bc.rh_scale(0) - 2)
	  }
   }
}

bc.removeRHcurve = function(){
		d3.select("#rh-curve-temphum").remove()
		d3.selectAll(".temp-line-temphum").remove()
		d3.selectAll(".temp-label-temphum").remove()		
}