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


///traduce in nome album nel nome che google picasa usa nell'url degli album
String.prototype.toGooglePicasaCamelCaseAlbumName = function(){
	if(this.indexOf("-")!=-1){
			alert("attenzione il carattere '-' non è consentito nel nominare un album");
	}
		
	return this.replace(/(\ [A-Z,a-z])/g, function($1){
		return $1.toUpperCase().replace(' ','').charAt(0).toUpperCase() + $1.toUpperCase().replace(' ','').toGooglePicasaCamelCaseAlbumName().slice(1);
	});
};

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
}

function daiLatLonEvento(nome_attivita){

	for(var i=0; i<jsonAttivita.length;i++){	
		var r=jsonAttivita[i];
		if(r.Pubblica=="si" && r.Nome==nome_attivita){
			return [r.Lat,r.Lon];
		}
		
	}
}


