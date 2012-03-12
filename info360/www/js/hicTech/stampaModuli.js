var jsonEventi,jsonAttivita,jsonIcone;
var arrCitta=new Array();
var arrCategorie=new Array();
var countAttivitaPerCitta=new Array();
var countAttivitaPerCategoria=new Array();
var countEventiPerCitta=new Array();
var countEventiPerCategoria=new Array();
var arrPuntiDaCalcolare=new Array(); // contiene dei json in cui memorizzo per ogni attività/evento la su distance in modo da non richiederla due volte
var avanzamentoRichiesteDistanza=0;


/*
 * ###########  ATTIVITA  ###########
 */

var jsonPrimeAttivita;
function primeAttivita(result){
	jsonPrimeAttivita=result;
	
}


function attivita(result){
	jsonAttivita = jsonPrimeAttivita.concat(result);
	$("#tot_attivita").html(jsonAttivita.length);
	//alert(jlinq.from(jsonAttivita).equals("Citta", "Viareggio").select()[1].Tag);
	
}

function creaAttivita(result){
    
	if(!result)
		result=jsonAttivita;
	$("#fragment_attivita").html("<li class='sep' id='sep_att' style='text-align:center; color:#c07d00'>Attività <span id='sep_attivita' style='font-size:12px; color:#fff'></span></li>")
	
	var time3=new Date().getTime();
	
	
	if(countAttivitaPerCitta.length!=0){
		countAttivitaPerCitta=new Array();
		countAttivitaPerCategoria=new Array();
	}
	
	for(var i=0; i<result.length;i++){	
		if(result[i].Pubblica=="si"){
			var r=result[i];
			var id=picasaAlbumName(r.Nome);
			
			result[i]['id'] = id;  // aggiungo a jsonAttivita l'id = nomePicasa
			
			var riga=$(daiRigaAttivita(r));
			
			result[i]['distanza'] = 99999999;
			result[i]['obj'] = riga;  // aggiungo al jsonAttivita il riferimento all'oggetto html riga
			result[i]['Tag'] =  result[i]['Tag'].replace(/;/g, "").replace(/ ,/g, ",").replace(/ , /g, ",").replace(/, /g, ",").replace(/ /g, ",")
			
			
			$("#fragment_attivita").append(riga)
			countAttivitaPerCitta.push(r.Citta);
			countAttivitaPerCategoria.push(r.Categoria);
			arrCitta.push(r.Citta);
			arrCategorie.push(r.Categoria)
		}
		
	}
	
	jsonAttivita=result;
	
	var time4=new Date().getTime();
	console.log("tempo for daiRigaAttivita: "+ parseInt(time4-time3))
	
	$("#fragment_attivita").append("<div class='clearDiv'></div>")
    
	arrCitta=uniqueArr(arrCitta)
    
	var dove=$("#page_citta > div > ul")
	dove.html("");
	
	var time5=new Date(); time5=time5.getTime();
	
	var html_righe="";
	for(var i=0;i<arrCitta.length;i++){
		html_righe+=daiRigaCitta(arrCitta[i])
	}
	dove.append(html_righe);
	
	var time6=new Date(); time6=time6.getTime();
	console.log("tempo for daiRigaCitta: "+ parseInt(time6-time5))
	
	
	
    
    
	function daiRigaCitta(nome){
		
		if(DBget("riga_citta"+nome)!=null)
			return DBget("riga_citta"+nome);
		
		var result= '<li class="arrow riga_citta" data-citta="'+nome+'" style="height:60px">'+
        '<div>'+
        '<div style="float:left; width:57px; margin:7px 3px 0px 5px"><img src="img/citta_icon.png" /></div>'+
        '<div style="float:left; width:70%; font-size:14px">'+
        '<div><font style="color:#fff;font-size:17px">'+nome+'</font></div>'+
        '<div style="margin-top:2px" class="count_att">'+i18n("Attività")+': <span class="arancio"></span></div>'+
        '<div style="margin-top:0" class="count_eve">'+i18n("Eventi")+': <span class="arancio"></span></div>'+
        '</div>'+
        '</div>'+
        '</li>';
        
		DBset("riga_citta"+nome,result);  
		return result;
        
	}
    
	function daiRigaAttivita(r){
		var id=picasaAlbumName(r.Nome);
		var premium = (r.Premium == "no" || r.Premium == "###") ? false : true;
		var nome_att=r.Nome;
		if(appML.getEnviroment().isIDevice && !appML.getEnviroment().isIPad )
			nome_att=tronca(nome_att,28);
        
		if(DBget("riga_attivita_"+id)!=null && DBget("riga_attivita_"+id)!="" )  // mettendo "" nei record local storage forzo il ricalcolo della riga in questione
			return DBget("riga_attivita_"+id);
		
		var citta=r.Citta;
		var categoria=r.Categoria;
		var dist="";
		if(r.distanza && r.distanza!=99999999) {
			var d=(r.distanza.toFixed(2)).replace(".",",")
			dist=d +" <font style='font-size:9px'>Km</font>";
		}
		
        
		var result= '<li class="arrow riga_attivita" data-lon="'+r.Lon+'" data-lat="'+r.Lat+'" data-id-attivita="'+id+'" data-nome="'+r.Nome+'" data-categoria="'+categoria+'" data-citta="'+citta+'" data-indirizzo="'+r.Indirizzo+'" data-descrizione="'+r.Descrizione+'" data-id-citta="'+getPicasaAlbumName(citta)+'" data-id-categoria="'+getPicasaAlbumName(categoria)+'" data-cell="'+r.Cell+'" data-tell="'+r.Tell+'" data-email="'+r.Email+'" data-tags="'+r.Tag+'" >'+
        '<div>'+
        '<div style="float:left; width:57px; margin:4px 3px 0px 5px" class="thumb thumb_attivita" data-premium="'+premium+'" data-picasa-id='+id+'><div  class="'+getPicasaAlbumName(categoria).toLowerCase()+' thumb_loading_image"/></div>'+  //<img src="img/thumb_loading.png" class="thumb_loading_image" />
        
        // '<div style="float:left; width:37px; margin:0px 3px 0px 2px" class="thumb thumb_attivita" data-picasa-id="'+id+'" >'+
        //	'<div class="'+getPicasaAlbumName(categoria).toLowerCase()+'"/>'+
        //'</div>'+
        '<div class="dati_riga">'+
        '<div><div style="color:#fff; text-align:left">'+nome_att+'</div></div>'+
        '<div class="label_categoria" style="margin-top:-1px">'+i18n("Categoria").substr(0,5)+'.: <span class="arancio">'+i18n(categoria.capitalize())+'</span></div>'+
        '<div class="label_categoria" style="margin-top:-1px">'+i18n("Città")+'.: <span class="arancio">'+citta.capitalize()+'</span></div>'+
        '<div style="margin:-26px -10px 0px 0px; font-size:14px; float:right"><span class="arancio" id="span_distanza">'+dist+'</span></div>'+
        '</div>'+
        '</div>'+
        '</li>';
		DBset("riga_attivita_"+id,result);
		return result;
	}
    
}







