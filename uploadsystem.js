$(document).ready(function() {
		///////////////////////////////////////////////////////////////////////////////////////////////
		//Build upload form printer, material, color selections
		///////////////////////////////////////////////////////////////////////////////////////////////

		//fill the printer dropdown
		var printersMenu = $("#printersdropdown");
		$.each(printers, function() {
			printersMenu.append("<option>"+this.title+"</option>");
		});
	    
	    //when the printer dropdown selection changes, build new materials dropdown
	    printersMenu.change(function(){ 
	    	var printerName = $(this).val();
	    	$("#materialsdropdown").html("");
	    	for(var i = 0; i != printers.length; i++){
	    		var printer = printers[i];
	    		if(printer.title === printerName){
	    			for(var j = 0; j < printer.materials.length; j++){
	    				var mat = printer.materials[j];
	    				$("#materialsdropdown").append("<option>"+mat.name+"</option>");
	    			}
	    			//now build new colors dropdown to match default material choice
	    			var mat = $("#materialsdropdown").val();
	    			for(var l = 0; l != printer.materials.length; l++){
	    				var material = printer.materials[l];
	    				if(material.name === mat){
			    			$("#colorsdropdown").html("");
			    			for(var k = 0; k != material.colors.length; k++){
			    				$("#colorsdropdown").append("<option>"+material.colors[k]+"</option>");
			    			}
			    		}
			    	}
	    		}
	    	}
	    });
	    //when the materials dropdown changes, build new colors dropdown
	    $("#materialsdropdown").change(function(){
	    	$("#colorsdropdown").html("");
	    	var printerName = $("#printersdropdown").val();
	    	var mat = $(this).val();
	    	for(var i = 0; i != printers.length; i++){
	    		var printer = printers[i];
	    		if(printer.title === printerName){
	    			for(var j = 0; j != printer.materials.length; j++){
	    				var material = printer.materials[j];
	    				if(material.name === mat){
					    	for(var k = 0; k < material.colors.length; k++){
					    		$("#colorsdropdown").append("<option>"+material.colors[k]+"</option>");
					    	}
	    				}
	    			}
	    		}
	    	}
	    	
	    });
	});