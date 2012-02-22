

function componiHome(){
	var i=0;
	$.each (JSONeventi, function (index,v){
		if( v.Evidenza== "si" && i<5){
			i++
			$("#eventi_in_evidenza").append(daiSingoloEventoInEvidenza(v));
			var padding = parseInt($("#eventi_in_evidenza").css("padding-left").replace("px","")-77)+"px";
			$("#eventi_in_evidenza").css("padding-left",padding)
		}
	})
	
	$.each (JSONattivita, function (index,v){
		var i=0;
		if( v.Consigliato== "si" && i<3){
			i++;
			$("#attivita_consigliate").append(daiSingolaAttivitaInEvidenza(v));
		}
	})
	
	
	
	
    $(".link_home_evento").click(function(){
    	var id=$(this).attr("data-identifier");
    	$("#box_evento_"+id).trigger("click")
    })
    
     $(".link_home_attivita").click(function(){
    	var id=$(this).attr("data-identifier");
    	$("#box_attivita_"+id).trigger("click")
    })
     
     
    
}


function daiSingoloEventoInEvidenza(v){
	
	var d=v.Data;
	var g=d.substr(0,2).replace("0","")
	var m=daiNomeMese(d.substr(3,2))
	var a=d.substr(6,9);
	var nome_evento=v.Nome_evento;
	var nome_attivita=v.Nome_attivita;
	
	var id_tasto_evento=nome_evento.toGooglePicasaCamelCaseAlbumName();
	
	var id_tasto_attivita=nome_attivita.toGooglePicasaCamelCaseAlbumName()
	
	
	return '<li class="cat_post_item-1 clearfix">'+
    						'<span class="count">'+g+'</span>'+
			            	'<h2><a class="post-title">'+m+'</a></h2>'+
			            	'<div style="font-size:10px; margin:-15px 0px 0px 0px">'+a+'</div>'+
							'<div class="post_content">'+
								'<div><span class="link_home_evento" data-identifier='+id_tasto_evento+' style="cursor:pointer" >'+nome_evento+'</span><br></div>'+
								'<div><span class="link_home_attivita" data-identifier='+id_tasto_attivita+' style="cursor:pointer" >'+nome_attivita+'</span><br></div>'+
							'</div>'+
            				'</li>';

}


function daiSingolaAttivitaInEvidenza(v){
	var id_tasto_attivita=v.Nome.toGooglePicasaCamelCaseAlbumName()
	
	return '<li>'+
	           	'<h4 style="margin:0px 0px -3px 0px"><a  rel="bookmark" title=""><span data-identifier='+id_tasto_attivita+' class="link_home_attivita">'+v.Nome+'</span></a></h4>'+
				'<div class="post-info"><span>'+v.Descrizione+'</span></div>'+								
			'</li>';

}