/*
 * ###########  EVENTI  ###########
 */

function eventi(result){
	jsonEventi=result;
	$("#tot_eventi").html(jsonEventi.length);
	
	//controllo che ogni evento abbia un'attività associata
	// sto controllo lo faccio qui perchè così l'eventuale alert
	// compre al lancio dell'app
	
	for( i in jsonEventi){
		daiCittaEvento(result[i].Nome_attivita)
	}
}

function creaEventi(result){
    
	if(!result)
		result=jsonEventi;
	$("#fragment_eventi").html("<li class='sep'  id='sep_eve' style='text-align:center; color:#c07d00'>"+i18n('Eventi')+" <span id='sep_eventi' style='font-size:12px; color:#fff'></span></li>")
    
    
    
	if(countEventiPerCitta.length!=0){
		countEventiPerCitta=new Array();
		countEventiPerCategoria=new Array();
	}
    
    
	for(var i=0; i<result.length;i++){	
		if(result[i].Pubblica=="si"){
			var r=result[i];
			var id=picasaAlbumName(r.Nome_evento);
			var citta_evento=daiCittaEvento(r.Nome_attivita);
			var lat=daiLatLonEvento(r.Nome_attivita)[0];
			var lon=daiLatLonEvento(r.Nome_attivita)[1];
			
			result[i]['id'] = id;  // aggiungo a jsonEventi l'id dell'evento
			
			var riga = $(daiRigaEvento(r));
            
			result[i]['distanza'] = 99999999;
			result[i]['Citta'] = citta_evento; // aggiungo al jsonEventi la città
			result[i]['obj'] = riga;  // aggiungo al jsonEventi il riferimento all'oggetto html riga
			result[i]['Lat'] = lat
			result[i]['Lon'] = lon
			
			$("#fragment_eventi").append(riga)
			countEventiPerCitta.push(citta_evento);
			countEventiPerCategoria.push(r.Categoria);
			arrCategorie,arrCitta=new Array();
			arrCategorie.push(r.Categoria);
			arrCitta.push(r.Citta);
		}
		
	}
	
	
	jsonEventi=result;	
	
	$("#fragment_eventi").append("<div class='clearDiv'></div>")
	
	
    
	arrCategorie=uniqueArr(arrCategorie)
    
	var dove=$("#page_categorie > div > ul")
	dove.html("");
	for(var i=0;i<arrCategorie.length;i++){
		dove.append(daiRigaCategorie(arrCategorie[i]));
	}
	
	
    
    
	function daiRigaCategorie(nome){
		return '<li class="arrow riga_categoria" data-categoria="'+nome+'"  style="height:60px">'+
        '<div>'+
        '<div style="float:left; width:57px; margin:7px 3px 0px 5px"><img src="img/categorie_icon.png" /></div>'+
        '<div style="float:left; width:70%; font-size:14px">'+
        '<div><font style="color:#fff;font-size:17px">'+i18n(nome)+'</font></div>'+
        '<div style="margin-top:2px" class="count_att">'+i18n("Attività")+': <span class="arancio"></span></div>'+
        '<div style="margin-top:0" class="count_eve">'+i18n("Eventi")+': <span class="arancio"></span></div>'+
        '</div>'+
        '</div>'+
        '</li>';
        
	}
	
	function daiRigaEvento(r){
		var nome=r.Nome_evento;
		if(appML.getEnviroment().isIDevice && !appML.getEnviroment().isIPad )
			nome=tronca(nome,28);
		var id=picasaAlbumName(nome);
        
		if(DBget("riga_evento_"+id)!=null && DBget("riga_evento_"+id)!="" ) // mettendo "" nei record local storage forzo il ricalcolo della riga in questione
			return DBget("riga_evento_"+id);
		
		var citta=daiCittaEvento(r.Nome_attivita);
		if(citta==null){
			return false;
		}
		var categoria=r.Categoria;
		var dist="";
		if(r.distanza && r.distanza!=99999999) {
			var d=(r.distanza.toFixed(2)).replace(".",",")
			dist=d +" <font style='font-size:9px'>Km</font>";
		}
        
		var result = '<li class="arrow riga_evento" data-id-evento="'+id+'"  data-id-citta="'+getPicasaAlbumName(citta)+'" data-id-categoria="'+getPicasaAlbumName(categoria)+'" data-nome-evento="'+nome+'" data-citta="'+citta+'" data-attivita-evento="'+r.Nome_attivita+'" data-categoria="'+categoria+'" data-descrizione="'+r.Descrizione+'" data-data="'+r.Data+'" data-orario="'+r.Orario+'" data-cell="'+r.Cell+'" data-tell="'+r.Tell+'" data-email="'+r.Email+'" data-tags="'+r.Tag+'" >'+
        '<div>'+
        '<div style="float:left; width:57px; margin:4px 3px 0px 5px" class="thumb thumb_eventi" data-picasa-id='+id+'><img src="img/thumb_loading.png" class="thumb_loading_image" /></div>'+
        
        
        //'<div style="float:left; width:37px; margin:0px 3px 0px 2px" class="thumb thumb_eventi" data-picasa-id="'+id+'">'+
        //'<div class="'+getPicasaAlbumName(categoria).toLowerCase()+'"/>'+
        //'</div>'+
        '<div class="dati_riga" >'+
        '<div><div style="color:#fff">'+nome+'</div></div>'+
        '<div class="label_categoria"  style="margin-top:-1px">'+i18n("Categoria").substr(0,5)+'.: <span class="arancio">'+categoria.capitalize()+'</span></div>'+
        '<div class="label_categoria" style="margin-top:-1px">'+i18n("Città")+'.: <span class="arancio">'+citta.capitalize()+'</span></div>'+
        '<div style="margin:-26px -10px 0px 0px; font-size:14px; float:right"><span class="arancio" id="span_distanza">'+dist+'</span></div>'+
        '</div>'+
        '</div>'+
        '</li>';
        
		
		DBset("riga_evento_"+id,result);  
		return result;
        
	}
    
}


