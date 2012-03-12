/*!
 * 
      _/_/_/_/                                      _/
     _/    _/  _/_/_/     _/_/_/   _/_/_/ _/_/_/   _/ 
    _/_/_/_/  _/    _/  _/    _/  _/    _/    _/  _/  
   _/    _/  _/    _/  _/    _/  _/    _/    _/  _/
  _/    _/  _/_/_/_/  _/_/_/_/  _/    _/    _/  _/
           _/        _/                                          
	      _/        _/
    						                 						                
    						                
 * appML v0.9
 * http:// appml.org
 *
 * Copyright 2011, hicTech srl www.hictech.com
 * licensed under the MIT
 *
 * Date: Genuary 11st 2011
 */

/*$(document).ready(*/(function($){
	
	$.appManager = function(options){

		
		
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Settings
		
		var settings = {
			selector                 : '#appML_content',
			transaction_duration     : 200,
			header                   : true,
			page_out_effect          : 'fade',    //blind, bounce, clip, explode, fold, highlight, puff, pulsate, scale, shake, size, slide
			page_in_effect           : 'fade',
			header_out_effect        : 'fade',    
			header_in_effect         : 'fade',
			between_effects_delay    : 300,
			start_page               : 0,
			menu_top_margin		     : 0,
			menu_left_margin         : 10,
			banner 				     : false,
			login                    : false,
			animation_replacements	 : {
				slide: "fade",
				flip: "fade",
				slideup: "fade",
				swap: "fade",
				cube: "fade",
				pop: "fade",
				dissolve: "fade",
				fade: "fade"
			},
			default_animation : "slide",
			async_sizing			 : true
		};
		
		this.setOptions = function(options){
			$.extend( true, settings, options );
		};
		
		if(options) 
			this.setOptions(options);
		
		
		
		
		
		
		
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Global vars
		
		
		var pages_number=0;
		var pages_array= new Array();
		var current_page=settings.start_page;
		var iScrolls=new Array();
		var max_id=0;
	    var overlay=false;
	    var appML_ready_fn="";
	    	
	    /*
		this.page_width=0;
		this.page_height=0;
		this.side_control_width=0;
		this.side_control_heigth=0;
		*/
	    this.dimensions=null; 
	    var scrollable_elems_to_compute=new Array();
		var elems_copies=new Array();
		
		
		
		
		
		
		
		
		
		
		
		
		
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// General utility functions

		function executeFunction(fn){
			if(fn!=null && fn.length>0)
				eval(fn);
		}
		
		
		
		
		
		

		
		
		
		
		
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Menu and selected-item management		
		
		function injectTitlePage(title,login,i){
			if($("#appML_navigation_bar").length>0 && $("#appML_navigation_bar").is(".appML_auto_fill")){
				var title_visibility="display:none";
				if(i==current_page)
					title_visibility="";
				if(login!=null)
					title="Login";
				$("#appML_navigation_bar").append($("<div style='position:relative'><div style='"+title_visibility+"'>"+title+"</div><div class='back'>Back</div></div>"));
			}
		}
		
		function injectMenuItems(title,icon,url,i){
			var width=100/pages_number;
			
			if($("style").html().indexOf('@import')==-1 || $("style").html().indexOf('/theme.css')==-1){
				alert("some unexpected string including theme.css... it must be like: @import 'themes/your_theme_folder/theme.css' ");
			}
			var toolbar_icon_path=$("style").html().replace('@import "','').replace('/theme.css";','');

			if(isAppMLAutoFilled("appML_toolbar")){
				var html_toolbar="<div class='appML_toolbar_content' data-href='"+url+"' style='width:"+width+"%'>"+					
									"<div class='appML_toolbar_icon'><img style='margin:2px 0px 0px 0px;' src='"+toolbar_icon_path+"/toolbar_icons/icons_off/"+icon+"' /></div>"+
									"<div class='appML_toolbar_label'><font>"+title+"</font></div>"+  
								"</div>";
				$("#appML_toolbar").append($(html_toolbar));
			}
			if(isAppMLAutoFilled("appML_left")){
				var html_sidebar="<div class='appML_sidebar_button'  data-href='"+url+"'>"+
									"<div class='appML_sidebar_background_icon'><div style='text-align:center;'><img src='"+toolbar_icon_path+"/toolbar_icons/icons_off/"+icon+"'  style='margin:9px 0px 0px 0px'></div></div>"+
									"<div class='appML_sidebar_label'>"+title+"</div>"+
								"</div>";	
				$("#appML_left").append($(html_sidebar));
			}
		}
		
		function setElementAsSelected(n){
			if(isAppMLAutoFilled("appML_toolbar")){
				$("#appML_toolbar").find("[data-href]").each(function(index){
					var node= $(this).find("img");
					var src = node.attr("src");
					if(index!=n){
						var	src = src.replace("icons_on","icons_off");
						node.attr("src",src);
					}
					else{
						var	src_s = src.replace("icons_off","icons_on");
						node.attr("src",src_s);
					}
				});
			}
			
			if(isAppMLAutoFilled("appML_left")){
				$("#appML_left").find("[data-href]").each(function(index){
					var node= $(this).find("img");
					var src = node.attr("src");
					if(index!=n){
						$(this).removeClass("appML_sidebar_button_on");
						if(src!=null){
							var src_s = src.replace("icons_on","icons_off");
							node.attr("src",src_s);
						}
					}
					else{
						$(this).addClass("appML_sidebar_button_on");
						if(src!=null){
							var	src_s = src.replace("icons_off","icons_on");
							node.attr("src",src_s);
						}
					}
				});
			}			
			
		}
		
		
		
		
		
		
		
		
		
		
		
		
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Panels functions		
		
		
		function isAppMLAutoFilled(elem_id){
			var $elem=$("#"+elem_id);
			return $elem.length>0 && $elem.is(".appML_auto_fill");
		}
		
		function getPanels(){
			var ret=new Array();
			for(i=0;i<pages_array.length;i++)
				ret.push(getNthPanel(i));
			return ret;
		}
		
		function getNthPanel(n){
			return pages_array[n].find("div > div");
		}
		
		function getCurrentPanel(){
			return getNthPanel(current_page);
		}
		
		function findPagePanelIndex(page_id){
			var url = (page_id.indexOf('#')==0) ? page_id : "#"+page_id;
			var panel=null;
			// find panel index
			for(i=0;i<pages_array.length;i++){
				panel=pages_array[i].find(url);
				if(panel!=null && panel.length>0)
					return i;
			}
		}
		
		function isPageInCurrentPanel(page_id){
			var url = (page_id.indexOf('#')==0) ? page_id : "#"+page_id;
			return pages_array[current_page].find(url).length>0;
		}
		
		function goNth(n){
			if(n!=current_page){
				var prev_page=$(".current").attr("id");
				setElementAsSelected(n);
				var id_pannello=getNthPanel(n).attr("id");
				jQT.setSelectedPanel(id_pannello);
				animatePanels(current_page,n);
				current_page=n;
			}
		}
		
		
		
		
		
		
		
		
		
		
		
		
		
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Navigation and animation functions		
		
		
		function goUrl(url,animation){
			if(url=="logout"){
				showDialog({
					message:"<div style='text-align:center'>Vuoi davvero uscire?</div>",
					type                   : "confirm",
					denyCallback		   : hideDialog,
					confirmCallback        : function(){document.location.href="index.html";}
				});
			}
			else{
				if(url.indexOf("#")==0){
					if(animation==null || animation.length==0)
						animation=settings.default_animation;
					var pos=findPagePanelIndex(url);
					if(pos>=0 && pos!=current_page){
						//alert("goToNth");
						goNth(pos);
					}
					if($(url).is(".appML_page")){
						//alert("goTo");
						jQT.goTo(url,animation);
					}
				}
				else
					location.href=url;
			}
		}
		
		function getAnimationOptions(animation, appear){
			var value = (appear) ? "in" : "out";
			/*
			if(animation=="hide")
				value = (appear) ? "right" : "left";
			*/
			return {direction: value};
		}
		

		
		function animatePanels(panel_out, panel_in){
			$("#appML_navigation_bar >div:eq("+panel_out+") >div").hide();
			$("#appML_navigation_bar >div:eq("+panel_in+") >div").show();
			pages_array[panel_out].hide();
			pages_array[panel_in].show();
		}
		
		
		function animate(fromPage, toPage, animation, backwards){
			if($.support.WebKitAnimationEvent)
				jQT.animate(fromPage, toPage, animation, backwards);
			else{
				var anim="";
				if(animation!=null)
					eval("anim=settings.animation_replacements."+(animation.name));
				else
					anim=default_animation;
				$(fromPage).hide(getAnimationOptions(anim,false),settings.transaction_duration,function(){
					//$(fromPage).trigger('appMLAnimationEnd', { direction: 'out' });
				});
				$(toPage).show(getAnimationOptions(anim,true),settings.transaction_duration,function(){
					$(toPage).trigger('appMLAnimationEnd');
					//updateScroll();  eliminato, funziona tutto lo stesso...
				});
			}
		}
		
		
		
		
		
		
		
		
		
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Dimensions management functions		
		
		function isLandscape(){
			return (window.innerWidth > window.innerHeight);
		}
		
		function getChildDimensions($elem, father_dims, default_percent_width, default_percent_height, max_percent_width, max_percent_height, left_dims){
			// max width and height for landscape and portrait orientations
			var def_percent_width = (default_percent_width!=null && default_percent_width>0) ? default_percent_width : 100;
			var def_percent_height = (default_percent_height!=null && default_percent_height>0) ? default_percent_height : 100;
			
			var w_l, w_p, h_l, hp;
			var max_father_percent_width = (max_percent_width!=null && max_percent_width>0) ? max_percent_width : 70;
			var max_father_percent_height = (max_percent_height!=null && max_percent_height>0) ? max_percent_height : 70;
			var max_w_l=Math.floor(max_father_percent_width * father_dims.landscape.width / 100);
			var max_w_p=Math.floor(max_father_percent_width * father_dims.portrait.width / 100);
			var max_h_l=Math.floor(max_father_percent_height * father_dims.landscape.height / 100);
			var max_h_p=Math.floor(max_father_percent_height * father_dims.portrait.height / 100);
			if(left_dims!=null){
				if(max_w_l>left_dims.landscape.width) 
					max_w_l=left_dims.landscape.width;
				if(max_w_p>left_dims.portrait.width) 
					max_w_p=left_dims.portrait.width;
				if(max_h_l>left_dims.landscape.height) 
					max_h_l=left_dims.landscape.height;
				if(max_h_p>left_dims.portrait.height) 
					max_h_p=left_dims.portrait.height;
			}
			
			// width calculation
			var w=getDimPercent($elem,true);
			if(w>0){
				w_l = Math.floor(w * father_dims.landscape.width / 100);
				w_p = Math.floor(w * father_dims.portrait.width / 100);
			}
			else{
				w=getFixedDim($elem,true);
				if(w>0){
					w_l=w;
					w_p=w;
				}
				else{
					w=def_percent_width;
					w_l = Math.floor(w * father_dims.landscape.width / 100);
					w_p = Math.floor(w * father_dims.portrait.width / 100);
				}
			}
			if(w_l>max_w_l)
				w_l=max_w_l;
			if(w_p>max_w_p)
				w_p=max_w_p;
			
			// height calculation
			var h=getDimPercent($elem,false);
			if(h>0){
				h_l = Math.floor(h * father_dims.landscape.height / 100);
				h_p = Math.floor(h * father_dims.portrait.height / 100);
			}
			else{
				h=getFixedDim($elem,false);
				if(h>0){
					h_l=h;
					h_p=h;
				}
				else{
					h=def_percent_height;
					h_l = Math.floor(h * father_dims.landscape.height / 100);
					h_p = Math.floor(h * father_dims.portrait.height / 100);
				}
			}
			if(h_l>max_h_l)
				h_l=max_h_l;
			if(h_p>max_h_p)
				h_p=max_h_p;
			
			var ret={
				landscape:{
					width: w_l,
					height: h_l
				},
				portrait:{
					width: w_p,
					height: h_p 
				}
			};
			return ret;
		}
		
		function findHeightSpread(){
			var s_w=screen.width;
			var s_h=screen.height;
			var w_w=$(window).width();
			var w_h=$(window).height();
			if(s_w==w_w)
				return s_h-w_h;
			if(s_w==w_h)
				return s_h-w_w;
			if(s_h==w_w)
				return s_w-w_h;
			if(s_h==w_h)
				return s_w-w_w;
		}
		
		function findWindowDimensions(){
			var dim_diff=findHeightSpread();
			var w_l, w_p, h_l, h_p;
			if(isLandscape()){
				w_l=$(window).width();
				h_l=$(window).height();
				w_p=h_l+dim_diff;
				h_p=w_l-dim_diff;
			}
			else{
				w_p=$(window).width();
				h_p=$(window).height();
				w_l=h_p+dim_diff;
				h_l=w_p-dim_diff;
			}
			
			return {
				landscape:{
					width: w_l,
					height: h_l
				},
				portrait:{
					width: w_p,
					height: h_p 
				}
			};
		}
		
		function findPanelsDimensions(){
			var dimensions={};
			
			// window object
			dimensions.window=findWindowDimensions();
			var left_dims={};
			$.extend(true, left_dims, dimensions.window);
									
			// panels dimensions
			var elem=$("#appML_top");
			if(elem.length>0){
				dimensions.top=getChildDimensions(elem,dimensions.window,100,8,100,null);
				left_dims.landscape.height-=dimensions.top.landscape.height;
				left_dims.portrait.height-=dimensions.top.portrait.height;
			}
			elem=$("#appML_bottom");
			if(elem.length>0){
				dimensions.bottom=getChildDimensions(elem,dimensions.window,100,8,100,null);
				left_dims.landscape.height-=dimensions.bottom.landscape.height;
				left_dims.portrait.height-=dimensions.bottom.portrait.height;
			}
			elem=$("#appML_left");
			if(elem.length>0){
				dimensions.left=getChildDimensions(elem,dimensions.window,40,100,null,100,left_dims);
				left_dims.landscape.width-=dimensions.left.landscape.width;
				left_dims.portrait.width-=dimensions.left.portrait.width;
			}
			elem=$("#appML_right");
			if(elem.length>0){
				dimensions.right=getChildDimensions(elem,dimensions.window,40,100,null,100,left_dims);
				left_dims.landscape.width-=dimensions.right.landscape.width;
				left_dims.portrait.width-=dimensions.right.portrait.width;
			}
			
			// pages dimensions
			dimensions.app_body={};
			$.extend(true, dimensions.app_body, left_dims);
			elem=$("#appML_navigation_bar");
			if(elem.length>0){
				dimensions.navigation=getChildDimensions(elem,dimensions.app_body,100,null,100,null);
				left_dims.landscape.height-=dimensions.navigation.landscape.height;
				left_dims.portrait.height-=dimensions.navigation.portrait.height;
			}
			elem=$("#appML_toolbar");
			if(elem.length>0){
				dimensions.toolbar=getChildDimensions(elem,dimensions.app_body,100,null,100,null);
				left_dims.landscape.height-=dimensions.toolbar.landscape.height;
				left_dims.portrait.height-=dimensions.toolbar.portrait.height;
			}

			dimensions.pages={};
			$.extend(true, dimensions.pages, left_dims);
			
			return dimensions;
		}
		
		function areSameDimensions(dim1, dim2){
			if(dim1.landscape.width==dim2.landscape.width && dim1.landscape.height==dim2.landscape.height &&
					dim1.portrait.width==dim2.portrait.width && dim1.portrait.height==dim2.portrait.height)
				return true;
			else
				return false;
		}
		
		function setPanelsDimensions(){
			var resize=true;
			if(appML.dimensions!=null && appML.dimensions.window!=null){
				var window_dims=findWindowDimensions();
				if(areSameDimensions(window_dims,appML.dimensions.window))
					resize=false;
			}
			if(resize)
				appML.dimensions=findPanelsDimensions();
			return resize;
		}
		
		function refreshPanelDimensions($elem,dims){
			if($elem==null || $elem.length==0)
				return;
			if(isLandscape())
				$elem.width(dims.landscape.width).height(dims.landscape.height);
			else
				$elem.width(dims.portrait.width).height(dims.portrait.height);
		}
		
		function refreshDimensions(callback_fn, only_sections){
			var dimensions=appML.dimensions;
			refreshPanelDimensions($("#appML_top"),dimensions.top);
			refreshPanelDimensions($("#appML_bottom"),dimensions.bottom);
			refreshPanelDimensions($("#appML_left"),dimensions.left);
			refreshPanelDimensions($("#appML_right"),dimensions.right);
			refreshPanelDimensions($("#appML_navigation_bar"),dimensions.navigation);
			refreshPanelDimensions($("#appML_toolbar"),dimensions.toolbar);
			refreshPanelDimensions($("#appML_body_app_container"),dimensions.app_body);
			refreshPanelDimensions($("#appML_content_wrapper"),dimensions.pages);
			
			if(!only_sections){
				$(".appML_section").each(refreshScrollables);
				if(settings.async_sizing)
					computeNextScrollableElem(callback_fn);
				else if(callback_fn!=null && callback_fn.length>0)
					executeFunction(callback_fn);
			}
		}
		
		function getSpecifiedDim($elem, width){
			var ret = (width) ? $elem.attr("data-appml-width") : $elem.attr("data-appml-height");
			if(ret==null || ret.length==0)
				ret = (width) ? ($elem.get(0).style.width) : ($elem.get(0).style.height);
			if(ret==null || ret.length==0)
				ret = (width) ? ($elem.css("width")) : ($elem.css("height"));
			return ret;
		}
		
		function getFixedDim($elem,width){
			var ret=getSpecifiedDim($elem, width);
			if(ret!=null && ret.length>0){
				if(ret.indexOf('px') == ret.length-2)
					return parseInt(ret.substring(0,ret.length-2));
				else{
					try{
						return parseInt(ret);
					}catch(err){}
				}
			}
			return -1;
		}
		
		function getDimPercent($elem,width){
			if((width && $elem.is(".expand_width")) || ((!width) && $elem.is(".expand_height")))
				return 100;
			var percent_value = getSpecifiedDim($elem, width);
			if(percent_value==null || percent_value.length==0)
				return -1;
			return (percent_value.indexOf('%') == percent_value.length-1) ? parseInt(percent_value.substring(0,percent_value.length-1)) : -1;
		}
		
		function findSectionDimension(id){
			if(id.indexOf("appML_")>=0)
				id=id.substring("appML_".length,id.length);
			var dims=null;
			eval("dims=appML.dimensions."+id+";");
			if(dims!=null)
				return dims;
			else
				return appML.dimensions.pages;
		}
		
		function getActualSectionDimensions(section_name){
			var dim=null;
			eval("dim=appML.dimensions."+section_name);
			if(dim!=null)
				return isLandscape() ? dim.landscape : dim.portrait;
			else
				return null;
		}
		
		function findWrapperParentDims($elem){
			var parent=findWrapperParent($elem)
			if(parent.is(".appML_section")){ // outer iscroll
				var id=parent.attr("id");
				return findSectionDimension(id);
			}
			else{ // direct iscroll in appML_section or section itself
				var iscroll=getIScroll(parent.attr("id"));
				if(iscroll!=null)
					return iscroll.wrapper_dims;
				else{
					return appML.dimensions.window;
				}
			}
		}
		
		function getWrapperDimensions($elem){
			$wrapper=$elem.parent();
			if($wrapper.is(".appML_section"))
				return findSectionDimension($wrapper.attr("id"));
			var outer_dims=findWrapperParentDims($wrapper); 
			var dims=getChildDimensions($wrapper, outer_dims,100,100,100,100);
			return dims;
		}
		
		function setWrapperDimensions(iScroll){
			var dims=getWrapperDimensions(iScroll.$elem); 
			iScroll.wrapper_dims=dims;
		}

		
		
		
		
		
		
		
		
		
		
		
		
		
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Dimensions test functions				

		function cloneAndEmptyElem($elem){
			var temp=$elem.clone();
			temp.empty();
			return temp;
		}
		
		function getElemCopy($elem){
			var id=$elem.attr("id");
			if(id!=null && id.length>0){
				for(i=0;i<elems_copies.length;i++)
					if(elems_copies[i].attr("id")==id)
						return elems_copies[i];
			}
			var cloned=cloneAndEmptyElem($elem);
			if(id!=null && id.length>0)
				elems_copies.push(cloned);
			return cloned;
		}
		
		function getParentsChain($elem){
			var chain=null;
			var nav=$elem;
			var temp=null;
			while(nav!=null){
				nav=nav.parent();
				if(nav.is(".appml_root_div") || nav.is("#overlayContainer")) 
					nav=null;
				else{
					temp=getElemCopy(nav);
					temp.empty();
					if(chain!=null)
						temp.append(chain);
					chain=temp;
				}
			}
			return chain; 
		}
		
		function getScrollElemDimensions($elem){
			var elem_id=$elem.attr("id");
			var wrapper_id=$elem.parent().attr("id");
			var iScroll=getIScroll(elem_id);
			var size_tester=$("#appML_size_tester");
			var dims={ landscape: { width:0, height:0 }, portrait:{ width:0, height:0 } };
			
			// find greatest width
			var max_w=0;
			size_tester.html("");
			size_tester.width(0);
			$elem.clone().appendTo(size_tester);
			size_tester.children().each(function(){ 
				var w=$(this).outerWidth(true);
				if(w>max_w)
					max_w=w;
			});
			
			size_tester.html("");
			//size_tester.width(appML.dimensions.window.landscape.width);
			var tester_w = (max_w>iScroll.wrapper_dims.landscape.width) ? max_w : iScroll.wrapper_dims.landscape.width;
			var chain=getParentsChain($elem);
			chain.appendTo(size_tester);
			var tester_wrapper=chain.find("#"+wrapper_id);
			tester_wrapper.width(tester_w);
			
			if(!tester_wrapper.is(":visible")){
				if(tester_wrapper.css("display")=="none"){
					tester_wrapper.css("display","block");
				}
				tester_wrapper.parents().each(function(){ 
					var $this=$(this); 
					if($this.css("display")=="none"){
						$this.css("display","block");
					}
				}); 
			}

			var clone=$elem.clone();
			resizeInnerIScrollElements(clone,iScroll.wrapper_dims.landscape.width);
			clone.appendTo(tester_wrapper);
			var elem_in_tester=chain.find("#"+elem_id);
			dims.landscape.width=elem_in_tester.width();
			dims.landscape.height=elem_in_tester.height();
			
			tester_w = (max_w>iScroll.wrapper_dims.portrait.width) ? max_w : iScroll.wrapper_dims.portrait.width;
			tester_wrapper.empty();
			tester_wrapper.width(tester_w);
			clone=$elem.clone();
			resizeInnerIScrollElements(clone,iScroll.wrapper_dims.portrait.width);
			clone.appendTo(tester_wrapper);
			elem_in_tester=chain.find("#"+elem_id);
			dims.portrait.width=elem_in_tester.width();
			dims.portrait.height=elem_in_tester.height();
			
			size_tester.html("");
			return dims;
		}
		

		
		
		
		
		
		
		
		
		
		
		
		
		
		
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Iscroll management		
		

		function refreshScrollables(){
			var $this=$(this);
			var is_iscroll=$this.is(".iscroll");
			if(is_iscroll){
				var id=$this.attr("id");
				var iScroll=getIScroll(id);
				if(iScroll!=null)
					setWrapperDimensions(iScroll);
				else
					createScrollWithId(id);
			}
			$this.children().each(refreshScrollables);
			if(is_iscroll){
				if(settings.async_sizing)
					scrollable_elems_to_compute.push($this);
				else
					refreshIScrollElem($this);
			}
		}
		
		function computeNextScrollableElem(callback_fn){
			var elem=extractFirstScrollableElemToCompute();
			if(elem!=null){
				refreshIScrollElem(elem);
				setTimeout(function(){computeNextScrollableElem(callback_fn);},0);
			}
			else{
				executeFunction(callback_fn);
			}
		}
		
		function extractFirstScrollableElemToCompute(){
			if(scrollable_elems_to_compute.length>0){
				var ret=scrollable_elems_to_compute[0];
				scrollable_elems_to_compute=scrollable_elems_to_compute.slice(1,iScrolls.length);
				return ret;
			}
			else
				return null;
		}
		
		function createIScroll(){
			$this=$(this);
			var id=$this.attr("id");
			createScrollWithId(id);
		}
		
		function createDialogScroll(){
			$this=$(this);
			var id=$this.attr("id");
			createScrollWithId(id);
			refreshIScrollElem($this);
		}
		
		function createScrollWithId(id, replace_if_exists){
			var can_create=true;
			if(replace_if_exists)
				deleteIScrollWithId(id);
			else
				can_create=(getIScroll(id)==null);
			if(can_create){
				var $elem=$("#"+id);
				
				var iscroll_options={desktopCompatibility : true, doRefreshOnInit : false};
				if($elem.is(".carousel_scroller")){
					var dir=$elem.parent().attr("data-appML-direction");
					var scrollEndFn;
					if(dir!=null && dir=="vertical"){ 
						scrollEndFn=function () {
							var indicator=$("#"+id).closest(".carousel_container").find('.carousel_indicator');
							indicator.children('.selected').removeClass("selected");
							indicator.children('li:nth-child(' + (this.pageY+1) + ')').addClass("selected");
						};
					}
					else{
						scrollEndFn=function () {
							var indicator=$("#"+id).closest(".carousel_container").find('.carousel_indicator');
							indicator.children('.selected').removeClass("selected");
							indicator.children('li:nth-child(' + (this.pageX+1) + ')').addClass("selected");
						};
					}
					iscroll_options=$.extend({},iscroll_options,{
						snap:true,
						momentum:false,
						hScrollbar:false,
						vScrollbar:false,
						onScrollEnd: scrollEndFn
					});
				}
				
				var iScroll=new $.iScroll(id,iscroll_options);
				
				// effettua soltanto il settaggio del wrapper...
				setWrapperDimensions(iScroll);
				
				iScrolls.push(iScroll);
				return iScroll;
			}
			return null;
		}
		
		function getIScroll(id){
			for(i=0;i<iScrolls.length;i++){
				if(iScrolls[i].$elem!=null && iScrolls[i].$elem.attr("id")==id)
					return iScrolls[i];
			}
			return null;
		}
		
		function findIScrollFromWrapper(wrapper_id){
			var iScroll=$("#"+wrapper_id).children(".iscroll");
			if(iScroll.length>0) 
				return getIScroll(iScroll.attr("id"));
			else
				return null;
		}
		
		function updateIScroll(){
			var id=$(this).attr("id");
			updateIScrollWithId(id);
		}
		
		function findWrapperParent($elem){
			var parent=$elem.closest(".iscroll");
			if(parent.length>0)
				return parent;
			else 
				return ($elem.is(".appML_section")) ? $elem : $elem.closest(".appML_section");
		}
		

		function resizeInnerIScrollElements($elem, width) {
			if($elem.is(".resizeWidth")){
				$elem.width(width);
			}
			if($elem.children().length>0)
				$elem.children().each(function(){ resizeInnerIScrollElements($(this), width); });
		}
		
		function refreshIScrollElem($elem){
			var id=$elem.attr("id");
			var iScroll=getIScroll(id);
			var has_to_init=(iScroll.elem_dims==null);
			var dims=getScrollElemDimensions($elem);  //  oldGetScrollElemDimensions($elem);
			iScroll.elem_dims=dims;
			var wrapper=$(iScroll.wrapper);
			if(!$elem.is(".iscroll_dialog")){
				var refresh_parents=false;
				if(wrapper.attr("data-appml-width")==null){
					if(iScroll.wrapper_dims.landscape.width!=dims.landscape.width){
						iScroll.wrapper_dims.landscape.width=dims.landscape.width;
						refresh_parents=true;
					}
					if(iScroll.wrapper_dims.portrait.width!=dims.portrait.width){
						iScroll.wrapper_dims.portrait.width=dims.portrait.width;
						refresh_parents=true;
					}
				}
				if(wrapper.attr("data-appml-height")==null){
					if(iScroll.wrapper_dims.landscape.height!=dims.landscape.height){
						iScroll.wrapper_dims.landscape.height=dims.landscape.height;
						refresh_parents=true;
					}
					if(iScroll.wrapper_dims.portrait.height!=dims.portrait.height){
						iScroll.wrapper_dims.portrait.height=dims.portrait.height;
						refresh_parents=true;
					}
				}
				if(refresh_parents){
					var parent=findWrapperParent($elem);
					if(parent.is(".iscroll")){
						var parent_iscroll=getIScroll(parent.attr("id"));
						if(parent_iscroll.elem_dims!=null) // otherwise it will be calculated later...
							refreshIScrollElem(parent);
					}
				}
			}

			if(has_to_init){
				$elem.find("img").one('load',imageLoaded); 
				
				iScroll.init();
			}
			
			iScroll.refresh();
		}
		
		function imageLoaded(){
			var $this=$(this);
			var $elem=$this.closest(".iscroll");
			refreshIScrollElem($elem);
		}
		
		
		function getIScrollDimensions($elem){
			var iScroll=null;
			if($elem.is(".iscroll")){
				iScroll=getIScroll($elem.attr("id"));
				return isLandscape() ? iScroll.elem_dims.landscape : iScroll.elem_dims.portrait;
			}
			else{
				var figli=$elem.children(".iscroll");
				if(figli.length>0){
					iScroll=getIScroll(figli.attr("id"));
					if(iScroll!=null){
						return isLandscape() ? iScroll.wrapper_dims.landscape : iScroll.wrapper_dims.portrait;
					}
				}
				return {};
			}
		}
		
		function updateIScrollWithId(id){
			var iScroll=getIScroll(id);
			if(iScroll!=null){
				iScroll.refresh();
				return true;
			}
			else{
				return false;
			}
		}
		
		function updateScroll(){
			$('.iscroll').each(updateIScroll);
		}
		
		function deleteIScrollWithId(id){
			var iScroll=null;
			for(i=0;i<iScrolls.length;i++){
				if(iScrolls[i].$elem!=null && iScrolls[i].$elem.attr("id")==id){
					iScroll=iScrolls[i];
					iScroll.destroy();
					var first_half = (i>0) ? iScrolls.slice(0,i) : new Array();
					var second_half = (iScrolls.length-(i+1)>0) ? iScrolls.slice(i+1,iScrolls.length-(i+1)) : new Array();  
					iScrolls=first_half.concat(second_half);
					return;
				}
			}
		}
		
		function deleteIScroll(){
			$this=$(this);
			var id=$this.attr("id");
			deleteIScrollWithId(id);
		}
		
		function manageIScrollParentMove(iScroll, scroll_x, scroll_y){
			$wrapper=$(iScroll.wrapper);
			var parent=findWrapperParent($wrapper);
			if(parent.is(".iscroll")){
				var parent_iScroll=getIScroll(parent.attr("id"));
				parent_iScroll.manageMove(scroll_x, scroll_y);
			}
		}
		
		function manageIScrollTouchStart(iScroll, point, time){
			var elem_id=iScroll.$elem.attr("id");
			for(i=0;i<iScrolls.length;i++){
				iScrolls[i].manageEnd(point,time,elem_id);
			}
		}

		
		
		
		
		
		
		
		
		
		
		
		
		
		
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Carousel management				

		
		function carouselPrev(){
			var $iScroll=$(this).parent().prev().children(":first");
			var iScroll=getIScroll($iScroll.attr("id"));
			iScroll.scrollToPage('prev', 0);
		}
		
		function carouselNext(){
			var $iScroll=$(this).parent().prev().children(":first");
			var iScroll=getIScroll($iScroll.attr("id"));
			iScroll.scrollToPage('next', 0);
		}
		 
		function adjustCarousel(){
			var container=$(this).closest(".carousel_container");
			var wrapper=$(this).parent();
			var dims=getIScrollDimensions(wrapper);
			var elems=$(this).find("li");
			elems.each(function(){ 
				$(this).width(dims.width);
				$(this).height(dims.height);
			});
			var direction=wrapper.attr("data-appml-direction");
			if(direction==null || direction.length==0)
				direction="horizontal";
			if(direction!=null && direction=="vertical"){
				$(this).width(dims.width);
				$(this).height(dims.height*elems.length);
			}
			else{
				$(this).width(dims.width*elems.length);
				$(this).height(dims.height);
			}
			$(container).find(".carousel_nav").width(dims.width);
			//if(typeof Touch == "object"){
				container.find(".carousel_prev").css("opacity",0);
				container.find(".carousel_next").css("opacity",0);
			/*}
			else{
				container.find('.carousel_prev').bind('click',carouselPrev);
				container.find('.carousel_next').bind('click',carouselNext);
			}*/
		}
		
		function printScrollable(){
			var $this=$(this);
			$this.removeClass("scrollable");
			var iscroll_container=$("<div />").addClass("iscroll_container");
			if($this.is(".appML_page"))
				iscroll_container.addClass("appML_page_container");
			copyContent($this,iscroll_container);
			var iscroll_node=$("<div />").addClass("iscroll").attr("id",$this.attr("id")+"_appML_iscroll_pane");
			iscroll_node.append(iscroll_container);
			$this.append(iscroll_node);
		}
		
		
	
		
		
		
		
		
		
		
		
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Html features functions
				
		
		//overlay, alert, confirm, select
		function showOverlay(){
			$("#overlayContainer").html('<div class="darkOverlay"></div>');
			$(".darkOverlay").addClass("darkOverlay_on");
			overlay=true;
		}
	
		function hideOverlay(){
			$(".dialog_container").addClass("off"); 
			$(".darkOverlay").addClass("darkOverlay_off");
			setTimeout(function(){$("#overlayContainer").html('');},300);
			overlay=false;
			$('.active').removeClass('active');
		}
		
		function showLoading(){
			showOverlay();
			$(".darkOverlay").html('<div class="ajaxLoader">loading...</div>');
			$(".ajaxLoader").canvasLoader({
			  backgroundColor:'transparent',
			  color:'#86d4f9',
			  fps:10,
			  radius:40,
			  dotRadius:3  
			  });
			
		}
		
		function hideLoading(){
			hideOverlay();
		}
															
		function showDialog(options){
				
			var settings = {
	  	    		type                   : "alert", //confirm, select
	  				confirmCallback		   : function(){hideDialog();},
	  				denyCallback		   : function(){return false;},
	  				title				   : "Alert",
	  				message				   : "This is a text message to show this tooltip!",
	  				select_options	       : "no options in this select"
	  			};
	  			
  			if ( options ) { 
  				$.extend( settings, options );
  			}
  			
			if(!overlay)
  				showOverlay();
  			
			$(".darkOverlay").html("");

  			var ok_button='<div class="dialog_button ok">ok</div>';
  			var deny_button="";
  			var confirm_html="";
  			var select_html="";
  			
  			(settings.type=="confirm") ? deny_button+='<div class="dialog_button deny">no</div>' : "";

  			if(settings.type=="confirm" || settings.type=="alert"){
  				 confirm_html+='<div class="dialog_header alert">'+settings.title+'</div><div class="dialog_body alert" id="dialog_scroller_wrapper"><div style="text-align:center" class="iscroll_dialog" id="dialog_scoller">'+settings.message+'</div></div>'+ok_button+''+deny_button;
  			}
  			else{
  				 select_html+='<div class="dialog_header select">'+settings.title+'<div class="close_dialog"><div class="x_close_dialog"></div></div></div><div class="dialog_body select" id="dialog_scroller_wrapper"><div style="text-align:center" class="iscroll_dialog" id="dialog_scoller">'+settings.select_options+'</div></div>';
  			}
  			
  			var message_html='<div class="darkOverlay"></div><div class="dialog_container">'+confirm_html+''+select_html+'</div>';
  			
			$("#overlayContainer").append($(message_html));

  			//dialog ok button
  			$('.dialog_button.ok').bind('click', function() {
  				settings.confirmCallback();
  				hideDialog();
  			});
  			
  			//dialog deny button
  			$('.dialog_button.deny').bind('click', function() {
  				settings.denyCallback();
  				hideDialog();
  			});
  			
  			//select combobox close button
  			$('.close_dialog').bind('click', function(){
  				hideDialog();
  			});
		
  			adjustDialogPosition();
  			
  			//dialog showing
  			$(".dialog_container").addClass("on"); 
  		}
		
		function adjustDialogPosition(){
			var dialog=$(".dialog_container");
			if(dialog.length>0){
				var win_dims=getActualSectionDimensions("window");
				var dialog_left_margin=(win_dims.width-parseInt(dialog.css("width")))/2 ;
	  			var dialog_top_margin=(win_dims.height-parseInt(dialog.css("height")))/2;
	  			
	  			//dialog container positioning
	  			dialog.css({
	  				  top:dialog_top_margin+"px",
	  				  left:dialog_left_margin+"px"
	  			});
			}
		}
		
		function hideDialog(){
			hideOverlay();
		}
		
		function login(){
			return true;
        }
	
	    function enter(){
	    	goNth(1);
	    	$('#appML_toolbar').show();
        }
	

	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Translation functions	
	    
	    var appml=null;
	    
	    function generateId(){
	    	max_id++;
	    	return "appML_auto_"+max_id;
	    }
	    
	    function getOrGenerateId($elem){
	    	var id=$elem.attr("id");
	    	if(id!=null && id.length>0)
	    		return id;
	    	else
	    		return generateId();
	    }
	    
	    function getAppmlAttribute(element, attribute){
	    	var attr=element.attr(attribute);
	    	if(attr==null || attr.length==0)
	    		attr=element.attr("data-appml-"+attribute);
	    	if(attr==null || attr.length==0)
	    		return null;
	    	else
	    		return attr;
	    }

	    function getAppMLDiv(appml_tag, outer_div_id, outer_div_class, default_inner_html){
	    	var tag = appml.find(appml_tag);
	    	if(tag.length==0)
	    		return null;
	    	
	    	// get appml tag name from selector
	    	if(appml_tag[0]=="#" || appml_tag[0]==".")
	    		appml_tag=appml_tag.substring(1,appml_tag.length);
	    	
	    	var has_id=(outer_div_id!=null && outer_div_id.length>0);
	    	var has_class=(outer_div_class!=null && outer_div_class.length>0);
	    	var has_default_html=(default_inner_html!=null && default_inner_html.length>0);
	    	var class_section = (appml_tag=="top" || appml_tag=="left" || appml_tag=="bottom" || appml_tag=="right") ? " appML_section" : "";
	    	var attr=getAppmlAttribute(tag, "scrollable");
	    	var class_scrollable = ((attr!=null && attr=="false") || 
	    			(attr==null && (appml_tag=="top" || appml_tag=="bottom" || appml_tag=="navigation" || appml_tag=="toolbar")) ) ? "" : " scrollable";
	    	var class_autofill = ((appml_tag=="navigation" || appml_tag=="toolbar" || appml_tag=="left") && tag.html().length==0) ? " appML_auto_fill" : "";
	    	attr=getAppmlAttribute(tag, "width");
	    	var div_width=(attr!=null) ? attr : ((appml_tag=="top" || appml_tag=="bottom") ? "100%" : "");
	    	attr=getAppmlAttribute(tag, "height");
	    	var div_height=(attr!=null) ? attr : ((appml_tag=="left" || appml_tag=="right") ? "100%" : "");
	    	var its_class=(tag.attr("class")!=null && tag.attr("class").length>0) ? tag.attr("class") : "";
	    
	    	var html_str="<div id='"+(has_id ? outer_div_id : "appML_"+appml_tag)+"' class='appML_div"+class_section+class_scrollable+class_autofill+
	    		(its_class.length>0 ? " "+its_class : "")+(has_class ? " "+outer_div_class+"'" : "'")+
	    		(div_width.length>0 ? " data-appml-width='"+div_width+"'" : "")+ (div_height.length>0 ? " data-appml-height='"+div_height+"'" : "")+
				((appml_tag=="left" || appml_tag=="right") ? " style='float:"+appml_tag+";'" : "")+"></div>";
	    	
	    	var html=$(html_str);
	    	if(tag.html().length>0)
	    		copyContent(tag,html);
	    	else if(has_default_html)
	    		html.append($(default_inner_html));
	    	return html;
	    }
	    
	    function getContentFloatStyle(){
	    	var left=(appml.children("left").length>0);
	    	var right=(appml.children("right").length>0);
	    	if(left && (!right))
	    		return " style='float:right;'";
	    	else if((!left) && right)
	    		return " style='float:left;'";
	    	else if(left && right)
	    		return " style='float:left;'";
	    	else
	    		return "";
	    }

	    function getPageHtml($page){
	    	var id=getOrGenerateId($page);
	    	id=" id='"+id+"'";
	    	var title=getAppmlAttribute($page, "title");
	    	title = (title!=null) ? " data-appml-title='"+title+"'" : "";
	    	var attr=getAppmlAttribute($page,"scrollable");
	    	var class_scrollable = (attr!=null && attr=="false") ? "" : " scrollable";
	    	return "<div  "+id+title+" class='appML_page"+class_scrollable+"' data-appml-width='100%' data-appml-height='100%'>"+$page.html()+"</div>";  //  class='scrollable'
	    }

	    function getPanelHtml($panel, standard_tags){
	    	var id=getOrGenerateId($panel);
	    	var wrapper_id=" id='"+id+"_wrapper'";
	    	id=" id='"+id+"'";
	    	
	    	var title=getAppmlAttribute($panel,"title");
	    	title = (title!=null) ? " data-title='"+title+"'" : "";
	    	 
	    	var icon=getAppmlAttribute($panel,"icon");
	    	icon = (icon!=null) ? " data-icon='"+icon+"'" : "";

	    	var html="<div "+wrapper_id+title+icon+"><div "+id+" class='appML_panel appML_div'>";
	    	
	    	var prefix="";
	    	if(standard_tags)
	    		prefix=".appml-";
	    	var pages=$panel.children(prefix+"page").each(function(){
	    		html+=getPageHtml($(this));
	    	});

	    	html+="</div></div>";

	    	return html;
	    }
	    	
	    function getPanelsHtml(standard_tags){
	    	var html="";
	    	var id_prefix="";
	    	var class_prefix="";
	    	if(standard_tags){
	    		id_prefix="#";
		    	class_prefix=".appml-";
	    	}
	    	var panels=appml.find(id_prefix+"content").children(class_prefix+"panel").each(function(){
	    		html+=getPanelHtml($(this), standard_tags);
	    	});
	    	return html;
	    }
	    
	    function copyContent($from, $to){
	    	$from.contents().appendTo($to);
	    }
	    
	    function copyContentAndReplace($from, $to){
	    	copyContent($from,$to);
	    	$from.replaceWith($to);
	    }
	    
	    function replaceScrollable(){
	    	var $this=$(this);
	    	var id=getOrGenerateId($this);
	    	var new_div=$("<div/>").attr("id",id).addClass("scrollable");
	    	var scrollable_dims=0;
	    	var dim=getAppmlAttribute($this,"width");
	    	if(dim!=null){
	    		new_div.attr("data-appml-width",dim);
	    		scrollable_dims++;
	    	}
	    	dim=getAppmlAttribute($this,"height");
	    	if(dim!=null){
	    		new_div.attr("data-appml-height",dim);
	    		scrollable_dims++;
	    	}
	    	if(scrollable_dims==0){
	    		// let's manage here default, in the case one insert a scrollable elem without specifying any dimension.
	    	}
	    	copyContentAndReplace($this,new_div);
	    }

	    function getCarouselNavigatorDiv(elems){
	    	var nav_div="<div class='carousel_nav'>";
	    		nav_div+="<div class='carousel_prev'>&larr; prev</div>";
	    		
		    	nav_div+="<ul class='carousel_indicator'>";
		    	var sel_index=1;
		    	for(i=1;i<=elems.length;i++)
		    		nav_div+="<li"+((i==sel_index) ? " class='selected'" : "")+">"+i+"</li>";
		    	nav_div+="</ul>";
		    	
		    	nav_div+="<div class='carousel_next'>&rarr; next</div>";
	    	nav_div+="</div>";
	    	return nav_div;
	    }
	    
	    function replaceCarousel(){
	    	var $this=$(this);
	    	var elems=$this.find("li");
	    	if(elems.length==0){
	    		$this.replaceWith($("<div/>"));
	    		return;
	    	}
	    	
	    	var id=getOrGenerateId($this);
	    	var container_div=$("<div/>").addClass("carousel_container");
	    	var wrapper_div=$("<div/>").attr("id",id+"_wrapper").addClass("carousel_wrapper");
	    	var w=getAppmlAttribute($this,"width");
	    	if(w!=null)
	    		wrapper_div.attr("data-appml-width",w);
	    	var h=getAppmlAttribute($this,"height");
	    	if(h!=null)
	    		wrapper_div.attr("data-appml-height",h);
	    	var dir=getAppmlAttribute($this,"direction");
	    	if(dir!=null)
	    		wrapper_div.attr("data-appml-direction",dir);
	    	var carousel_div=$("<div/>").attr("id",id).addClass("carousel_scroller iscroll").html($this.html());
	    	var navigation_div=$(getCarouselNavigatorDiv(elems));
	    	
	    	wrapper_div.append(carousel_div);
	    	container_div.append(wrapper_div);
	    	container_div.append(navigation_div);
	    	
	    	$this.replaceWith(container_div);
	    }
	    
	    function setLoadingAppML(is_loading){
	    	if(is_loading){
	    		$("#appML_body_div").css("opacity","0");
	    		$("#appML_loading").show();
	    	}
	    	else{
	    		$("#appML_loading").hide();
	    		$("#appML_body_div").css("opacity","100");
	    	}
	    }
	    
	    function translateAppML(){
	    	
		    var prefix="";
	    	appml=$("appml");
		    if(appml.length==0){
		    	appml=$("#appml");
		    	if(appml.length==0)
		    		return;
		    	else
		    		prefix="#";
		    }
		    
		    appML_ready_fn=getAppmlAttribute(appml,"onready");
		    if(appML_ready_fn==null){
		    	var in_body=$('body').attr("data-appml-onload");
		    	if(in_body!=null)
		    		appML_ready_fn=in_body;
		    }
		    
		    var class_prefix="";
		    if(prefix.length>0)
		    	class_prefix=".appml-";
		    appml.find(class_prefix+"scrollable").each(replaceScrollable);
		    appml.find(class_prefix+"carousel").each(replaceCarousel);
		    
	    	var loading_html=getAppMLDiv(prefix+"loading",null,null,"<div class='appMLLoading'><div style='text-align:center'><img src='appML_loading.gif' style='margin:0px auto'></div></div>");
		    var top_html=getAppMLDiv(prefix+"top");
		    var left_html=getAppMLDiv(prefix+"left");
		    var right_html=getAppMLDiv(prefix+"right");
		    var bottom_html=getAppMLDiv(prefix+"bottom");
		    var navigation_html=getAppMLDiv(prefix+"navigation","appML_navigation_bar","expand_width");
		    var toolbar_html=getAppMLDiv(prefix+"toolbar",null,"expand_width");
		    var panels_html=$(getPanelsHtml(prefix.length>0));
		    	
		    var body_html=$("<div class='appml_root_div'></div>");
		    body_html.append($("<div id='appML_size_tester' style='position:absolute; z-index:-1; opacity:0;filter:alpha(opacity=0);'></div>"));
		    if(loading_html!=null)
	    		body_html.append(loading_html);
    
		    var body_div=$("<div id='appML_body_div' style='position:absolute; z-index:1;'></div>");

	    	if(top_html!=null)
    			body_div.append(top_html);
    		if(left_html!=null)
    			body_div.append(left_html);
	    		
	    	var app_container=$("<div id='appML_body_app_container' class='appML_section' "+getContentFloatStyle()+"></div>");

    		if(navigation_html!=null)
    			app_container.append(navigation_html);
	    	
    		var content_wrapper=$("<div id='appML_content_wrapper'></div>");
    		var content=$("<div id='appML_content'></div>");
	    	if(panels_html!=null)
				content.append(panels_html);
    		content.appendTo(content_wrapper);
    		content_wrapper.appendTo(app_container);
    		
			if(toolbar_html!=null)
				app_container.append(toolbar_html);
			
			
			app_container.appendTo(body_div);
	    		
    		if(right_html!=null)
    			body_div.append(right_html);
    		if(bottom_html!=null)
    			body_div.append(bottom_html);
	    		
    		body_div.appendTo(body_html);
		    appml.remove();
		    appml=null;
		    $('body').append(body_html);
	    }
		

	    
	    
	    
	    
	    
	    
	  
	    
	    
	    
	    
	    
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Init functions
		
	    
	    function initHtmlBody(){
			
			$('body').prepend('<div id="overlayContainer"></div>');
			
		}
		
		function initHtmlElements(){

			$('.select_filter').livequery('click', function(){
			 	$(":focus").blur();
		    	var option_text;
		    	var sel;
		    	var val;
		    	var options_html="";
		    	var $select=$(this).next();
		    	var select=$select.get(0);
		    	
		    	for(var i=0; i<select.options.length; i++){
		    		option_text=$(select.options[i]).text();
		    		val=select.options[i].value;
		    		sel=(select.options[i].selected==true) ? "selected" : "";
		    		option_html="<div class='select_options "+sel+"' data-optionValue='"+val+"' >"+option_text+"</div>";
		    		options_html+=option_html;
		    	}
		    	var sel_title=$select.attr("data-title");
		    	showDialog({
		    		type: "select",
		    		select_options:options_html,
		    		title: sel_title
				});
		    	
	
	    		$(".select_options").bind("click",function(){
	
	    			$(".select_options").removeClass("selected");
	    			$(this).addClass("selected");
	    			selected_value=$(this).attr("data-optionValue");
	    			for(var i=0; i<select.options.length; i++){
	    				if(select.options[i].value==selected_value){
	    					select.options.selectedIndex=i;
	    				}
	    			}
	    			hideDialog();
	    		});
				
		    });
			
			
			// login
			$('span a').click(function() {
		        if(login())
		           enter();
		        else
		            showDialog("login failed");       
		    });
			

			// input managment
			
			$("input:visible, textarea:visible").livequery(function(){
				var input=$(this);
				var filter_height=parseInt(input.height()+2);
				var eraser_offset=parseInt(input.width()-10);
				(input.next().get(0)) ? input.next().remove() : "";
				(input.prev().get(0)) ? input.prev().remove() : "";
				if(input.attr("type")!="checkbox" && input.attr("type")!="radio"){
					if(input.attr("type")!="textarea") input.parent().append('<div class="input_eraser" style="left:'+eraser_offset+'px"></div>');
					input.parent().prepend("<div class='input_filter' style='height:"+filter_height+"px'></div>");
				}
			});
		
			$("input[type=checkbox]:visible , input[type=radio]:visible").livequery(function(){
				var input=$(this);
				input.parent().append("<span class='checkAndRadioLabel'>"+input.attr("data-appml-label")+"</span>");
			});
			
		
			$(".input_eraser").livequery("click",function(){
				$(this).prev().attr("value","");
				$(this).hide();
			});
			
			$("input:focus, textarea:focus").livequery("blur",function(){
				($(this).attr("value")!="") ? $(this).next().show() : $(this).next().hide(); 
			});
			
			
			$(".input_filter").livequery("click",function(e){
				if($(this).attr("type")=="radio" || $(this).attr("type")=="checkbox")
				$("input:visible").each(function(){
					if($(this).attr("type")!="radio" && $(this).attr("type")!="checkbox")
						($(this).attr("value")!="") ? $(this).next().show() : $(this).next().hide(); 
				});
				$el=$(e.target);
				var input=$el.next();
				input.focus();
			});	
			
			$("select:visible").livequery(function(){
				$(this).attr("disabled","disabled");
				var filter_height=parseInt($(this).height()+9);
				$(this).parent().prepend("<div class='select_filter' style='height:"+filter_height+"px'></div>");
			});
			
		}
		
		this.init = function() {
			
			translateAppML();
			
			setLoadingAppML(true);
		    
			$(".expand_width").each(function(){ this.style.width="100%"; });
			$(".expand_height").each(function(){ this.style.height="100%"; });

			//setPanelsDimensions();
			
			initHtmlBody();

			pages_number=$(options.selector).children().length;
			if(pages_number==1)
				$("#appML_toolbar").hide();
			if(settings.start_page>pages_number-1){
				settings.start_page=pages_number-1;
			}
			
			$(options.selector).children().each(function(index,child){	
				injectTitlePage($(this).attr("data-title"),$(this).attr("data-loginPanel"),index);
				var menu_url = ($(this).attr("data-loginPanel")=="true") ? "logout" : "#"+$(this).find(":first-child").attr("id");
				injectMenuItems($(this).attr("data-title"),$(this).attr("data-icon"),menu_url,index);
				pages_array.push($(this));
				if(index!=settings.start_page)
					$(this).hide();
				$(this).css("position","absolute","overflow","hidden");
				$(this).css("width","100%");
				$(this).html("<div class='appManagerPage'>"+$(this).html()+"</div>");
			});
			
			setElementAsSelected(current_page);

			initHtmlElements();

			//setHeight();	
			if(settings.login) $('#appML_toolbar').hide();
			
		};
		
		this.start = function(){
			$(".scrollable").livequery(printScrollable);
			
			//refreshDimensions("appML.startEnd();");
			
			$(window).bind('onorientationchange' in window ? 'orientationchange' : 'resize', function (e) { appML.screenResize(); });
			$(document).bind('touchmove', function (e) { e.preventDefault(); });
			$("a").bind('click', function (e) { e.preventDefault(); }); // per evitare il #id nei browser...
			this.adjustToScreen(appML_ready_fn+"; setLoadingAppML(false);ifYouCanShowAdd2Home() ");

			$('.iscroll:visible').livequery(updateIScroll);   
			$('.iscroll_dialog:visible').livequery(createDialogScroll,deleteIScroll);  
			$('.carousel_scroller').livequery(adjustCarousel);
		};
		
		function ifYouCanShowAdd2Home(){
			$("script").each(function(){
				if($(this).attr("src"))
					if($(this).attr("src").indexOf("add2home.js")!=-1)
						showAdd2Home();
			});
		}
		
		
		
		
		$(window).load(/*one('ready',*/function(){
			
			appML=new $.appManager({ 
				selector:"#appML_content",
				transaction_duration     : 200,
				header                   : true,
				page_out_effect          : 'fade',    //blind, bounce, clip, explode, fold, highlight, puff, pulsate, scale, shake, size, slide
				page_in_effect           : 'fade',
				header_out_effect        : 'fade',    
				header_in_effect         : 'fade',
				between_effects_delay    : 300,
				start_page               : 0,
				menu_top_margin		     : 0,
				menu_left_margin         : 10,
				banner 				     : false,
				login                    : false
		    });
			
			appML.init(); 
			var screen_sizes=screen.width+','+screen.height;
			var home_icon;
			(location.pathname.indexOf("iPhone")!=-1)? home_icon="iPhone_icon.png" : home_icon="iPad_icon.png";
			jQT = new $.jQTouch({
				icon: home_icon,
				addGlossToIcon: false,
				startupScreen: 'hicApp.png',
				statusBar: 'black',
				preloadImages: []
			});
		   	jQT.init();
		   	
			appML.start();
			//*/
		});

		
		
		
		
		
		
		
		
		
		
		
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Public functions				
		
	    
		this.appManagerShowDialog=function(options){
			showDialog(options);
		};
		
		this.appManagerShowLoading=function(){
			showLoading();
		};
		this.appManagerHideLoading=function(){
			hideLoading();
		};
		
		this.adjustToScreen = function (callback_fn){
			var resize=setPanelsDimensions();
			if(resize)
				refreshDimensions(callback_fn);
			else
				updateScroll();
			adjustDialogPosition();
			if(!resize)
				executeFunction(callback_fn);
		};
		
		this.screenResize = function(){
			refreshDimensions(null,true);
			this.adjustToScreen();
		};
		
		this.goTo = function(url,animation){
			goUrl(url,animation);
		};
		
		this.isInCurrentPanel = function(page_id_or_hash){
			return isPageInCurrentPanel(page_id_or_hash);
		};
		
		this.appMLGetPanels = function(){
			return getPanels();
		};
		
		this.animatePages = function(fromPage, toPage, animation, backwards){
			animate(fromPage, toPage, animation, backwards);
		};
		
		this.iScrollDomModified = function($elem){
			//var id=$elem.attr("id");
			//console.log("DOM MODIFIED on iScroll "+id);
		};
		
		this.translateBody = function(){
			translateAppML();
		};
		
		this.landscapeScreen = function(){
			return isLandscape();
		};
		
		this.manageParentMove = function(iScroll, move_x, move_y){
			manageIScrollParentMove(iScroll, move_x, move_y);
		};
		
		this.manageTouchStart = function(iScroll, point, time){
			manageIScrollTouchStart(iScroll, point, time);
		};

	};
	
	
	
	
}(jQuery));

var appML;
var jQT;



