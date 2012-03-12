var IEarr=new Array();



var localVarIdentifier;
var local_storage = Modernizr.localstorage;
var options = {
    live: true,
    cookie_ex_days: 50
}

function DBset(label, value) {

	
    if (local_storage) localStorage.setItem(label, value);
    else {
    	IEarr.push([label,value])
        /*var exdate = new Date();
        exdate.setDate(exdate.getDate() + options.cookie_ex_days);
        var c_value = value+ ((options.cookie_ex_days == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = label + "=" + c_value;*/
    }
}

function DBget(label) {
    if (local_storage) return localStorage.getItem(label);
    else {
    	for(var i=0;i<IEarr.length;i++){
    		if(IEarr[i][0]==label)
    			return IEarr[i][1];
    	}
        /*var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == label) {
            	alert("DBget :"+unescape(y))
                return unescape(y);
            }
        }*/
    }
}

function DBclear() {
    if (local_storage) localStorage.clear();
    else {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }
}

function DB(){
	if (local_storage) 
		return localStorage
	else
		return document.cookie;
}

function DBforce(label_da_forzare) {
    /*$("span[class^='DB']:visible , span[class^='DB']").livequery(function () {
        var span = $(this);
        var label = span.attr("class").replace("DB ", "");
        if (label_da_forzare == label) {
            if ($(this).html() != DBget(label)) $(this).html(DBget(label));
        }
    });*/
}


Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}




var carattere_valore_non_presente="###";
var stringa_valore_non_presente="non presente"















/*
 * CONF
 */


			var settings={
					includeNoPubblicLines: commonsSettings.includeNoPubblicLines, // if true includes line with label:Pubblica = "no"
					cache : commonsSettings.cache
			}




/*
 * CONF
 */





var no_cache_for_this_gdoc;

function getJsonGdocs(Gdoc_url, callback, no_cache){
	
		
	  no_cache_for_this_gdoc=no_cache;

	  
      var url_parameter = document.location.search.split(/\?url=/)[1]
      var url = url_parameter || Gdoc_url;
      var googleSpreadsheet = new GoogleSpreadsheet();
      googleSpreadsheet.url(url);
      
      	
      googleSpreadsheet.load(function(result) {
		
        var obj = JSON.parse(JSON.stringify(result).replace("/,/g",",\n")).data;
		 	obj= new Array(obj);
			obj=obj[0];
			
		var label= new Array();	
			
       	for(var i=0; i<obj.length;i++){
			if(obj[i].indexOf("label:")!=-1){
				label.push(obj[i].replace("label:",""))
			}
		}
		
		var periodo=label.length;
		var myJsonArray=new Array();
		
		
		
		var j=0;
		var riga=new Array();
		
		for(var i=0;i<obj.length;i++){
			
			if(j<periodo){
				riga.push(obj[i]);
				j++;
			}
			if(j==periodo){
				j=0;
				myJsonArray.push(riga);
				riga=new Array();
			}
			
		}
		
		
		/*
		 * VERIFICA PRESENZA SPAZI VUOTI NELL'EXCELL
		 */
		var csvLength=obj.length; //comma separated values
		if(csvLength%periodo!=0){
			console.log("__ATTENZIONE__ questo doc: \n\n"+ Gdoc_url+"\n\n contiene uno spazio vuoto \n\nvisita questo indirizzo");
			
		}
		
		
		
		
		var myStringJson="";
		var arrCategories=new Array();
		for(var i=1;i<myJsonArray.length;i++){
			var valore;
			var tupla="{";
			
			for(var j=0;j<myJsonArray[i].length;j++){
				
				
				valore=escape(myJsonArray[i][j]);
				
				//alert(valore)
				
				// gli a capo (escapato = "%0") rompono un pochetto per cui li
				// sostituisco con un normale spazio "%20"
				valore=valore.replace(/%0/g, "%20");
				
				// le doppie virgolette " (escapato = "%22") rompono un pochetto per cui li
				// sostituisco con una virgoletta singola \'
				valore=valore.replace(/%22/g, "\'");
				
				
				// se c'è una colonna label:Pubblica lui scarta dal json le righe con scritto "no",
				// in questa fase se trova "no" lui pompa nel json un "{}," qualche riga sotto 
				//elimino questi "{}," con un replace(regExp)
				if(!settings.includeNoPubblicLines){
					if(label[j]=="Pubblica" && valore=="no"){
						if(i==myJsonArray.length-1){
							tupla+="}";
							break;
						}
						else{
							tupla+="},";
							break;
						}
						
					}
				}
				
					
				// carattere_valore_non_presente = ### è la stringa che viene usata nell'excel per identificare un campo vuoto
				// a questo campo nel json viene associata la stringa "non presente"
				if(valore==escape(carattere_valore_non_presente))
					valore=stringa_valore_non_presente;
				if(j<periodo-1){
					if(j==0){
						if(unescape(valore)!="si" && unescape(valore)!="no" && unescape(valore)!="###"){
							if(deploy_mode){
								alert("some problems occurred! please try later");
								DBclear();
								self.location.reload();
							}
							else{
								console.log("__ATTENZIONE__ sembra esserci uno spazio vuoto a riga "+i+" è anche possibile che un valore della colonna pubblica sia diverso da 'si','no' o '###' ");
								alert("ERRORE - leggi in console")
							}
							
							
							return false
						}
					}
					tupla+='"'+label[j]+'":"'+unescape(valore)+'",';
				}
				else{
					if(i==myJsonArray.length-1)
						tupla+='"'+label[j]+'":"'+unescape(valore)+'"}';
					else
						tupla+='"'+label[j]+'":"'+unescape(valore)+'"},';
				}

				if(label[j]=="category"){
					var v=unescape(valore)
					if(notExist(arrCategories,v))
						arrCategories.push(v);
				}	
			}
			
			myStringJson+=tupla;
			tupla="";
		}
		
		
		// elimino tutti i "{}," che trovo
		myStringJson=myStringJson.replace(/{},/g, "").replace(/,{}/g, "");

		var myJSON = JSON.parse('{"dati": ['+myStringJson+']}');
		if(callback)
				callback.call(null,myJSON.dati);
		
      });
			
}





