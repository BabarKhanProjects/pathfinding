$(document).ready(function(){
	
	var startNode = $("<node/>")
	var endNode = $("<node/>")
	var currentNode = $("<node/>")
	
	var startSet = false
	var endSet = false
	var found = false
	var createObsticle = false
	var width = 15
	setUpBoard()
	
	$(".babar").hover(function(){
		if (createObsticle == true){
			$(this).addClass("obstructionSet").removeClass("nullSet")
		}
	}).dblclick(function(){
		$(this).addClass("nullSet").removeClass("obstructionSet")
	})
	$(".babar").on("click",function(){
		if (createObsticle == true){
			$(this).addClass("obstructionSet").removeClass("nullSet")
		}else{
			if (startSet == false){
				$(".instructions").html("click to set end")
				$(this).css("background-color","lime").attr("id", "startNode").removeClass("nullSet")
				startNode.attr("x",parseInt($(this).attr("x")))
				startNode.attr("y",parseInt($(this).attr("y")))
				currentNode.attr("x",parseInt($(this).attr("x")))
				currentNode.attr("y",parseInt($(this).attr("y")))
				startSet = true
			}
			else if(endSet == false){
				$(this).css("background-color","red").attr("id", "endNode")
				endNode.attr("x",parseInt($(this).attr("x")))
				endNode.attr("y",parseInt($(this).attr("y")))
				endSet = true
				$(".instructions").html("calculating shortest path")
				$(".btn").show()
				var endDistance = startToCurrent(endNode.attr("x"),endNode.attr("y"), startNode.attr("x"),startNode.attr("y"))
				$("#startNode").html(endDistance.toFixed(1)).attr("endDistance", endDistance)
				
			}
		}
	})
	
	$(".btnMakeObsticle").click(function(){
		if (createObsticle==true){
			createObsticle = false
			$(".btnMakeObsticle").html("click to create obsticles")
		}else{
			createObsticle = true
			$(".btnMakeObsticle").html("stop creating obsticles")
		}
	})
	
	$(".btnFindNodes").click(function(){
		for(var counter = 1; counter < width * width; counter ++){
			if (found == false){
				findAdjacentNodes()
				findLowestCost()
				$("#endNode").css("background-color","red")
			}
		}
		tracebackShortestPath()
		$("#startNode").css("background-color","lime")
	})
	
	function setUpBoard(){
		$(".btnFindNodes").hide()
		$(".instructions").html("click to set start")

		for(y = 0; y< width; y++){
			for (x = 0; x< width; x++){
				$(".graph").append($("<div/>").addClass("col-sm-1 babar nullSet").attr("x", x).attr( "y", y)) 
			}
		}
	}

	function findAdjacentNodes(){
			$(".nullSet").each(function(){
				for(x=-1;x<2;x++){
					for(y=-1;y<2;y++){
						if($(this).attr("x") == parseInt(currentNode.attr("x")) + x  ){
							if($(this).attr("y") == parseInt(currentNode.attr("y")) + y){
								if($(this).attr("id")!="startNode"){
									
									$(this)
									.attr("parentNodeX", currentNode.attr("x"))
									.attr("parentNodeY", currentNode.attr("y"))
									.css("background-color","cyan")
									
									var endDistance = startToCurrent(endNode.attr("x"),endNode.attr("y"),$(this).attr("x"),$(this).attr("y"))
									var startDistance = startToCurrent(startNode.attr("x"),startNode.attr("y"),$(this).attr("x"),$(this).attr("y"))
									
									$(this)
									.attr("hCost",endDistance.toFixed(2))
									.attr("gCost",startDistance.toFixed(2))
									.attr("fCost", endDistance + startDistance)
									.addClass("openSet")
									.removeClass("nullSet")
									.html(endDistance.toFixed(1) + " " + startDistance.toFixed(1) + " " + (startDistance+endDistance).toFixed(1))
								}
								if($(this).attr("id") == "endNode"){
									$(".instructions").html("shortest path found!")
									found = true
									
									
								}
							}
						}
					}
				}
				
			})
		
	}
	
	function tracebackShortestPath(){
		var oldParentNodeX = $("#endNode").attr("parentNodeX")
		var oldParentNodeY = $("#endNode").attr("parentNodeY")
		var parentNodeX
		var parentNodeY
		var counter
		
		for (counter=1; counter<$(".closedSet").length ; counter++ ){
			$("[x='" + parentNodeX + "'][y='" + parentNodeY + "']").css("background-color","yellow")
			parentNodeX = oldParentNodeX
			parentNodeY = oldParentNodeY
			
			

			oldParentNodeX = $("[x='" + parentNodeX + "'][y='" + parentNodeY + "']").attr("parentNodeX")
			oldParentNodeY = $("[x='" + parentNodeX + "'][y='" + parentNodeY + "']").attr("parentNodeY")
		}
	}
	
	function startToCurrent(x,y,startX, startY){
		var xDistance = (x - startX)
		var yDistance = (y - startY)
		return (Math.sqrt(xDistance**2 + yDistance**2 ))
	};
	
	function findLowestFCost(){
		var lowest = 100000
		$(".openSet").each(function(){
			if($(this).attr("fCost") < lowest){
				lowest = parseFloat(($(this).attr("fCost")))
			}
		})
		return lowest
	}
	
	function findLowestHCost(lowestFCost){
		var lowest = 100000
		var xy
			$(".openSet[fCost = '" + lowestFCost + "']").each(function(){
			if($(this).attr("hCost") < lowest){
				lowest = parseFloat(($(this).attr("hCost")))
				xy = [$(this).attr("x"),$(this).attr("y")]
			}
		})
		return xy
	}
	
	function findLowestCost(){
		var lowestFCost = findLowestFCost()
		if($(".openSet[fCost='" + lowestFCost + "']").length != 1 ){
			var lowestHCostXY 
			var lowestHCostX
			var lowestHCostY
			lowestHCostXY = findLowestHCost(lowestFCost)
			lowestHCostX = lowestHCostXY[0]
			lowestHCostY = lowestHCostXY[1]
			currentNode.attr("x", $("[x='" + lowestHCostX + "'][y='" + lowestHCostY + "']").attr("x")) 
			currentNode.attr("y", $("[x='" + lowestHCostX + "'][y='" + lowestHCostY + "']").attr("y")) 
			$("[x='" + lowestHCostX + "'][y='" + lowestHCostY + "']")
			.removeClass("openSet")
			.addClass("closedSet")
			.css("background-color", "purple")
			
		}else{
			currentNode.attr("x", $(".openSet[fCost='" + lowestFCost + "']").attr("x")) 
			currentNode.attr("y", $(".openSet[fCost='" + lowestFCost + "']").attr("y")) 
			$("[fCost='" + lowestFCost + "']")
			.removeClass("openSet")
			.addClass("closedSet")
			.css("background-color", "purple")
		}
		
		
	};	
})