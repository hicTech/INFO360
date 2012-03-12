var userLang = (navigator.language) ? navigator.language : navigator.userLanguage; 
userLang=userLang.substr(0,2).toString();
var jSonLocalizzazione;

function localizza(result){
	jSonLocalizzazione=result;
	
}




function i18n(string){
	
	for(i in jSonLocalizzazione){
		if(jSonLocalizzazione[i].it.toLowerCase()==string.toLowerCase()){
			if(jSonLocalizzazione[i][userLang]!=stringa_valore_non_presente){
				if(jSonLocalizzazione[i][userLang]!=undefined)
					return jSonLocalizzazione[i][userLang];
				return jSonLocalizzazione[i]["en"]; // se la lingua del device non è compresa nel vocabolario traduce in inglese
			}
			return string;
		}
	}
	console.log("____________NOTA____________ La parola '"+string+"' non è presente nel vocabolario")
}


