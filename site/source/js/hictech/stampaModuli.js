			var JSONattivita,JSONeventi;
			
			
			var visibilita_pag_attivita=false;
			var visivilita_pag_eventi=false;
			
			
			
			function mostra(caso){
				
				if(caso=="download"){
					visibilita_pag_attivita=false;
					visivilita_pag_eventi=false;
					//$("#page-content-attivita").slideDown();
					$("#my_posts_type_widget,#container_tasti_home").hide();
					
					$("#slider-wrapper,#home-content,#home,#top-content").slideUp("slow", function(){
						$(".backButton,#page_download").slideDown();	
					});	
	 		
				}
				
				
				if(caso=="attivita"){
					visibilita_pag_attivita=true;
					$("#page-content-attivita").slideDown();
					$("#my_posts_type_widget,#container_tasti_home").hide();
					$("#slider-wrapper,#home-content,#home,#top-content").slideUp("slow", function(){
						$(".backButton,#page_navigator_attivita, .desc_nav_attivita").slideDown();
						
					});	
	 		
				}
				if(caso=="eventi"){
					visivilita_pag_eventi=true;
					$("#page-content-eventi").slideDown();
					$("#my_posts_type_widget,#container_tasti_home").hide();
					$("#slider-wrapper,#home-content,#home,#top-content").slideUp("slow", function(){
						$(".backButton,#page_navigator_eventi, .desc_nav_eventi").slideDown();
						
					});		
				}
				
				$(".thumb_image").lazyload();

			}
			
			function chiudi(){
				$("#container_tasti_home").show();
				$("#page_download").hide();
				if(visibilita_pag_attivita){
					visibilita_pag_attivita=false;
					$("#parametri_di_ricerca_impostati_attivita").html("");
					$("#parametri_di_ricerca_impostati_eventi").html("")
					$("#map_container_attivita,.desc_nav_attivita").hide();
					$("#home-content,#slider-wrapper,#top-content,#home").slideDown();
					$(".backButton,#page-content-attivita").slideUp(function(){
						$("#my_posts_type_widget").fadeIn();
						$("#page_navigator_attivita").hide();
						$("#menu-item-tutte-citta_attivita").trigger("click");
					});
				}
				else{
					visivilita_pag_eventi=false;
					$("#parametri_di_ricerca_impostati_attivita").html("");
					$("#parametri_di_ricerca_impostati_eventi").html("")
					$("#map_container_eventi,.desc_nav_eventi").hide();
					$("#home-content,#slider-wrapper,#top-content,#home").slideDown();
					$(".backButton,#page-content-eventi").slideUp(function(){
						$("#my_posts_type_widget").fadeIn();
						$("#page_navigator_eventi").hide();
						$("#menu-item-tutte-citta_eventi").trigger("click");
					});
				}

			}

			/*
	  		**********************************
	  		ATTIVITA'
	  		__________________________________
	  		*/

			
			var jsonPrimeAttivita;
			function primeAttivita(result){
				jsonPrimeAttivita=result;
				
			}
			
			
			function attivita(result){
				JSONattivita = jsonPrimeAttivita.concat(result);
				creaAttivita(JSONattivita);
				//$("#tot_attivita").html(jsonAttivita.length);
				//alert(jlinq.from(jsonAttivita).equals("Citta", "Viareggio").select()[1].Tag);
				var arrPresenze=new Array();
							
			}
			
			function attivitaGiaPresente(att){
				for(i in arr_attivita_inserite){
					if(att==arr_attivita_inserite[i]){
						return true;
					}
						
				}
				return false
			}
			
			var arr_attivita_inserite=new Array();
			
			function creaAttivita(result){
				JSONattivita=result;
				var tot_attivita=0;
				var arrCategorie=new Array();
				var arrCitta=new Array();
				for(var i=0; i<result.length;i++){
					if(result[i].Pubblica=="si"){
						
						if(attivitaGiaPresente(result[i].Nome)){
							console.log("_____NOTA______L'attività "+result[i].Nome+" è stata inserita due o più volte");
						}
						arr_attivita_inserite.push(result[i].Nome)
							
						tot_attivita++;
						var html=$(singolaAttivita(result[i].Nome,result[i].Categoria,result[i].Citta,result[i].Indirizzo,result[i].Descrizione,result[i].Email,result[i].Tell,result[i].Cell,result[i].Sito,result[i].Tag.replace(/, /g, ' '),result[i].Lat,result[i].Lon,result[i].facebook,result[i].twitter,result[i].youtube));
						result[i]["obj"]=$(html);
						result[i]['Tag'] =  result[i]['Tag'].replace(/;/g, "").replace(/ ,/g, ",").replace(/ , /g, ",").replace(/, /g, ",").replace(/ /g, ",")
						pushaPuntoSuMappaAttivita(result[i].Nome,result[i].Categoria,result[i].Indirizzo,result[i].Citta,result[i].Tell,result[i].Cell,result[i].Sito,result[i].Lat,result[i].Lon)
						
						
						
						arrCategorie.push(result[i].Categoria);
						arrCitta.push(result[i].Citta);
						var nomeAlbumPicasa=picasaAlbumName(result[i].Nome);
						var foto=html.find(".thumb_attivita");
						
						
						
				        
				        $(html).find("a").click(function(e){
			        		e.stopPropagation();
			        		
			        		if($(this).attr("rel") == "bookmark"){
				        			return false;
				        		}
			        		
			        		if($(this).attr("class") == "button button_mappa_singolo"){
			        			var id= $(this).attr("data-id");
			        			var nome= $(this).attr("data-nome");
			        			$(".box_attivita").hide();
			        			$("#box_attivita_"+id).show();
			        			if($("#map_container_attivita").is(":visible")){
			        				updateMapAttivita();
			        			}
			        			else{
			        				$("#map_container_attivita").slideDown();
			        				updateMapAttivita();
			        				
			        			}
			        			
			        			aggiornaParametriDiRicercaImpostatiAttivita("Attività: "+nome);
			        			aggiornaTotaleRisultatiDiRicercaAttivita(1);
			        			return false;
			        		}
			        		
			        		

			        		
			        		if($(this).attr("class") != "button button_mappa_attivita"){
			        			if($(this).attr("data-href").indexOf("mailto")!=-1){
			        				location.href=$(this).attr("data-href");
			        			}
			        			else{
			        				window.open($(this).attr("data-href"));
			        			}
			        		}
				        })
				        
				        $(html).click(function(){
				        	mostraDettaglioAttivita($(this))
				        })
				        
				        
						$("#page-content-attivita").append(html);

					}
				}
				
				

				
				pageNavigatorAttivitaCategoria(uniqueArr(arrCategorie));
				pageNavigatorAttivitaCitta(uniqueArr(arrCitta));
				
				
				$(".tasto_att_categoria").sortElements(function(a, b){
                    return $(a).text() > $(b).text() ? 1 : -1;
                });
                
				
				$(".button_attivita").sortElements(function(a, b){
                    return $(a).text() > $(b).text() ? 1 : -1;
                });
                
                	$(".tasto_att_citta").sortElements(function(a, b){
                    return $(a).text() > $(b).text() ? 1 : -1;
                });
	                
				
				
			
 				
				$('#map_attivita').jMapping({
				    category_icon_options: function(category){
						return new google.maps.MarkerImage('source/css/images/attivita.png');				      
					},
					side_bar_selector: '#map-locationsATTIVITA:first',
				});
				  
				
 				aggiornaTotaleRisultatiDiRicercaAttivita(tot_attivita);
				
				//tasto mappa singola attività
				$(".button_mappa_attivita").click(function(){
					var box_attivita=$(this).parent().parent().parent().parent().parent();
					var nome_attivita= box_attivita.attr("id").replace("box_attivita_" , "");
					//$(".box_attivita").show()
					aggiornaParametriDiRicercaImpostatiAttivita("nome attività: "+nome_attivita);
					box_attivita.show();
					updateMapAttivita();
					$("#map_container_attivita").show();
					aggiornaTotaleRisultatiDiRicercaAttivita()		
					
				});
				
				$(".eventi_attivita_container").hover(
					  function () {
					    $(this).animate({
					    	left:"550px"
					    },50,function(){ $(this).find(".lista_eventi_attivita").slideDown();$(this).find("font").hide()});
					  }, 
					  function () {
					  	
					  	$(this).find(".lista_eventi_attivita").slideUp();
					  	$(this).find("font").show()
					  	
					     $(this).animate({
					    	left:"675px"
					    },50);
					  });
				
				

	
			}
			

			
			function singolaAttivita(nome,categoria,citta,indirizzo,descrizione,email,tell,cell,sito,tags,lat,lon,fb,tw,yt){
				var id=picasaAlbumName(nome)
				var html='<div class="container clearfix box_attivita" id="box_attivita_'+id+'" data-nome="'+nome+'"  data-categoria="'+categoria+'" data-citta="'+citta+'" data-tags="'+tags+'" >'+
							'<div class="label_box coloreAttivita">Attività</div>'+
			              	'<div  class="grid_4" style="width:700px; float:left; margin:0px 0px 20px 0px">'+
			              	'<div style="position:absolute; top:21px; left:530px">';
			              			if(yt!="non presente") html+='<a data-href="http://'+yt+'" ><img src="source/css/images/youtube.png" width="25px"></a>';
			              			if(fb!="non presente") html+='<a data-href="http://'+fb+'" ><img src="source/css/images/facebook.png" width="25px" style="margin:0px 5px 0px 5px"></a>';
			              			if(tw!="non presente") html+='<a data-href="http://'+tw+'" ><img src="source/css/images/twitter.png" width="25px"></a>';
			              html+='</div>'+
			              		
			              		'<span style="display:none" data-lat="'+lat+'" data-lon="'+lon+'"></span>'+                
			              		'<h2 style="margin:0px 0px 6px 0px; font-size:30px">'+nome+'</h2>'+						
								'<ul class="latestpost">'+
									'<li>'+
										'<h4>Categoria: <a  rel="bookmark" >'+categoria+'</a></h4>'+
										'<h4>Città: <a  rel="bookmark" class="citta" >'+citta+'</a></h4>';
										
		              					if(tell!="non presente") html+='<h4>Recapiti: <a  rel="bookmark" >'+tell+'</a></h4>';
		              					if(cell!="non presente") html+='<h4>Recapiti: <a  rel="bookmark" >'+cell+'</a></h4>';
										
										html+='<h4>Indirizzo: <a  rel="bookmark" >'+indirizzo+'</a></h4><div style="width:645px">'+descrizione+'</div>'+
			              				
			              				'<div style="margin:8px 0px 0px 0px">'+
			              					'<a title="" rel="" data-id="'+id+'"  data-nome="'+nome+'" class="button button_mappa_singolo">Come raggiungerci</a>';
			              					if(email!="non presente") html+='<a data-href="mailto:'+email+'" title="" rel="" class="button">E-mail</a>';
			              					if(sito!="non presente") html+='<a data-href="http://'+sito+'"  title="" rel="" class="button">Sito</a>';
			              					//'<a href="http://www.hictech.com" target="_blanck" title="" rel="" class="button">Eventi</a> '+
			              		html+='</div>'+								
			              			'</li>'+
								'</ul>'+
							 '</div>'+
							 '<div style="width:210px; float:left;margin:20px -30px 0px -10px"><div class="eventi_attivita_container" style="position:absolute;background-color:#444;padding:5px;width:210px; height:180px;border-radius: 5px; left:675px">'+
							 	'<div style="-webkit-transform: rotate(-90deg); -moz-transform: rotate(-90deg);position:absolute;top:84px"><font style="font-family: Lobster;color: #7dd2e7; font-size:20px"> Eventi </font></div>'+
							 	'<div id="eventi_attivita_'+id+'" class="lista_eventi_attivita" style="display:none; margin-top:5px"></div>'+
							 '</div>'+
							 	
							 '</div>'+
							 '<div style="float:left;"><div style="position:absolute; margin:0px 20px 20px -170px"><div  class="thumb_attivita" ><div style="position:absolute;z-index:5"><img data-nomeAlbum="Att'+id+'" class="thumb_image" src="source/css/images/loading_photos.gif"></div></div>'+
							 '<div><img src="source/css/images/photo_filter.png" style="position:absolute; z-index:20; top:39px; left:33px"></div></div></div>'+
			           	'</div>';
				return html;
				
				
			
				
				
				
			}
			
			
			function pageNavigatorAttivitaCategoria(arr){
				$.each(arr,function(index,value){
					var html_tasto='<li id="menu-item-"'+index+'><a class="tasto_att_categoria">'+value.toLowerCase()+'</a></li>';
					var html_tasto_home='<a class="button_home button_attivita att_cat_home">'+value.toLowerCase()+'</a>';
					
					var tasto=$(html_tasto).click(function(){
												var cat=$(this).find("a").html();
												
												$(".box_attivita").hide();
												$(".box_attivita").each(function(){
													
													if($(this).attr("data-categoria").toLowerCase()==cat.toLowerCase())
														$(this).show();
												});
												setTimeout(function(){
													updateMapAttivita()
													aggiornaTotaleRisultatiDiRicercaAttivita();
													aggiornaParametriDiRicercaImpostatiAttivita("Categoria: "+cat)
												},400);
												
											});
					
					var tasto_home=$(html_tasto_home).click(function(){
						var categoria_selez=$(this).html().toLowerCase();
						mostra("attivita");
						$(".tasto_att_categoria").each(function(){
							if(categoria_selez==$(this).html().toLowerCase())
								$(this).trigger("click")
						})
					})
					$("#categoria_navigator_attivita").append(tasto);
					$("#tasti_categorie_home").append(tasto_home);
					
					
				
	           		
	              
					
				});
				

				
				var html_tasto_tutte='<li id="menu-item-tutte-categorie_attivita"><a  style="text-align:center; color:#eb8346">TUTTE</a></li>';
				var tasto_tutte=$(html_tasto_tutte).click(function(){
													$(".box_attivita").show();
													setTimeout(function(){
														updateMapAttivita()
														aggiornaTotaleRisultatiDiRicercaAttivita();
														aggiornaParametriDiRicercaImpostatiAttivita("tutte")
													},700);					
												});
				$("#categoria_navigator_attivita").append(tasto_tutte);
			}
			
			
			
			
			function pageNavigatorAttivitaCitta(arr){
				$.each(arr,function(index,value){
					var html_tasto='<li id="menu-item-"'+index+'><a class="tasto_att_citta">'+value.toLowerCase()+'</a></li>';
					var html_tasto_home='<a class="button_home button_attivita att_cit_home" >'+value.toLowerCase()+'</a>';
					
					var tasto=$(html_tasto).click(function(){
													var citta=$(this).find("a").html();
													$(".box_attivita").hide();
													$(".box_attivita").each(function(){
														if($(this).attr("data-citta").toLowerCase()==citta.toLowerCase())
															$(this).show();
													});
													setTimeout(function(){
														updateMapAttivita()
														aggiornaTotaleRisultatiDiRicercaAttivita();
														aggiornaParametriDiRicercaImpostatiAttivita("Città: "+citta);
													},400);
													
											});
					var tasto_home=$(html_tasto_home).click(function(){
						var citta_selez=$(this).html().toLowerCase();
						mostra("attivita");
						$(".tasto_att_citta").each(function(){
							if(citta_selez==$(this).html().toLowerCase())
								$(this).trigger("click")
						})
					})
					$("#citta_navigator_attivita").append(tasto);
					$("#tasti_att_citta_home").append(tasto_home);
				});
				
				var html_tasto_tutte='<li id="menu-item-tutte-citta_attivita"><a  style="text-align:center; color:#eb8346">TUTTE</a></li>';
				var tasto_tutte=$(html_tasto_tutte).click(function(){
													$(".box_attivita").show();
													setTimeout(function(){
														updateMapAttivita()
														aggiornaTotaleRisultatiDiRicercaAttivita();
														aggiornaParametriDiRicercaImpostatiAttivita("tutte");
													},700);			
											});
				$("#citta_navigator_attivita").append(tasto_tutte);
				
				
			}
			
			var json_punti_mappa_att=new Array;
			function pushaPuntoSuMappaAttivita(nome,categoria,indirizzo,citta,tell,cell,sito,lat,lon){
				if(lon=="non presente" && lat=="non presente")
					return false;
				var categoria="'"+categoria+"'";
				id=picasaAlbumName(nome);
				
				
				var html='<div id="punto_attivita_'+id+'" class="map-location" data-jmapping="{id: '+Math.floor(Math.random()*10001)+', point: {lng: '+lon+', lat: '+lat+', category: '+categoria+'}}" >'+
						    '<a href="#" class="map-link">'+nome+'</a>'+
						    '<div class="info-box">'+
						      	'<p><h2 style="margin:0px 0px 6px 0px; font-size:20px">'+nome+'</h2></p>'+
						      	'<div><font style="color:#222; font-size:12px">Categoria: </font><a  rel="bookmark" >'+categoria+'</a></div>'+
								'<div><font style="color:#222; font-size:12px">Indirizzo: </font><a  rel="bookmark" >'+indirizzo+' '+citta+'</a></div>'+
						    '</div>'+
						  '</div>';
  
  
  
  				//$('#hidden_map-side-bar_attivita').append(html);
  				
  				json_punti_mappa_att.push({"nome":nome , "obj":$(html)})
  				
  				}
			
			
		function aggiornaTotaleRisultatiDiRicercaAttivita(tot){
			if(tot){
				$("#tot_attivita").html("( "+tot+" )");
				return;
			}
			
			var tot=0;
			$(".box_attivita").each(function(){
				if($(this).is(":visible"))
					tot++;
			});

			$("#tot_attivita").html("( "+tot+" )");
			
		}
		
		function aggiornaParametriDiRicercaImpostatiAttivita(tutte){
			var dove=$("#parametri_di_ricerca_impostati_attivita");
			if(tutte=="tutte")
				dove.html("tutte le Attività");
			else{
				dove.html("<div style='float:left'>"+tutte+"</div><div class='x_button' id='x_button_attivita'>x</div>");
				$("#x_button_attivita").click(function(){
					$("#menu-item-tutte-categorie_attivita").trigger("click")
					$("#input_cerca_attivita").val("")
				})
			}
				
				
		}
			
		
		function cercaAttivita(){
			
			var parole_da_ricercare=$("#input_cerca_attivita").val();
				
				if(parole_da_ricercare.length<3){
					alert("La parola da ricercare deve essere non inferiore ai 3 caratteri!");
					return;
				}
				if(parole_da_ricercare.indexOf("  ")!=-1){
					alert("Attenzione il testo inserito contiene due o più spazi consecutivi");
					$("#input_cerca_attivita").val("");
					return;
				}
				
				
				$(".box_attivita").hide();
				parole_da_ricercare=parole_da_ricercare.toLowerCase();
				var a1 = new Array();
				a1=parole_da_ricercare.split(" ");
			
			
			$(".box_attivita").each(function(){
				var e=$(this);
				parole=e.attr("data-nome").toLowerCase()+","+e.attr("data-categoria").toLowerCase()+","+e.attr("data-citta").toLowerCase()+","+e.attr("data-tags").toLowerCase()+","+e.attr("id").replace("box_attivita_","").toLowerCase();
				
				if(e.attr("data-nome").toLowerCase() == parole_da_ricercare.toLowerCase()){
					$(".box_attivita").hide();
					e.show();
					return false;
				}
					
				var a2 = new Array();
				a2=parole.split(",");
				for(var i=0;i<a2.length;i++){
					for(var j=0;j<a1.length;j++){
						//alert("confronto "+a2[i]+" con "+a1[j]+" confronti "+ a2[i].indexOf(a1[j])+" "+a1[j].indexOf(a2[i]))
						if((a2[i].indexOf(a1[j])!=-1 || a1[j].indexOf(a2[i])!=-1) && a2[i]!=""){	
							//console.log("ecco "+ a2[i]+ " - "+ a1[j]+" oppure "+ a1[j]+" - "+ a2[i]  )
							e.show();
						}
					}
				}
				
			});
			aggiornaTotaleRisultatiDiRicercaAttivita();
			aggiornaParametriDiRicercaImpostatiAttivita("ricerca parole: "+parole_da_ricercare);
			updateMapAttivita();

				
		}
		
		
		function mostraDettaglioAttivita(el){
			var nomeAlbumPicasa="Att"+el.attr("id").replace("box_attivita_","");
			if(!$(".overlay").is(":visible")){
				$(".overlay").slideDown(function(){
				
				var clonedEl=el.clone();
				
				clonedEl.find(".eventi_attivita_container").remove();
				clonedEl.find(".button_mappa_attivita").remove();
				clonedEl.find(".button_mappa_singolo").remove();
				
				clonedEl.find("img").remove();
				
				
				clonedEl.css({
					margin: "-100px auto"
				})
				
				.find(".label_box").click(function(){
					$(".overlay").slideUp(function(){
						$(this).html("");
					})
				})
				
				.html("chiudi").css({
					margin :"-5px 0px 0px -100px",
					color: "#222"
					});
				
				$(this).append(clonedEl);
				clonedEl.animate({
					width : "920px",
					marginTop : "20px",
					width: "750px",
					height: "555px",
					fontSize: "0.8em"
				})
				var $this=$(this);
				setTimeout(function(){
					$this.find(".thumb_attivita").parent().html("").pwi({
						username: commonsSettings.picasaUser,
						showSlideshowLink: false,
						showAlbumdate: false,
				        showAlbumPhotoCount: false,
				        showAlbumDescription: false,
				        showAlbumLocation: false,
						maxresults: 50,
						mode: 'album',
						album: nomeAlbumPicasa
					});
				},1500)
			});
			
			}
		}
		
	
			
			
			
			
			
			
			
			
			
			
			
			
			
			/*
	  		**********************************
	  		EVENTI
	  		__________________________________
	  		*/
			
			function eventi(result){
				JSONeventi=result;
				var tot_eventi=0;
				var arrCategorie=new Array();
				var arrCitta=new Array();
				for(var i=0; i<result.length;i++){
					if(result[i].Pubblica=="si"){
						tot_eventi++;
						var citta="";
						var lat="";
						var lon="";
						
						//pseudo query per recuperare citta, latitudine e longitudine dall'ATTIVITA' in cui si svolge l'EVENTO
						$("#page-content-attivita .grid_4").each(function(){
							if($(this).find("h2").html()==result[i].Nome_attivita){
								citta= $(this).find(".citta").html();
								lat =$(this).find("span").attr("data-lat");
								lon =$(this).find("span").attr("data-lon");
							}
						})
						
						var html=$(singoloEvento(result[i].Nome_evento,result[i].Nome_attivita,result[i].Data,result[i].Categoria,citta,result[i].Descrizione,result[i].Email,result[i].Tell,result[i].Cell,result[i].Tag.replace(/, /g, ' ')));
						result[i]["obj"]=$(html);
						result[i]['Tag'] =  result[i]['Tag'].replace(/;/g, "").replace(/ ,/g, ",").replace(/ , /g, ",").replace(/, /g, ",").replace(/ /g, ",")
						pushaPuntoSuMappaEventi(result[i].Nome_evento,result[i].Nome_attivita,result[i].Categoria,citta,result[i].Tell,result[i].Cell,lat,lon) 
						
						arrCategorie.push(result[i].Categoria);
						arrCitta.push(citta);
						
				        
				       
				        
				        $(html).find("a").click(function(e){
				        		e.stopPropagation();
				        		
				        		if($(this).attr("class") == "button button_mappa_singolo"){
				        			var id= $(this).attr("data-id");
				        			var nome= $(this).attr("data-nome");
				        			$(".box_evento").hide();
				        			$("#box_evento_"+id).show();
				        			if($("#map_container_eventi").is(":visible")){
				        				updateMapEventi();
				        			}
				        			else{
				        				$("#map_container_eventi").slideDown();
				        				updateMapEventi();
				        				
				        			}
				        			
				        			aggiornaParametriDiRicercaImpostatiEventi("Evento: "+nome);
				        			aggiornaTotaleRisultatiDiRicercaEventi(1);
				        			return false;
				        		}
				        		
				        		
				        		
				        		if($(this).attr("class") == "link_attivita"){
				        			mostraDettaglioAttivita($("#box_attivita_"+$(this).attr("data-link-attivita")));
				        		}
				        		
				        		if( $(this).attr("data-href") && $(this).attr("class") != "button button_mappa_evento"){
				        			if($(this).attr("data-href").indexOf("mailto")!=-1){
				        				location.href=$(this).attr("data-href");
				        			}
				        			else{
				        				window.open($(this).attr("data-href"));
				        			}
				        		}
				        			
				        			
				        	})
				         $(html).click(function(){
				        	mostraDettaglioEvento($(this))
				        })
				        
				        
				        
						$("#page-content-eventi").append(html);
					}
					
				}
				
	               
				pageNavigatorEventoCategoria(uniqueArr(arrCategorie));
				pageNavigatorEventiCitta(uniqueArr(arrCitta));
				
				
				$(".tasto_eve_citta").sortElements(function(a, b){
                    return $(a).text() > $(b).text() ? 1 : -1;
                });
           		$(".tasto_eve_categoria").sortElements(function(a, b){
                    return $(a).text() > $(b).text() ? 1 : -1;
              	}); 
            	$(".button_eventi").sortElements(function(a, b){
                    return $(a).text() > $(b).text() ? 1 : -1;
                });


				 				
				$('#map_eventi').jMapping({
				    category_icon_options: function(category){
						return new google.maps.MarkerImage('source/css/images/evento.png');				      
					},
					side_bar_selector: '#map-locationsEVENTI:first',
				});
				
				
 				aggiornaTotaleRisultatiDiRicercaEventi(tot_eventi);
				
				//tasto mappa singolo evento
				$(".button_mappa_evento").click(function(){
					var box_evento=$(this).parent().parent().parent().parent().parent();
					var nome_evento= box_evento.attr("id").replace("box_evento_" , "");
					aggiornaParametriDiRicercaImpostatiEventi("nome evento: "+nome_evento);
					box_evento.show();
					updateMapEventi();
					$("#map_container_eventi").show();
					aggiornaTotaleRisultatiDiRicercaEventi();
					
					
				});
				
			
				

	
			}

			
			function pageNavigatorEventoCategoria(arr){
				$.each(arr,function(index,value){
					var html_tasto='<li id="menu-item-evento"'+index+'><a class="tasto_eve_categoria">'+value.toLowerCase()+'</a></li>';
					var html_tasto_home='<a class="button_home button_eventi eve_cat_home">'+value.toLowerCase()+'</a>';
					
					var tasto=$(html_tasto).click(function(){
												var cat=$(this).find("a").html();
												$(".box_evento").hide();
												$(".box_evento").each(function(){
													if($(this).attr("data-categoria").toLowerCase()==cat.toLowerCase())
														$(this).show();
												});
												setTimeout(function(){
													updateMapEventi()
													aggiornaTotaleRisultatiDiRicercaEventi();
													aggiornaParametriDiRicercaImpostatiEventi("Categoria: "+cat)
												},700);
												
											});
											
					var tasto_home=$(html_tasto_home).click(function(){
						var catt_selez=$(this).html().toLowerCase();
						mostra("eventi");
						$(".tasto_eve_categoria").each(function(){
							if(catt_selez==$(this).html().toLowerCase())
								$(this).trigger("click")
						})
					})
					
											
					
					$("#categoria_navigator_eventi").append(tasto);
					$("#tasti_eve_categoria_home").append(tasto_home);
				});
				
				var html_tasto_tutte='<li id="menu-item-tutte-categorie_eventi"><a  style="text-align:center; color:#eb8346">TUTTE</a></li>';
				var tasto_tutte=$(html_tasto_tutte).click(function(){
													$(".box_evento").show();
													setTimeout(function(){
														updateMapEventi()
														aggiornaTotaleRisultatiDiRicercaEventi();
														aggiornaParametriDiRicercaImpostatiEventi("tutte")
													},700);					
												});
				$("#categoria_navigator_eventi").append(tasto_tutte);
			}
			
			
			function pageNavigatorEventiCitta(arr){
				$.each(arr,function(index,value){
					var html_tasto='<li id="menu-item-evento"'+index+'><a class="tasto_eve_citta" >'+value.toLowerCase()+'</a></li>';
					var html_tasto_home='<a class="button_home button_eventi eve_cit_home">'+value.toLowerCase()+'</a>';
					
					var tasto=$(html_tasto).click(function(){
													var citta=$(this).find("a").html();
													$(".box_evento").hide();
													$(".box_evento").each(function(){
														if($(this).attr("data-citta").toLowerCase()==citta.toLowerCase())
															$(this).show();
													});
													setTimeout(function(){
														updateMapEventi()
														aggiornaTotaleRisultatiDiRicercaEventi();
														aggiornaParametriDiRicercaImpostatiEventi("Città: "+citta);
													},700);
													
											});
					
					
					
					
					var tasto_home=$(html_tasto_home).click(function(){
						var citta_selez=$(this).html().toLowerCase();
						mostra("eventi");
						$(".tasto_eve_citta").each(function(){
							if(citta_selez==$(this).html().toLowerCase())
								$(this).trigger("click")
						})
					})
					
					
					
					
					$("#citta_navigator_eventi").append(tasto);
					$("#tasti_citta_home").append(tasto_home);
					
					
					
					
					
				});
				
				var html_tasto_tutte='<li id="menu-item-tutte-citta_eventi"><a  style="text-align:center; color:#eb8346">TUTTE</a></li>';
				var tasto_tutte=$(html_tasto_tutte).click(function(){
													$(".box_evento").show();
													setTimeout(function(){
														updateMapEventi()
														aggiornaTotaleRisultatiDiRicercaEventi();
														aggiornaParametriDiRicercaImpostatiEventi("tutte");
													},700);		
											});
				$("#citta_navigator_eventi").append(tasto_tutte);
				
			}
			

			
			function singoloEvento(nome,nome_attivita,data,categoria,citta,descrizione,email,tell,cell,tags){
				var id=picasaAlbumName(nome)
				var id_attivita=picasaAlbumName(nome_attivita);
				
				pompaListaEventiAttivita(id_attivita,id,nome,data);
				
				var html='<div class="container clearfix box_evento" id="box_evento_'+id+'" data-nome="'+nome+'" data-nome_attivita="'+nome_attivita+'"  data-categoria="'+categoria+'" data-citta="'+citta+'" data-tags="'+tags+'" >'+
							'<div class="label_box coloreEvento">Evento</div>'+
			              	'<div class="grid_4" style="width:700px; float:left; margin:0px 0px 20px 0px">'+                
			              		'<h2 style="margin:0px 0px 6px 0px; font-size:30px">'+nome+'</h2>'+						
								'<ul class="latestpost">'+
									'<li>'+
										'<h4>dove e quando: <a style="text-decoration:underline" class="link_attivita" data-link-attivita='+id_attivita+' >'+nome_attivita+' - '+data+'</a></h4>'+
										'<h4>categoria: <a>'+categoria+'</a></h4>';
										
										
										if(tell!="non presente") html+='<h4>Recapiti: <a  rel="bookmark" >'+tell+'</a></h4>';
		              					if(cell!="non presente") html+='<h4>Recapiti: <a  rel="bookmark" >'+cell+'</a></h4>';
		              					
		              					html+='<h4>città: <a>'+citta+'</a></h4>'+descrizione+
			              				
			              				'<div style="margin:8px 0px 0px 0px" class="buttons_evento">'+
			              					'<a title="" rel="" data-id="'+id+'" data-nome="'+nome+'" class="button button_mappa_singolo">Come raggiungerci</a>';
			              					if(email!="non presente") html+='<a data-href="mailto:'+email+'" title="" rel="" class="button">E-mail PR</a>';
			              					//if(sito!="non presente") html+='<a href="http://'+sito+'" target="_blanck" title="" rel="" class="button">Sito</a>';
			              					//'<a href="http://www.hictech.com" target="_blanck" title="" rel="" class="button">Eventi</a> '+
			              		html+='</div>'+								
			              			'</li>'+
								'</ul>'+
							 '</div>'+
							 '<div style="float:left"><div style="position:relative"><div style="position:absolute;background-image:url(source/css/images/no_photo.png);width: 210px;height: 210px;" class="thumb_evento"><div style="position:absolute;z-index:5"><img data-nomeAlbum="Eve'+id+'" class="thumb_image" src="source/css/images/loading_photos.gif"></div></div>'+
							 '<div style="background-color:#f00"><img src="source/css/images/photo_filter.png" style="position:absolute; top:39px; left:33px; z-index:20"></div></div></div>'+
			           	'</div>';
				return html;
			}
			
			var json_punti_mappa_eve=new Array;
			function pushaPuntoSuMappaEventi(nome,nome_attivita,categoria,citta,tell,cell,lat,lon){
				
				if(lon=="non presente" || lat=="non presente" || lon=="" || lat==""){
					console.log("___ATTENZIONE____: l'evento "+nome+" ha qualche problema nella sua localizzazione! controlla che a questo evento sia associata un'attività e che questa sia pubblica e abbia latitudine e longitudine")
					return false;
				}
					  
				var categoria="'"+categoria+"'";
				id=picasaAlbumName(nome);
				var html='<div id="punto_evento_'+id+'" class="map-location" data-jmapping="{id: '+Math.floor(Math.random()*10001)+', point: {lng: '+lon+', lat: '+lat+', category: '+categoria+'}}" >'+
						    '<a href="#" class="map-link">'+nome+'</a>'+
						    '<div class="info-box">'+
						      	'<p><h2 style="margin:0px 0px 6px 0px; font-size:20px">'+nome+'</h2></p>'+
						      	'<div><font style="color:#222; font-size:12px">Dove: </font><a  rel="bookmark" >'+nome_attivita+'</a></div>'+
						      	'<div><font style="color:#222; font-size:12px">Categoria: </font><a  rel="bookmark" >'+categoria+'</a></div>'+
								'<div><font style="color:#222; font-size:12px">Indirizzo: </font><a  rel="bookmark" >'+citta+'</a></div>'+
						    '</div>'+
						  '</div>';
  				json_punti_mappa_eve.push({"nome":nome , "obj":$(html)})
			}
			

			
			
			
			
			
			function aggiornaTotaleRisultatiDiRicercaEventi(tot){
				
				if(tot){
					$("#tot_eventi").html("( "+tot+" )");
					return;
				}
				
				var tot=0;
				$(".box_evento").each(function(){
					if($(this).is(":visible"))
						tot++;
				});

				$("#tot_eventi").html("( "+tot+" )");
				
			}
			
			function aggiornaParametriDiRicercaImpostatiEventi(tutte){
				var dove=$("#parametri_di_ricerca_impostati_eventi");
				if(tutte=="tutte")
					dove.html("tutte gli Eventi");
				else{
					dove.html("<div style='float:left'>"+tutte+"</div><div class='x_button' id='x_button_eventi'>x</div>");
					$("#x_button_eventi").click(function(){
						$("#menu-item-tutte-categorie_eventi").trigger("click")
						$("#input_cerca_eventi").val("")
					})
				}
					
					
			}
			
		function cercaEventi(){
			
			
			var parole_da_ricercare=$("#input_cerca_eventi").val();
				
				if(parole_da_ricercare.length<3){
					alert("La parola da ricercare deve essere non inferiore ai 3 caratteri!");
					return;
				}
				
				if(parole_da_ricercare.indexOf("  ")!=-1){
					alert("Attenzione il testo inserito contiene due o più spazi consecutivi");
					$("#input_cerca_eventi").val("");
					return;
				}
				
				
				$(".box_evento").hide();
				parole_da_ricercare=parole_da_ricercare.toLowerCase();
				var a1 = new Array();
				a1=parole_da_ricercare.split(" ");
			
			
			$(".box_evento").each(function(){
				var e=$(this);
				parole=e.attr("data-nome").toLowerCase()+","+e.attr("data-categoria").toLowerCase()+","+e.attr("data-nome_attivita").toLowerCase()+","+e.attr("data-citta").toLowerCase()+","+e.attr("data-tags").toLowerCase()+","+e.attr("id").replace("box_attivita_","").toLowerCase();
				
				if(e.attr("data-nome").toLowerCase() == parole_da_ricercare || e.attr("data-nome_attivita").toLowerCase() == parole_da_ricercare){
					$(".box_evento").hide();
					e.show();
					return false;
				}
				
				
				var a2 = new Array();
				a2=parole.split(",");
				for(var i=0;i<a2.length;i++){
					for(var j=0;j<a1.length;j++){
						//alert("confronto "+a2[i]+" con "+a1[j]+" confronti "+ a2[i].indexOf(a1[j])+" "+a1[j].indexOf(a2[i]))
						if((a2[i].indexOf(a1[j])!=-1 || a1[j].indexOf(a2[i])!=-1)){	
							e.show();
						}
					}
				}
				
			});
			aggiornaTotaleRisultatiDiRicercaEventi();
			aggiornaParametriDiRicercaImpostatiEventi("ricerca parole: "+parole_da_ricercare);
			updateMapEventi();

				
		}
		
		
		function mostraDettaglioEvento(el){
			var nomeAlbumPicasa="Eve"+el.attr("id").replace("box_evento_","");
			if(!$(".overlay").is(":visible")){
				$(".overlay").slideDown(function(){
				
				var clonedEl=el.clone();
				
				clonedEl.find(".button_mappa_evento").remove();
				clonedEl.find(".button_mappa_singolo").remove();
				clonedEl.css({
					margin: "-100px auto"
				}).find(".label_box").click(function(){
					$(".overlay").slideUp(function(){
						$(this).html("");
					})
				}).html("chiudi").css({
					margin :"-5px 0px 0px -100px",
					color: "#222"
					});
				
				$(this).append(clonedEl);
				clonedEl.animate({
					width : "920px",
					marginTop : "20px",
					width: "750px",
					height: "555px",
					fontSize: "0.8em"
				})
				.find(".thumb_evento").parent().html("").pwi({
					username: commonsSettings.picasaUser,
					showSlideshowLink: false,
					showAlbumdate: false,
			        showAlbumPhotoCount: false,
			        showAlbumDescription: false,
			        showAlbumLocation: false,
					maxresults: 50,
					mode: 'album',
					album: nomeAlbumPicasa
				});
			});
			
			}
		}
		
		function pompaListaEventiAttivita(id_attivita,id_evento,nome,data){
			
			
			var tasto=$("<div><div style='padding:5px 0px 0px 5px; margin:0px 0px -3px -3px'>"+data+"</div><div style='font-family: Lobster; font-size:18px;width:190px'><a class='coloreEvento'>"+nome+"</a></div></div>");
			
			tasto.click(function(e){
				        		e.stopPropagation();
				        		mostraDettaglioEvento($("#box_evento_"+id_evento))
				        	})
			
			$("#eventi_attivita_"+id_attivita).append(tasto);
		}
			
			
		function localizza(){
			
		}	
			
function iconeMacrocategorie(result){
	
	
}
			