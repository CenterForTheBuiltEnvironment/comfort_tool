d3.selection.prototype.moveToFront = function() {
  return this.each(function() {
    this.parentNode.appendChild(this);
  });
};

pc.line = d3.svg.line()
             .x(function(d){return pc.db_scale(d.db)})
             .y(function(d){return pc.hr_scale(1000 * d.hr)})
             .interpolate('cardinal')

pc.drawRange = function(factor, incr){
	rangeYes = true;
	rangefactor = factor;
	d3.selectAll("path.comfortzone").remove();
	d3.selectAll("path.comfortzone-range").remove();
    d3.selectAll("circle").remove();
	pc.removeRHcurve();
	//$("#factor-label, #factor-name, #factor-hover").remove();
	$('.inputfield').css('background-color', '#DCE7F7');
	$('#ta-lab, #inputfield-ta').css('visibility', 'hidden');
	
	setFactors(factor);
	
    var fakeFactor_1 = factor_1 * 1000;
    var fakeFactor_2 = factor_2 * 1000;

    if (fakeFactor_1 < fakeFactor_2) {
		  for (var x=fakeFactor_1; x<=fakeFactor_2; x+=incr) {
	     	d[factor] = x/1000;
	        console.log(x);
	    	pc.drawNewZone(d, factor, x);
	     	}
		  last_value = (x - incr)/1000;
		
		  var curve = pc.findRHcurve(d, 0.5, factor);
		  setTimeout(function(){pc.drawRHcurve(curve)}, 10);
		
		  $('#output-ranges').show();
		  $('.factor-name').html(factor_names[rangefactor]);
		  $('#factor-name').html(factor_names[rangefactor]);
		  //$("#factor-output-unit").html(factor_units[rangefactor]);
		  //$("#factor-output1").html( factor_1.toFixed(2) );
	      //$("#factor-output2").html( factor_2.toFixed(2) );
	      $("#inputfield-"+ factor).css('background-color', '#CECEE3');
			
		} else {
			alert("insert the min and max values of the range");
		}
}

pc.drawNewZone = function (d, factor, x) {
	var bound = pc.findComfortBoundary(d, 0.5)
	pc.drawComfortRegion(bound)
	d3.select("path.comfortzone")
      .attr("class", "comfortzone-range")
	  .on("mouseover", function(){
								  d3.select(this).attr("class", "comfortzone-rangeover");
								  pc.writeFactor(x);
								 })
      .on("mouseout", function(){d3.select(this).attr("class", "comfortzone-range");
								pc.hideFactor();
								})  
}

pc.writeFactor = function(x){
	$("#hover-output").css('color', 'black');
	if(isCelsius){
		$("#factor-hover").html(x/1000);
	} else {
		if(rangefactor=="tr"){
		  var foo = parseFloat(CtoF(x/1000).toFixed(1));
		  $("#factor-hover").html(foo);
		} else if(rangefactor=="vel"){
		  var foo = parseFloat(((x/1000)*196.9).toFixed(0));
		  $("#factor-hover").html(foo);
		} else {
		  $("#factor-hover").html(x/1000);
		}
	}
}
pc.hideFactor = function(){
	$("#hover-output").css('color', 'transparent');
}

pc.drawRHcurve = function(data){
	    pc.svg.append("path")
	        .attr("clip-path", "url(#clip)")
	        .attr("d", pc.pline(data)).attr("id", "rh-curve")   
	        .attr("class", "rh-curve-off")	        
	        .on("mouseover", function(){pc.drawTempLines();})
	        .on("mouseout", function(){pc.removeTempLines();})
			
	   if(inner_range > 0){		
		     $("#inner-range-width").html( (inner_range).toFixed(1) );
	     } else {
			$("#inner-range-width").html( "0.0" );
	    }
	
	    $("#outer-range-width").html( (right.db - left.db).toFixed(1) )
		if(isCelsius){
	       $("#range-output1").html( (left.db).toFixed(1) )
	       $("#range-output2").html( (right.db).toFixed(1) )
        }else{
	       $("#range-output1").html( CtoF(left.db).toFixed(1) )
	       $("#range-output2").html( CtoF(right.db).toFixed(1) )
		}
}

pc.redrawRHcurve = function(){
	pc.removeRHcurve();	
	setFactors(rangefactor);
	var curve = pc.findRHcurve(d, 0.5, rangefactor);
	pc.drawRHcurve(curve);
}

pc.removeTempLines = function(){
		d3.select(".rh-curve").attr("class", "rh-curve-off")
		d3.selectAll(".temp-line").remove()
		d3.selectAll(".temp-label").remove()
}

