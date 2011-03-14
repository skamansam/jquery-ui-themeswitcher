/* jQuery UI ThemeSwitcher widget
 * Rewritten from jQuery themeswitchertool (http://jqueryui.com/docs/Theming/ThemeSwitcher)
 * Rewrite by Samuel C. Tyler <sam@rbe.homeip.net>
---------------------------------------------------------------------*/

( function( $, undefined ) {
$.widget('ui.themeswitcher',{
		options: {
			loadTheme: null,
			initialText: 'Switch Theme',
			width: null,
			height: null,
			pHeight:null,
			pWidth:null,
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
			disableThemes:[],
			enableThemes:[],
			selectOnStart:true,
			isThemable:false,
			autoDetect:true
		},
		button:{},
		switcherpane:{},
		hasStarted:false,
		_create: function() {
			if(this.options.useStandard)
				this.addTheme(this.getStandard());
			
			var self=this;
			
			
			//bind events
			$(this).bind('open',function(evt){this.options.onOpen(evt,self)});
			$(this).bind('close',function(evt){this.options.onClose(evt,self)});
			$(this).bind('select',function(evt){this.options.onSelect(evt,self)});

			this.button = $('<a href="#" class="jquery-ui-themeswitcher-button"></a>')
					.appendTo($(this.element))
					.bind('click.'+this.widgetName, function(e){self.toggleSwitcher(e,self)});
			this.icon=$('<span class="jquery-ui-themeswitcher-button-icon"></span>').appendTo($(this.button));
			this.buttontext=$('<span class="jquery-ui-themeswitcher-button-text">'+ this.options.initialText +'</span></a>')
					.appendTo($(this.button));
			
			$(this.element).mouseleave(function(){self.hideSwitcher()});

			//create the list
			var theme_ul=$("<ul></ul>");
			
			for (var i in this.options.themes) {

				if( jQuery.inArray(i,this.options.disableThemes) != -1 ) continue;	//skip if disabled
				if( this.options.enableThemes.length!=0 && jQuery.inArray(i,this.options.enableThemes) == -1 ) continue;	//skip if disabled

				css=this.options.themes[i].css || this.options.cssPrefix+i+this.options.cssSuffix;
				img=this.options.themes[i].icon || this.options.imgPrefix+i.replace('-','_')+this.options.imgSuffix;
				img=$("<img src='"+img+"' title='"+i+"' alt='"+img+"'/>");
				txt=$("<span class='themeName'>"+i+"</span>");
				li=$('<li title="'+css+'"></li>').append(img).append(txt)
				.hover(function(){
					$(this).addClass(self.options.isThemable?'ui-state-hover':'hover')
				},function(){
					$(this).removeClass(self.options.isThemable?'ui-state-hover':'hover')
				})
				.bind('click', function(e){
					self.themeName = $(this).find('.themeName').text();
					self.updateCSS($(this).attr('title'));
					//self.trigger('select');
				});
				theme_ul.append(li);
			}
			
			//create the pane which holds the items
			this.switcherpane=$('<div class="jquery-ui-themeswitcher-switcherpane"></div>')
				.append(theme_ul)
				.appendTo($(this.element)).hide();
			
			//set the dimensions
			if(this.options.width) $(this.button).css("width",''+this.options.width+'px');
			if(this.options.height) $(this.button).css("width",''+this.options.height+'px');
			if(this.options.pWidth) $(this.switcherpane).css("width",this.options.pWidth+'px');
			if(this.options.pHeight) $(this.switcherpane).css("width",this.options.pWeight+'px');
			
			//change classes if themable
			if(!this.options.isThemable){
				$(this.element).addClass('notheme');
			}else{
				$(this.button).addClass('ui-button ui-widget ui-state-default ui-corner-all');
				$(this.icon).addClass('ui-icon ui-icon-triangle-1-s');
				$(this.switcherpane).addClass('ui-tabs-panel ui-widget-content ui-corner-bottom');
				$(this.switcherpane).find('li').addClass('ui-button ui-widget ui-state-default');
			}

			//handle cookies
			if( this.options.useCookie && ($.cookie(this.options.cookieName) || this.options.loadTheme) ){
				this.themeName = $.cookie(this.options.cookieName) || this.options.loadTheme;
				this.switcherpane.find('li:contains('+ this.themeName +')').trigger('click');
			}
			
			//auto-detection of current theme
			if(!this.options.loadTheme && this.options.autoDetect)
				this._detectTheme();

		},
		_detectTheme:function(){
			var self=this;
			var links=[];
			$('head link').each(function(){
				links.push($(this).attr('href'));
			});
			$(this.switcherpane).find('li').each(function(){
					if($.inArray($(this).attr('title'),links)>=0){
						self.themeName=$(this).children('.themeName').text();
						self._handleSelect();
					}
			});
			if(this.themeName)
				$(this.buttontext).text( this.options.buttonPreText + this.themeName );
				
			
		},
		_handleSelect:function(){
 			if(!this.options.selectOnStart && this.hasStarted)
				$(this).trigger('select',this);
			else
				this.hasStarted=true;
			if(this.options.selectOnStart)
				$(this).trigger('select',this);
		},
		_getSortedHashKeys:function(hash){
			var ret=[];
			for(var key in hash) ret.push(key);
			ret.sort();
			return ret;
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
		    $(this.buttontext).text( this.options.buttonPreText + this.themeName );
	        
	        if(this.options.useCookie)
	        	 $.cookie(this.options.cookieName, this.themeName,this.options.cookieOptions);
	        
			this._handleSelect();

	        if(this.options.closeOnSelect)
	        	this.hideSwitcher();
	        
	        return false;
	 			
		},
		toggleSwitcher: function(e){
			if($(this.switcherpane).is(':visible'))
				this.hideSwitcher();
			else
				this.showSwitcher();
		},
		showSwitcher: function() {
			if(!$(this.switcherpane).is(':visible')){
				$(this.button).addClass('active');
				$(this.switcherpane).slideDown();
				$(this).trigger('open',this);
			}
		},
		hideSwitcher: function() {
			if($(this.switcherpane).is(':visible')){
				$(this.button).removeClass('active');
				$(this.switcherpane).slideUp();
				$(this).trigger('close',this);
			}
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
})
})( jQuery );


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
