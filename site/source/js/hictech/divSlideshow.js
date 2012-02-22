// jQuery plugin
// divSlideshow 0.1 hicTech - 2010


divSlideshow= function(elem,options){
    
    var settings = {
    'autostart'                : true,
    'slide_permanence'         : 2000,
    'transaction_duration'     : 1000,
    'out_effect'               : 'slide',    //blind, bounce, clip, explode, fold, highlight, puff, pulsate, scale, shake, size, slide
    'in_effect'                : 'slide',
    'start_slide'              : 0,
    'controller'               : false,
    'controller_top_margin'    : 10,
    'controller_left_margin'   : 10,
	'indicators'               : false,
	'indicators_top_margin'    : 0,
	'indicators_left_margin'   : 0, 
	'indicatorClick'           : true
    };
    
    if ( options ) { 
        $.extend( settings, options );
    }
    
   
    var stopSliding=false;
    var slides_number=$(elem).children().length;
    
    if(slides_number==1)
        return false;
    
    if(settings.start_slide>slides_number-1){
        //alert("No slide at "+settings.start_slide+" position! \nthe slide show will start from last slide")
        settings.start_slide=slides_number-1;
    }
    
    if(settings.slide_permanence<=settings.transaction_duration){
        settings.transaction_duration=settings.slide_permanence/3;
    }
    
    var slides_array= new Array();
    var current_slide=settings.start_slide;
    var next_slide=getNextSlide();
    
    $(elem).addClass("div_slideshow_general_container")
    
    
    $(elem).children().each(function(index,child){  
        slides_array.push($(this));
        if(index!=settings.start_slide)
            $(this).hide();
            $(this).css("position","absolute","overflow","hidden");

    });
    
    
    this.startSlide= function(){
        var slide_time=settings.slide_permanence;
        timer=setInterval(function(){
                                if(!stopSliding)
                                    goAhead();
                            
                            },slide_time);
    }

    var interruptTimer;
    function interrupt(){
        stopSliding=true;
        clearTimeout(interruptTimer);
        interruptTimer=setTimeout(function(){
                stopSliding=false;
        },settings.slide_permanence);
    }
    
   function goAhead(){
		swapSlide("forward");
		current_slide++;
		if(current_slide==slides_number){
			current_slide=0;
		}
		if(settings.indicators)setIndicators(current_slide);
	}
	
	function goBack(){
		swapSlide("back");
		current_slide--;
		if(current_slide==-1){
			current_slide=slides_number-1;
		}
		if(settings.indicators)setIndicators(current_slide);
	}
	
	function goTo(i){
		animationInAction=true;
		slides_array[current_slide].hide(settings.out_effect,settings.transaction_duration);
        slides_array[i].show(settings.in_effect,settings.transaction_duration,function(){animationInAction=false});
		current_slide=i;
		if(current_slide==-1){
			current_slide=slides_number-1;
		}
		if(settings.indicators)setIndicators(current_slide);
	}
    
    
    function getNextSlide(){
     if(current_slide==slides_number-1){
        return 0;
        }
        return current_slide+1;
    }
    
    function getPreviousSlide(){
     if(current_slide==0){
        return slides_number-1;
        }
        return current_slide-1;
    }
    
    var animationInAction;
    function swapSlide(direction){
        animationInAction=true;
        if(direction=="forward"){
            slides_array[current_slide].hide(settings.out_effect,settings.transaction_duration);
            slides_array[getNextSlide()].show(settings.in_effect,settings.transaction_duration,function(){animationInAction=false});
        }
        else{
            slides_array[current_slide].hide(settings.out_effect,settings.transaction_duration);
            slides_array[getPreviousSlide()].show(settings.in_effect,settings.transaction_duration,function(){animationInAction=false});
            }
    }
    
    
    this.goToNextSlide=function(){
            goAhead();
        }
    
    
    this.goToPrevioustSlide=function(){
            goBack();
        }
    
    
    this.stopSlideShow= function (){
         stopSliding=true;
        }
    
    $(elem).click(function(){
        if(settings.controller==true)
            if(controllerDomElement.is(':hidden')){
                controllerDomElement.show("fade",400);
                stopSliding=true;
            }
            
        
    });
	
	function setIndicators(n){
		$(elem).find(".ball").each(function(i){
			if (i != n) {
				$(this).addClass("off");
				$(this).unbind("click");
				if(settings.indicatorClick){
					$(this).bind("click",function(){
						if (!animationInAction) {
							goTo(i);
						}
					});
				}
			}
			else 
				$(this).removeClass("off")
		});
		
	}
    
    
    $(elem).mouseenter(function(){
        stopSliding=true;
    });
    
    
    $(elem).mouseleave(function(){
        stopSliding=false;
    });
    
    
    


    
    
    if(settings.autostart)
    this.startSlide();
    
 
    if (settings.controller == true) {
        $(elem).append('<div class="SlideShowController" style="top:' + settings.controller_top_margin + 'px; left:' + settings.controller_left_margin + 'px"><div class="SlideShowController _back"></div><div class="SlideShowController _forward"></div></div>');
        $(this).attr('class') == "controller";
        
    }
	
	
	var html_indicators="<div class='SlideShowIndicatorsContainer' style='position:relative; z-index:30000; top:" + settings.indicators_top_margin + "px'>";
	
							var indicators_container_width=0;
							for(var i=0;i<slides_array.length;i++){
								
								html_indicators+="<div class='ball off'></div>";
								indicators_container_width+=22;
							}
						html_indicators+="</div>";
	
	if(settings.indicators){
		
		$(elem).append(html_indicators);
		
		if(!settings.indicators_left_margin){
			indicators_container_left_margin=parseInt((($(".SlideShowIndicatorsContainer").parent().css("width").replace("px",""))-indicators_container_width)/2)
			$(".SlideShowIndicatorsContainer").css("left",indicators_container_left_margin)
		}
		else{
			$(".SlideShowIndicatorsContainer").css("left",settings.indicators_left_margin)
		}
		
		
	}

	setIndicators(settings.start_slide);


    var controllerDomElement;
    $(elem).children().each(function(index,child){  
        if($(this).attr("class")=="SlideShowController"){
                controllerDomElement=$(this);
                $(this).children().each(function(index){
                                                 if($(this).attr("class")=="SlideShowController _back")
                                                    $(this).click(function(){
                                                        
                                                        if (!animationInAction) {
                                                            goBack();
                                                        }
                                                    });
                                                 if($(this).attr("class")=="SlideShowController _forward")
                                                    $(this).click(function(){
                                                        if (!animationInAction) {
                                                            goAhead();
                                                        }
                                                    });
                                                 if($(this).attr("class")=="SlideShowController _play")
                                                    $(this).click(function(){
                                                        controllerDomElement.hide("fade",400);
                                                        stopSliding=false;
                                                    });
                                                
                                                 });
            }
            
    });
}