function animaCarouselDettaglio(){
    setTimeout(function(){
               if($("#foto_attivita").is(":visible")){
               if($("#foto_attivita li").size()==1)
               return false;
               if( !$("#foto_attivita").parent().parent().is(".carousel_container"))
               appML.makeCarousel("#foto_attivita","console.log('fatto carousel_att!')", ( appML.getEnviroment().isIPad ) ? 520 : 280 , ( appML.getEnviroment().isIPad ) ? 320 : 190 );
               else
               appML.refreshCarousel("#foto_attivita","console.log('RIfatto carousel_att!')");
               }
               else{
               if($("#foto_evento li").size()==1)
               return false;
               if( !$("#foto_evento").parent().parent().is(".carousel_container"))
               appML.makeCarousel("#foto_evento","console.log('fatto carousel_eve!')", ( appML.getEnviroment().isIPad ) ? 520 : 280 , ( appML.getEnviroment().isIPad ) ? 320 : 190 );
               else
               appML.refreshCarousel("#foto_evento","console.log('RIfatto carousel_eve!')");
               }		
               },1000)
}

function iconeMacrocategorie(result){
	
	$("<style type='text/css' id='inLineIconsStyle' />").appendTo("head");
	var target=$("#inLineIconsStyle")
	
	for(i in result){
		result[i]["Categorie"]=result[i].Categorie.split(',');
	}
	
	for(i in result){
		var css_rule="";
		for(j in result[i].Categorie){
			css_rule +="."+getPicasaAlbumName(result[i].Categorie[j]).toLowerCase();
			if(j!=result[i].Categorie.length-1)
				css_rule+=","
                }
		target.append(css_rule+"{ background: url(data:image/gif;base64,"+result[i].Base64img+"); width:65px; height:65px; border:none; margin:0px }");
	}
	
}


















