var user_lat=44.1067367;
var user_lon=9.8292189;


navigator.geolocation.getCurrentPosition(foundLocation, noLocation);     



function foundLocation(position){

  user_lat = position.coords.latitude;
  user_lon = position.coords.longitude;
  
 
}
function noLocation()
{
  alert('Non è possibile rilevare la tua posizione');
}




function daiCoordinateDaIndirizzo(indirizzo){
	var geoCoder=new google.maps.Geocoder();
	var r={
		address : indirizzo
	}
	geoCoder.geocode(r, function(response, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        //alert(response[0].geometry.location);  
      }
    });
}

function daiIndirizzoDaCoordinate(lat,lon){
	var geoCoder=new google.maps.Geocoder();
	var l= new google.maps.LatLng(lat,lon)
	var r={
		location : l
	}
	geoCoder.geocode(r, function(response, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        //alert(response[0].formatted_address)
      }
    });
}


var directionsDisplay=0;
function calcolaPercorso(map,lat,lon){
	
	appML.appManagerShowLoading();
	if(directionsDisplay!=0)
		directionsDisplay.setMap(null);
	
	directionsService = new google.maps.DirectionsService();

    directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers:true});
   
   	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById('itinerario'));
	$("#itinerario").html("");
	
  	
    var start = new google.maps.LatLng(user_lat,user_lon) ; 
    var end =  new google.maps.LatLng(lat,lon)  
   
    var request = {
        origin:start, 
        destination:end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
        //travelMode: google.maps.DirectionsTravelMode.WALKING
    };
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
		
        directionsDisplay.setDirections(response);
        setTimeout(function(){appML.appManagerHideLoading()},2500);
        //alert(response.routes[0].legs[0].distance.value/1000)
       }
    });
 
}


function calcolaDistanza(directionsServiceDistanza,lat,lon,caso,id){
	
	var start = new google.maps.LatLng(user_lat,user_lon) ; 
    var end =  new google.maps.LatLng(lat,lon)  
   
    var request = {
        origin:start, 
        destination:end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
        //travelMode: google.maps.DirectionsTravelMode.WALKING
    };
    directionsServiceDistanza.route(request, function(response, status){
      if (status == google.maps.DirectionsStatus.OK){
      	avanzamentoRichiesteDistanza++;
    	//console.log(avanzamentoRichiesteDistanza)
      	var num=response.routes[0].legs[0].distance.value/1000;
		console.log(num)
        if(caso=="att"){
        	for(i in jsonAttivita){
        		if(jsonAttivita[i].id==id)
        			jsonAttivita[i]['distanza'] = num;
        	}
        }
        if(caso=="eve"){
        	for(i in jsonEventi){
        		if(jsonEventi[i].id==id)
        			jsonEventi[i]['distanza'] = num;
        	}
        }
        
        for(i in arrPuntiDaCalcolare){
        	arrPuntiDaCalcolare[i].dis=num;
        }
        
       }
    });
 
}


  
 
  