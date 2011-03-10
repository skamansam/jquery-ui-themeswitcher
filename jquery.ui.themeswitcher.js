/* jQuery UI ThemeSwitcher widget
 * Rewriiten from jQuery themeswitchertool (http://jqueryui.com/docs/Theming/ThemeSwitcher)
 * Rewrite by Samuel C. Tyler
---------------------------------------------------------------------*/

( function( $, undefined ) {
$.widget('ui.themeswitcher',{
		options: {
			loadTheme: null,
			initialText: 'Switch Theme',
			width: undefined,
			height: undefined,
			buttonHeight: 14,
			buttonPreText: 'Theme: ',
			closeOnSelect: true,
			cookieName: 'jquery-ui-theme',
			onOpen: function(obj) {},
			onClose: function(obj) {},
			onSelect: function(obj) {},
			useStandard:true,
			cssPrefix:"http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.10/themes/",
			cssSuffix:"/jquery-ui.css",
			imgPrefix:"http://static.jquery.com/ui/themeroller/images/themeGallery/theme_90_",
			imgSuffix:".png",
			imageLocation:"/javascripts/jquery/themeswitcher/",
			themes:{},
			useCookie:true,
			cookieOptions:{},
			disableTheme:[],
			selectOnStart:true
		},
		button:{},
		switcherpane:{},
		hasStarted:false,
		_create: function() {
			this.namespace="jquery-ui-themeswitcher-";
			this.switcherpaneID=this.namespace+'switcherpane';
			this.buttonID=this.namespace+'button';
			this.iconID=this.namespace+'icon';
			this.titleID=this.namespace+'title';			
			
			if(this.options.useStandard)
				this.addTheme(this.getStandard());
			
			window.themeswitcher=$(this);
			
			var self=this;
			this.button = $('<a href="#" id="'+this.buttonID+'">'+
					'<span id="'+this.iconID+'"></span>'+
					'<span id="'+this.titleID+'">'+ this.options.initialText +'</span></a>')
					.appendTo($(this.element))
					.data('ts_obj',this)
					.bind('click.'+this.widgetName, function(e){self.toggleSwitcher(e,self)});
			
			//create the list
			var theme_ul=$("<ul></ul>");
			for (var i in this.options.themes) {
				if($.inArray(i,this.options.disableTheme)) continue;
				css=this.options.themes[i].css || this.options.cssPrefix+i+this.options.cssSuffix;
				img=this.options.themes[i].icon || this.options.imgPrefix+i.replace('-','_')+this.options.imgSuffix;
				img=$("<img src='"+img+"' title='"+i+"' alt='"+img+"'/>");
				txt=$("<span class='themeName''>"+i+"</span>");
				li=$('<li title="'+css+'"></li>').append(img).append(txt)
				.bind('click', function(e){
					self.themeName = $(this).find('.themeName').text();
					self.updateCSS($(this).attr('title'));
					self.options.onSelect(self);
				});
				theme_ul.append(li);
			}
			this.switcherpane=$('<div id="'+this.switcherpaneID+'"></div>').append($('<div id="themeGallery"></div>').append(theme_ul))
				.appendTo($(this.element)).hide().css('width',this.button.width()+6)
				.hover(function(){},function(){self.hideSwitcher()});
          if( this.options.useCookie && ($.cookie(this.options.cookieName) || this.options.loadTheme) ){
	        this.themeName = $.cookie(this.options.cookieName) || this.options.loadTheme;
    	    this.switcherpane.find('li:contains('+ this.themeName +')').trigger('click');
   		  }

		},
		destroy:function(){
			this.element.children().remove();
		},
		refresh:function(){
		},
		updateCSS:function(locStr){
			if(jQuery("head link#ui-theme").length==0)
		        jQuery("head").append(jQuery('<link href="" type="text/css" rel="Stylesheet" id="ui-theme" />'));
	        jQuery("head link#ui-theme").attr('href',locStr);
		    $('#'+this.titleID).text( this.options.buttonPreText + this.themeName );
	        if(this.options.useCookie){
	        	 $.cookie(this.options.cookieName, this.themeName,this.options.cookieOptions);
	        }
	        if(this.options.selectOnStart && this.hasStarted) this.options.onSelect(this);else this.hasStarted=true;
	        if(this.options.closeOnSelect && this.switcherpane.is(':visible')){ this.hideSwitcher(); }
	        return false;
	 			
		},
		toggleSwitcher: function(e){
			if($(this.switcherpane).is(':visible'))
				this.hideSwitcher();
			else
				this.showSwitcher();
		},
		showSwitcher: function() {
			$(this.switcherpane).slideDown();
			this.options.onOpen(this);
		},
		hideSwitcher: function() {
			$(this.switcherpane).slideUp();
			this.options.onClose(this);
		},
		addTheme:function(opts){
			$.extend(this.options.themes,opts);
		},
		getStandard: function() {
			return {
				'base':{icon:this.options.imageLocation+"base.png"},'black-tie':{},
				'blitzer':{}, 'cupertino':{}, 'dark-hive':{}, 'dot-luv':{},
				'eggplant':{},'excite-bike':{},'flick':{},'hot-sneaks':{},
				'humanity':{},'le-frog':{},
				'mint-choc':{icon:this.options.imgPrefix+"mint_choco"+this.options.imgSuffix,css:this.options.cssPrefix+"mint-choco"+this.options.cssSuffix},
				'overcast':{}, 'pepper-grinder':{},
				'redmond':{icon:this.options.imgPrefix+"windoze"+this.options.imgSuffix},'smoothness':{},
				'south-street':{},'start':{icon:this.options.imgPrefix+'start_menu'+this.options.imgSuffix},
				'sunny':{},'swanky-purse':{},
				'trontastic':{},
				'ui-darkness':{icon:this.options.imgPrefix+'ui_dark'+this.options.imgSuffix,css:this.options.cssPrefix+'dark'+this.options.cssSuffix},
				'ui-lightness':{icon:this.options.imgPrefix+"ui_light"+this.options.imgSuffix,css:this.options.cssPrefix+"ui-light"+this.options.cssSuffix}
			}
		}//getStandard
}
);}( jQuery ) );


/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        
        options = options || {};
        
        if (value === null) {value = '';options.expires = -1;}
        
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') 
                date = (new Date()).setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            else 
                date = options.expires;
            
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
        
    }

}