var GoogleSpreadsheet, GoogleUrl;




GoogleUrl = (function() {
  function GoogleUrl(sourceIdentifier) {
  	
    this.sourceIdentifier = sourceIdentifier;
    if (this.sourceIdentifier.match(/http(s)*:/)) {
      this.url = this.sourceIdentifier;
      try {
        this.key = this.url.match(/key=(.*?)&/)[1];
      } catch (error) {
        this.key = this.url.match(/(cells|list)\/(.*?)\//)[2];
      }
    } else {
      this.key = this.sourceIdentifier;
    }
    this.jsonCellsUrl = "http://spreadsheets.google.com/feeds/cells/" + this.key + "/od6/public/basic?alt=json-in-script";
    this.jsonListUrl = "http://spreadsheets.google.com/feeds/list/" + this.key + "/od6/public/basic?alt=json-in-script";
    this.jsonUrl = this.jsonCellsUrl;
  }
  return GoogleUrl;
})();


GoogleSpreadsheet = (function() {
	  	
  function GoogleSpreadsheet() {}
  GoogleSpreadsheet.prototype.load = function(callback) {
	
    var intervalId, jsonUrl, safetyCounter, url, waitUntilLoaded;
    url = this.googleUrl.jsonCellsUrl + "&callback=GoogleSpreadsheet.callbackCells";
   
    $('body').append("<script src='" + url + "'/>");
    $("head").append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;"/>')
   
    jsonUrl = this.jsonUrl;
    safetyCounter = 0;
    waitUntilLoaded = function() {
     
     if($("#server_connection_indicator").html()=="" || $("#server_connection_indicator").html()==null)
     	$("body").append("<div style='width:224px; margin:0px auto; padding-top:20px' id='server_connection_indicator'><img src='commons/img/contacting_server.png'></div>");
     
	  //console.log("Richiedo "+safetyCounter)
	  var result;
	  result=null;
	  result = GoogleSpreadsheet.find({
	    jsonUrl: jsonUrl
	  });
	  
	  	
		if(settings.cache && no_cache_for_this_gdoc==undefined){
			if(DBget(url)!=null){
		  	    clearInterval(intervalId);
		  	 	$("#server_connection_indicator").remove();
		  	 	var local_result=localStorage.getObject(url,result);
		  	 	safetyCounter=0;
		    	return callback(local_result);
			}
		
		}
	  	
	  
	  
	  
	  if(safetyCounter < 75){
	  	 if(result!=null && result.data!=null){
	  	 	clearInterval(intervalId);
	  	 	$("#server_connection_indicator").remove();
	  	 	localStorage.setObject(url,result);
	  	 	console.log("scaricato "+url)
	  	 	safetyCounter=0;
	    	return callback(result);
	    	
	  	 }
	  	 else
	  	 	safetyCounter++;
	  }
	  else{
	  		alert("Some connection problem occurred, let me try egain!");
	  		self.location.reload();
	  		clearInterval(intervalId);
	  		safetyCounter=0;
	  }
	  

	 
      	
    };
    
    
    intervalId = setInterval(waitUntilLoaded, 200);
    if (typeof result != "undefined" && result !== null) {
      return result;
    }
    
  };
  GoogleSpreadsheet.prototype.url = function(url) {
    return this.googleUrl(new GoogleUrl(url));
  };
  GoogleSpreadsheet.prototype.googleUrl = function(googleUrl) {
    if (typeof googleUrl === "string") {
      throw "Invalid url, expecting object not string";
    }
    this.url = googleUrl.url;
    this.key = googleUrl.key;
    this.jsonUrl = googleUrl.jsonUrl;
    return this.googleUrl = googleUrl;
  };
  GoogleSpreadsheet.prototype.save = function() { // hicTech customization: localStorage was wrapped in a cross platform version on this function
  	
  	var hicId=this.jsonUrl.substr(43,44);

  	localVarIdentifier=hicId+"GoogleSpreadsheet";
  	DBset(localVarIdentifier,JSON.stringify(this))
    return DBget(localVarIdentifier);
    
    
  };
  return GoogleSpreadsheet;
  })();
GoogleSpreadsheet.bless = function(object) {
	
  var key, result, value;
  result = new GoogleSpreadsheet();
  for (key in object) {
    value = object[key];
    result[key] = value;
  }
  return result;
};

GoogleSpreadsheet.find = function(params){
  var item, itemObject, key, value, _i, _len;
 // var localStorage={ key1: null, key2: null};
 
  if(localVarIdentifier==undefined)
  	return null;
  	
  try {

		itemObject=JSON.parse(DBget(localVarIdentifier))
        for (key in params) {
          value = params[key];
          if (itemObject[key] === value) {
            return GoogleSpreadsheet.bless(itemObject);
          }
    	}
  } catch (error) {

    for (_i = 0, _len = DB().length; _i < _len; _i++) {
      console.log("catch in GoogleSpreadsheet.find()")
      item = DB()[_i];
      if (item.match(localVarIdentifier)) {
        itemObject = JSON.parse(DBget(item));
        for (key in params) {
          value = params[key];
          if (itemObject[key] === value) {
            return GoogleSpreadsheet.bless(itemObject);
          }
        }
      }
    }
  }
  return null;
};

GoogleSpreadsheet.callbackCells = function(data) {
  var cell, googleSpreadsheet, googleUrl;
  googleUrl = new GoogleUrl(data.feed.id.$t);
  googleSpreadsheet = GoogleSpreadsheet.find({
    jsonUrl: googleUrl.jsonUrl
  });
  if (googleSpreadsheet === null) {
    googleSpreadsheet = new GoogleSpreadsheet();
    googleSpreadsheet.googleUrl(googleUrl);
  }
  googleSpreadsheet.data = (function() {
    var _i, _len, _ref, _results;
    _ref = data.feed.entry;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cell = _ref[_i];
      _results.push(cell.content.$t);
    }
    return _results;
  })();
  googleSpreadsheet.save();
  return googleSpreadsheet;
};
/* TODO (Handle row based data)
GoogleSpreadsheet.callbackList = (data) ->*/





Object.keys = Object.keys || (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString"),
        DontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ],
        DontEnumsLength = DontEnums.length;
 
    return function (o) {
        if (typeof o != "object" && typeof o != "function" || o === null)
            throw new TypeError("Object.keys called on a non-object");
 
        var result = [];
        for (var name in o) {
            if (hasOwnProperty.call(o, name))
                result.push(name);
        }
 
        if (hasDontEnumBug) {
            for (var i = 0; i < DontEnumsLength; i++) {
                if (hasOwnProperty.call(o, DontEnums[i]))
                    result.push(DontEnums[i]);
            }
        }
 
        return result;
    };
})();


if(window.JSON==undefined){
	/*
    http://www.JSON.org/json2.js
    2011-02-23

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false, regexp: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
}