pc.drawTempLines = function() {
	 var left_line = [left].concat([{"db": left.db, "hr": 0}])
	 var right_line = [right].concat([{"db": right.db, "hr": 0}])
	 
	 var inner_left_line = [inner_left].concat([{"db": inner_left.db, "hr": 0}])
	 var inner_right_line = [inner_right].concat([{"db": inner_right.db, "hr": 0}])
	
	 d3.select(".rh-curve-off").attr("class", "rh-curve")
	
	 // for the outer range:
   pc.svg.append("path")
         .attr("clip-path", "url(#clip)")
         .attr("d", pc.line(left_line))   
         .attr("class", "temp-line").attr("id", "left-line")
   pc.svg.append("path")
         .attr("clip-path", "url(#clip)")
	       .attr("d", pc.line(right_line))   
	       .attr("class", "temp-line").attr("id", "right-line")
   if(isCelsius){
   		pc.svg.append("text").text(left.db.toFixed(1)).attr("class", "temp-label").attr("id", "left-temp-label")
	       .attr("x", pc.db_scale(left.db) - 31)
	       .attr("y", pc.hr_scale(0) - 2)
	       .attr("clip-path", "url(#clip)")
   		pc.svg.append("text").text(right.db.toFixed(1)).attr("class", "temp-label").attr("id", "right-temp-label")
	       .attr("x", pc.db_scale(right.db) + 4)
	       .attr("y", pc.hr_scale(0) - 2)
	       .attr("clip-path", "url(#clip)")
	} else {
		pc.svg.append("text").text(CtoF(left.db).toFixed(1)).attr("class", "temp-label").attr("id", "left-temp-label")
	       .attr("x", pc.db_scale(left.db) - 31)
	       .attr("y", pc.hr_scale(0) - 2)
	       .attr("clip-path", "url(#clip)")
    	pc.svg.append("text").text(CtoF(right.db).toFixed(1)).attr("class", "temp-label").attr("id", "right-temp-label")
	       .attr("x", pc.db_scale(right.db) + 4)
	       .attr("y", pc.hr_scale(0) - 2)
	       .attr("clip-path", "url(#clip)")
	}
	
	 // for the inner range:
   if(inner_range > 0){
     pc.svg.append("path")
           .attr("clip-path", "url(#clip)")
           .attr("d", pc.line(inner_left_line))   
           .attr("class", "temp-line").attr("id", "left-line")
     pc.svg.append("path")
	       .attr("d", pc.line(inner_right_line))   
	       .attr("class", "temp-line").attr("id", "inner_right-line")
	 if(isCelsius){
		 pc.svg.append("text").text(inner_left.db.toFixed(1)).attr("class", "temp-label").attr("id", "left-temp-label")
		       .attr("x", pc.db_scale(inner_left.db) - 31)
		       .attr("y", pc.hr_scale(0) - 2)
		 pc.svg.append("text").text(inner_right.db.toFixed(1)).attr("class", "temp-label").attr("id", "inner_right-temp-label")
		       .attr("x", pc.db_scale(inner_right.db) + 4)
		       .attr("y", pc.hr_scale(0) - 2)
	  } else {
			pc.svg.append("text").text(CtoF(inner_left.db).toFixed(1)).attr("class", "temp-label").attr("id", "left-temp-label")
		       .attr("x", pc.db_scale(inner_left.db) - 31)
		       .attr("y", pc.hr_scale(0) - 2)
		    pc.svg.append("text").text(CtoF(inner_right.db).toFixed(1)).attr("class", "temp-label").attr("id", "inner_right-temp-label")
		       .attr("x", pc.db_scale(inner_right.db) + 4)
		       .attr("y", pc.hr_scale(0) - 2)
	  }
   }
}

pc.findRHcurve = function(d, pmvlimit, factor) {
  var RHcurve = []

 	function solve(target){
    var epsilon = 0.001
    var a = 0
    var b = 100
    var fn = function(db){
      return comf.pmvElevatedAirspeed(db, d.tr, d.vel, d.rh, d.met, d.clo, d.wme)[0][0]
    }
    t = util.bisect(a, b, fn, epsilon, target)
    return {"db": t, "hr": pc.getHumRatio(t,d.rh)}
  }

   d[factor] = factor_1;
   var left_1 = solve(-pmvlimit);
   var right_1 = solve(pmvlimit);
   d[factor] = last_value;
   var left_2 = solve(-pmvlimit);
   var right_2 = solve(pmvlimit); 

   var left_db = Math.min(left_1.db, left_2.db);
   var right_db = Math.max(right_1.db, right_2.db);
   var inner_left_db = Math.max(left_1.db, left_2.db);
   var inner_right_db = Math.min(right_1.db, right_2.db);

   left = {"db": left_db, "hr": pc.getHumRatio(left_db,d.rh)}
   right = {"db": right_db, "hr": pc.getHumRatio(right_db,d.rh)}

   inner_left = {"db": inner_left_db, "hr": pc.getHumRatio(inner_left_db,d.rh)}
   inner_right = {"db": inner_right_db, "hr": pc.getHumRatio(inner_right_db,d.rh)}
   inner_range = inner_right_db - inner_left_db
  
  RHcurve.push(left) 

  for (t = left.db; t <= right.db; t += 0.5){
    RHcurve.push({"db": t, "hr": pc.getHumRatio(t, d.rh)})
  }

  RHcurve.push(right)

  return RHcurve;
}

pc.removeRHcurve = function(){
		d3.select("#rh-curve").remove()
		d3.selectAll(".temp-line").remove()
		d3.selectAll(".temp-label").remove()
		d3.select("#outer-range").remove()
		d3.select("#inner-range").remove()		
}