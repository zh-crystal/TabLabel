(function(){
	var Tab = function(tab){
		var _this_ = this;

		this.tab = tab;

		this.config = {
			"triggerType":"mouseover",
            "effect":"default",
            "invoke":1,
            "auto":false
		}

		if(this.getConfig()){
			$.extend(this.config, this.getConfig());
		}

		this.tabItems = this.tab.find("ul.tab-nav li");
		this.conItems = this.tab.find("div.content-wrap div.content-item");

		var config = this.config;

		if(config.triggerType === "click"){
			this.tabItems.click(function(){
				_this_.invoke($(this));
			});
		}else{
			this.tabItems.mouseover(function(){
				var self = $(this);
				this.timer = window.setTimeout(function(){
					_this_.invoke(self);
				},300);
			}).mouseout(function(){
				window.clearTimeout(this.timer);
			});
		}

		if(config.auto){
			this.timer = null;
			this.loop = 0;

			this.autoPlay();

			this.tab.hover(function(){
				window.clearInterval(_this_.timer);
			},function(){
				_this_.autoPlay();
			});
		}

		if(config.invoke > 1){
			this.invoke(this.tabItems.eq(config.invoke-1));
		}
	};

	Tab.prototype = {
		getConfig:function(){
			var config = this.tab.attr('data-config');

			if(config && config != ""){
				return $.parseJSON(config);
			}else{
				return null;
			}
		},
		invoke:function(currentTab){
			var _this_ = this;
			var index = currentTab.index();

			currentTab.addClass("actived").siblings().removeClass("actived");

			var effect = this.config.effect;
			var conItems = this.conItems;
			if(effect === "fade"){
				conItems.eq(index).fadeIn().siblings().fadeOut();
			}else{
				conItems.eq(index).addClass("current").siblings().removeClass("current");
			}

			if(this.config.auto){
				this.loop = index;
			}
		},
		autoPlay:function(){
			var _this_ = this;
			var tabItems = this.tabItems;
			var tabLength = tabItems.length;
			var config = this.config;

			this.timer = window.setInterval(function(){
				_this_.loop++;
				if(_this_.loop >= tabLength){
					_this_.loop = 0;
				}

				tabItems.eq(_this_.loop).trigger(config.triggerType);
			}, config.auto);
		}
	};

	// Tab.init = function(tabs){
	// 	var _this_ = this;
	// 	tabs.each(function(){
	// 		new _this_($(this));
	// 	});
	// }

	$.fn.extend({
		tab:function(){
			this.each(function(){
				new Tab($(this));
			});
			return this;
		}
	});

	window.Tab = Tab;
})();