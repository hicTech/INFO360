//Adds new uniqueArr values to temp array
function uniqueArr(a) {
 temp = new Array();
 for(i=0;i<a.length;i++){
  if(!contains(temp, a[i])){
   temp.length+=1;
   temp[temp.length-1]=a[i];
  }
 }
 return temp;
}
 
//Will check for the Uniqueness
function contains(a, e) {
 for(j=0;j<a.length;j++)if(a[j]==e)return true;
 return false;
}


function occorrenzeArray(e,a){
	var n=0;
	for(i=0;i<a.length;i++){
		if(a[i]==e)
			n++;
	}
	return n;
}
function picasaAlbumName(str){

	var f=escape(str);
	if(f.substr(f.length-4)=="%20A")
		f=f.replace("%20A","");
	var s= f.replace(/%26/g,"").replace(/\./g,"").replace(/%E8/g,"e")
			.replace(/%E0/g,"a").replace(/%EC/g,"i").replace(/%F2/g,"o").replace(/%F9/g,"u").replace(/%E9/g,"e")
			.replace(/%20/g,"%20").replace(/%7C/g,"%20").replace(/%3E/g,"%20").replace(/%3C/g,"%20")
			.replace(/%3A/g,"%20").replace(/%3B/g,"%20").replace(/%3D/g,"%20").replace(/%5E/g,"%20").replace(/%27/g,"%20")
			.replace(/%21/g,"%20").replace(/%3F/g,"%20").replace(/%24/g,"%20").replace(/%A3/g,"%20").replace(/%27/g,"%20")
			.replace(/%25/g,"%20").replace(/%29/g,"%20").replace(/%28/g,"%20").replace(/%5D/g,"%20").replace(/%5B/g,"%20")
			.replace(/%7B/g,"%20").replace(/%7D/g,"%20")
			
		
	var temp = getPicasaAlbumName(unescape(s));
	var temp1= escape(temp).replace(/%20/g,"");
	var temp2= unescape(temp1)
	var fin= temp2.replace("*","").replace(/-/g,"").replace(/@/g,"").replace("/","").replace("+","")
	return fin;
}
function getPicasaAlbumName(str){
	
	String.prototype.toGooglePicasaCamelCaseAlbumName = function(){
		
		return this.replace(/(\ [A-Z,a-z])/g, function($1){
			
			return $1.toUpperCase().replace(' ','').charAt(0).toUpperCase() + $1.toUpperCase().replace(' ','').toGooglePicasaCamelCaseAlbumName().slice(1);
		});
	};
	
	return str.toGooglePicasaCamelCaseAlbumName();
	
	
}

function tronca(str,length){
        	if(str.length>length){
				return str.substr(0,length)+"...";
				}
			else return str;
        }

///traduce in nome album nel nome che google picasa usa nell'url degli album


function daiNomeMese(n){
	if(n==1)
		return "Gennaio"
	if(n==2)
		return "Febbario"
	if(n==3)
		return "Marzo"
	if(n==4)
		return "Aprile"
	if(n==5)
		return "Maggio"
	if(n==6)
		return "Giugno"
	if(n==7)
		return "Luglio"
	if(n==8)
		return "Agosto"
	if(n==9)
		return "Settembre"
	if(n==10)
		return "Ottobre"
	if(n==11)
		return "Novembre"
	if(n==12)
		return "Dicembre"
}


function daiJsonAttivita(json,nome){
	for(var i=0; i<json.length;i++){	
		if(json[i].Pubblica=="si" && json[i].Nome==nome){
			return json[i];
		}
	}
}



function daiCittaEvento(nome_attivita){
	for(var i=0; i<jsonAttivita.length;i++){	
		var r=jsonAttivita[i];
		if(r.Pubblica=="si" && r.Nome==nome_attivita){
			return r.Citta;
		}
		
	}
	console.log("__ATTENZIONE__ è stato inserito un evento per l'attività "+nome_attivita+" ma questa attività non esiste o ha 'no' nel campo 'label:Pubblica'");
	return null;
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function daiLatLonEvento(nome_attivita){
	for(var i=0; i<jsonAttivita.length;i++){	
		var r=jsonAttivita[i];
		if(r.Pubblica=="si" && r.Nome==nome_attivita){
			return [r.Lat,r.Lon];
		}
		
	}
}


var sortBy = function(field, reverse, primer){

   var key = function (x) {return primer ? primer(x[field]) : x[field]};

   return function (a,b) {
       var A = key(a), B = key(b);
       return ((A < B) ? -1 : (A > B) ? +1 : 0) * [-1,1][+!!reverse];                  
   }
}




/*
 * ORDINAMENTI
 * 
 */

function ordinaAttivita(key){
	creaAttivita(jsonAttivita.sort(sortBy(key, true, function(a){return a.toUpperCase()})))
}

function ordinaEventi(key){
	creaEventi(jsonEventi.sort(sortBy(key, true, function(a){return a.toUpperCase()})))
}

function ordinaAttivitaPerVicinanza(){
	creaAttivita(jlinq.from(jsonAttivita).sort("distanza").select());
}

function ordinaEventiPerVicinanza(){
	creaEventi(jlinq.from(jsonEventi).sort("distanza").select());
}



function daiAttivita(id){
	for( i in jsonAttivita){
		if(jsonAttivita[i].id==id)
			return jsonAttivita[i];
	}
}

function daiEvento(id){
	for( i in jsonEventi){
		if(jsonEventi[i].id==id)
			return jsonEventi[i];
	}
}



function daiObjAttivita(id){
	for( i in jsonAttivita){
		if(jsonAttivita[i].id==id)
			return jsonAttivita[i].obj;
	}
}

function daiObjEventi(id){
	for( i in daiObjEventi){
		if(jsonAttivita[i].id==id)
			return jsonAttivita[i].obj;
	}
}


function getBase64Image(img_path, successFunction) {
			var img=new Image();
			img.src=img_path;
			
			img.onload = function() {
			    var canvas = document.createElement("canvas");
			    canvas.width = img.width;
			    canvas.height = img.height;
			    var ctx = canvas.getContext("2d");
			    ctx.drawImage(img, 0, 0);
			    var dataURL = canvas.toDataURL();
			    if(!!successFunction)
			    	successFunction(dataURL)
		    }
		
		}