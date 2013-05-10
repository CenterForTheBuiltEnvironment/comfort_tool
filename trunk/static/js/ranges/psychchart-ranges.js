d3.selection.prototype.moveToFront = function() {
  return this.each(function() {
    this.parentNode.appendChild(this);
  });
};

pc.line = d3.svg.line()
             .x(function(d){return pc.db_scale(d.db)})
             .y(function(d){return pc.hr_scale(1000 * d.hr)})
             .interpolate('cardinal')


pc.drawNewZone = function (d, bound, factor, x) {
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
		if(rangefactor=="tr"){
		  var foo = parseFloat((x/1000).toFixed(1));
		  $("#factor-hover").html(foo);
		} else if(rangefactor=="vel"){
		  var foo = parseFloat((x/1000).toFixed(2));
		  $("#factor-hover").html(foo);
		} else {
		  $("#factor-hover").html(x/1000);
		}
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
		 if(isCelsius){
	       $("#inner-range-width").html( (inner_range).toFixed(1) );
		   $("#outer-range-width").html( (outer_range).toFixed(1) )
	       $("#range-output1").html( (left.db).toFixed(1) )
	       $("#range-output2").html( (right.db).toFixed(1) )
         }else{
	       $("#inner-range-width").html( (inner_range * 1.8).toFixed(1) );
	       $("#outer-range-width").html( (outer_range * 1.8).toFixed(1) )
	       $("#range-output1").html( CtoF(left.db).toFixed(1) )
	       $("#range-output2").html( CtoF(right.db).toFixed(1) )
		 }
	  } else {
		$("#inner-range-width").html( "0.0" );
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

  function rhclos(rhx, target) {
      return function(db) {
          return comf.pmvElevatedAirspeed(db, d.tr, d.vel, rhx, d.met, d.clo, 0)[0][0] - target
      }
  }
  function solve(rhx, target) {
      var epsilon = 0.001 // ta precision
      var a = -50
      var b = 50
      var fn = rhclos(rhx, target)
      t = util.secant(a, b, fn, epsilon)
      return {
          "db": t,
          "hr": pc.getHumRatio(t, rhx)
      }
		console.log(pc.getHumRatio(t, rhx))
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

   left = {"db": left_db, "hr": pc.getHumRatio(left_db,d.rh)}
   right = {"db": right_db, "hr": pc.getHumRatio(right_db,d.rh)}

   inner_left = {"db": inner_left_db, "hr": pc.getHumRatio(inner_left_db,d.rh)}
   inner_right = {"db": inner_right_db, "hr": pc.getHumRatio(inner_right_db,d.rh)}
   inner_range = (inner_right_db) - (inner_left_db)
   outer_range = (right_db) - (left_db)
  
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