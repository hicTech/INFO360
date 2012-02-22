	
		
	commonsSettings={
		picasaUser: "info360.net@gmail.com",
		includeNoPubblicLines: false, // if true includes line with label:Pubblica = "no"
		cache : false,
		polling_frequency: 10, // (seconds) cyclic checking if update_latency time was spent
		update_latency: 1,  // (hours) max time difference between local data version and server data version
		// example: polling_frequency=20 and update_latency=1 every 20 seconds it checks to see if more than one hour has passed since the last update
		requests_queue :   [
					["https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AlcCAAhthL0MdEhKS0dIQVlBRWFHTFpScW90alV2bGc&output=html", setConf] // no_cache prevent caching of a specific google doc
					,["https://docs.google.com/spreadsheet/pub?hl=it&hl=it&key=0AlcCAAhthL0MdG1ONWRsU1lWaDg4WWVmMFRuYWlzNFE&output=html",localizza]
					,["https://docs.google.com/spreadsheet/pub?hl=it&hl=it&key=0AlcCAAhthL0MdHNJUUlLaXFyMHNVUE9rYWJxOGpDVnc&output=html", iconeMacrocategorie]
				 	,["https://docs.google.com/spreadsheet/pub?hl=it&hl=it&key=0AlcCAAhthL0MdGxva0pMdjNYYzd0b2VNbm52aDVVYmc&output=html", primeAttivita]
				 	,["https://docs.google.com/spreadsheet/pub?hl=it&hl=it&key=0AlcCAAhthL0MdGx5a055RWhmRkpoc1ZvcHZRUUhmRkE&output=html", attivita]
					,["https://docs.google.com/spreadsheet/pub?hl=it&hl=it&key=0AlcCAAhthL0MdFNHTHJqSEdCdDBZV2M5VHU2bW53ZEE&output=html",eventi]
				]
	}
	


var confJson;	


function startMultipleRequest(queue,callback){

	var results=new Array();

	for(var i=0;i<queue.length;i++){
		results.push(["",queue[i][1]]);
	}
	
	
	var index=1;
	request();
	
	function request(r){
		if(r){
			results[index-2][0]=r;
		}
		if(index==queue.length+1){
			ended();
		}
		else{				
			getJsonGdocs(queue[index-1][0],request,queue[index-1][2]);
			index++;
		}
	}
	
	function ended(){
		for(var i=0;i<results.length;i++){
			results[i][1].call(null,results[i][0])
		}
		if(callback)
			callback.call()
	}
}

var stopPolling=false;
function setConf(result){
	
	//console.log("INVOCATO SETCONF")
	confJson="";
	confJson+='{';
		for(var i=0; i<result.length;i++){
			confJson+='"'+result[i].name+'":"'+result[i].value+'"';
			if(i!=result.length-1) confJson+=",";
		}
		confJson+='}';
		confJson = JSON.parse(confJson);

		$("span[class^='CONF']").each(function(){
			var key=$(this).attr("class").replace("CONF ","");
			$(this).html(confJson[key]);
		});
	

		//console.log("versione corrente in local storage "+DBget("currentDataVersion"))
		//console.log("versione trovata nel JSON "+confJson.dataVersion)
		
		
		stopPolling=false
		var tasto_ricarica=$(".tasto_ricarica");
		
		if(tasto_ricarica.is(".new"))
			tasto_ricarica.removeClass("new")
			
		
		if(DBget("currentDataVersion")==null){
			DBset("currentDataVersion",confJson.dataVersion);
			DBset("lastVersionDataTime",new Date().getTime());	
		}
		else{
			if(DBget("currentDataVersion")!=confJson.dataVersion){
				//console.log("Ci sono aggiornameti");
				$(".tasto_ricarica").addClass("new");
				stopPolling=true;
			}
			//else{
				//console.log("NON ci sono aggiornameti");
			//}
		}

		
	}
	

	
	//polling
	function avviaPolling(){
		if(commonsSettings.cache){
			
				//console.log("Avvio polling");
				setInterval(function(){
					if(!stopPolling && parseInt(new Date().getTime() - DBget("lastVersionDataTime")) >parseInt(commonsSettings.update_latency * 3600000) )    
						checkOfLastVersion();
					//else
						//console.log("tutto ok - tempo di latenza NON passato o il polling è stato interrotto "+parseInt(new Date().getTime() - DBget("lastVersionDataTime"))+" millisec dall'ultimo verifica");
				}, (commonsSettings.polling_frequency*1000) )
			
		}
	}
		
	function checkOfLastVersion(){
		//console.log("passato il tempo di latenza - FACCIO RICHIESTA");
		DBset("lastVersionDataTime",new Date().getTime());
		getJsonGdocs("https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AlcCAAhthL0MdEhKS0dIQVlBRWFHTFpScW90alV2bGc&output=html", riprova,"no_cache");
		// non so perchè ma alla prima chiamata in currentDataVersion non mi trovo quello che in effetti c'è sul google doc, alla seconda chiamata invece si
		// quindi con riprova() ho messo una pezza per forzare la doppia chiamata ed avere l'effettivo valore attualmente presente nel gdocs! :\
	}
	
	
	function riprova(result){
		getJsonGdocs("https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AlcCAAhthL0MdEhKS0dIQVlBRWFHTFpScW90alV2bGc&output=html", setConf,"no_cache");
	}
	
	

	
	


