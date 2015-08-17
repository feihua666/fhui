/*
* jQuery	插件
*
* 作者         :飞华
  QQ           :654593600
  着手时间     :2015年2月13日 16:46:51
  完成时间     :
  修订历史     :

  使用方法     :
  备注         :

  plugin URI :
  Version    :*/
+function ($)
{
	'use strict';

	// 命名空间
	var pluginNS = 'fhuiScroll';

		// 插件前缀
	var	pluginPfx = 'fhScroll';

		// 默认选择器
	var	defaultSelector = '.fhui-scroll';

		// default options
	var	defaults = {
		scroll : 'v',//哪个方向使用滚轮,h为水平方向，v为垂直方向
		axis   : 'h,v', //哪个方向添加,h为水平方向，v为垂直方向
		delta  : 40,//滚轮的速度
		easing : 'fhuiEaseOut',//效果
		dur    : 1000//动画时间，默认值1000ms
	};
		/* validates selector (if selector is invalid or undefined uses the default one) */
		// 验证选择器（如果选择器不合法或未定义，则使用默认的）
	var	_selector = function () {
			return (typeof $(this) !== 'object' || $(this).length < 1) ? defaultSelector : this;
		};
	var isScrolling = false;
		// 通过字面量创造一个对象，存储我们需要的共有方法
	var	methods = {
			// 在字面量对象中定义每个单独的方法
			// 插件的初始化方法，创建 插件数据对象和参数
			init: function (options) {

				// 验证选择器
				var selector = _selector.call(this);

				// 为了更好的灵活性，对来自主函数，并进入每个方法中的选择器其中的每个单独的元素都执行代码
				return $(selector).each(function () {
					// 为每个独立的元素创建一个jQuery对象
					var $this = $(this);

					if (!$this.data(pluginPfx)) {
						// 保存我们新创建的settings
						// 深度拷贝重载默认参数
						$this.data(pluginPfx, $.extend(true,{},defaults,$.fhui.getData($this),options));
					}

					var _options = $this.data(pluginPfx);
					
					var contener = $('<div class="fhui-scroll-contener"><div class="fhui-scroll-content"></div></div>');
					if(!$this.data('children.' + pluginPfx)){
						$this.data('children.' + pluginPfx,$this.children());
					}
					
					var children = $this.data('children.' + pluginPfx);
					var content = $('.fhui-scroll-content',contener);

					

					content.append(children);
					$this.append(contener);
					//添加滚动条
					$.each(_options.axis.split(','),function(i,axis){
						updateScroll[axis].call($this,contener);
					});

					//绑定滚轮滚动
					contener.on('mousewheel.fhui-scroll', function(e, delta) {
						e.preventDefault();
						//e.stopPropagation();
						delta *= _options.delta;
						$.each(_options.scroll.split(','),function(i,scroll){
							mousewheelScroll[scroll].call($this,content,delta*-1,_options);
						});
					}).on('mouseover.fhui-scroll',function(){
						if(isScrolling === true) return;
						scrollVisible.show.call($this);
					}).on('mouseout.fhui-scroll',function(){
						if(isScrolling === true) return;
						scrollVisible.hide.call($this);
					});
					
					var horizontalScrollBar = $('.fhui-scroll-horizontal-bar',this);
					var verticalScrollBar = $('.fhui-scroll-vertical-bar',this);
					//水平拖拽
					horizontalScrollBar.fhuiDraggable({
						axis :'x',
						cursor:'pointer',
						start : function (){
							isScrolling = true;
						},
						drag : function(){
							mousewheelScroll.h.call($this,content,0,_options);
						},
						stop : function(){
							isScrolling = false;
						}
					});
					//垂直拖拽

					verticalScrollBar.fhuiDraggable({
						axis :'y',
						cursor:'pointer',
						start : function (){
							isScrolling = true;
						},
						drag : function(){
							mousewheelScroll.v.call($this,content,0,_options);
						},
						stop : function(){
							isScrolling = false;
						}
					});
					//默认隐藏滚动条
					scrollVisible.hide.call($this);
				});

			},
			//添加内容，参数为一个jquery元素对象
			append: function (con) {
				// 验证选择器
				var selector = _selector.call(this);
				// 对选择器每个元素都执行方法
				return $(selector).each(function () {
					// 执行代码
					var $this = $(this);
					var contener = $('>.fhui-scroll-contener',$this);
					var content = $('>.fhui-scroll-content',contener);
					content.append(con);
					methods.update.call(this);
				});

			},
			//更新滚动条，如果添加了内容可以更新以适应
			update: function () {
				// 验证选择器
				var selector = _selector.call(this);
				// 对选择器每个元素都执行方法
				return $(selector).each(function () {
					// 执行代码
					var $this = $(this);
					var _options = $this.data(pluginPfx);
					var contener = $('>.fhui-scroll-contener',$this);
					$.each(_options.axis.split(','),function(i,axis){
						updateScroll[axis].call($this,contener);
					});
				});

			},
			destroy: function () {
				// 验证选择器
				var selector = _selector.call(this);
				// 对选择器每个元素都执行方法
				return $(selector).each(function () {
					// 执行代码
					var $this = $(this);
					var horizontalScrollBar = $('.fhui-scroll-horizontal-bar',$this);
					horizontalScrollBar.fhuiDraggable('disable');
					var verticalScrollBar = $('.fhui-scroll-vertical-bar',$this);
					verticalScrollBar.fhuiDraggable('disable');
					$this.off('mousewheel.fhui-scroll');
					$this.html($this.data('children.' + pluginPfx));
					$this.removeData('children.' + pluginPfx);
					$this.removeData(pluginPfx);
				});

			}
		};
	var scrollVisible = {
		hide : function(){
			$('.fhui-scroll-horizontal',this).stop().fadeOut();
			$('.fhui-scroll-vertical',this).stop().fadeOut();
		},
		show : function(){
			$('.fhui-scroll-horizontal',this).stop().fadeIn();
			$('.fhui-scroll-vertical',this).stop().fadeIn();
		}
	};
	//添加滚动条
	var updateScroll = {
		h: function(contener){
			var horizontalScroll = $('>.fhui-scroll-horizontal',contener);
			if(horizontalScroll && horizontalScroll.length > 0){
				//如果存在
			}else{
				horizontalScroll = $('<div class="fhui-scroll-horizontal"><div class="fhui-scroll-horizontal-bar"></div></div>');
				contener.append(horizontalScroll);
			}
			var content = $('.fhui-scroll-content',this);
			$('.fhui-scroll-horizontal-bar',this).width(this.width()*(this.width()/content.outerWidth(true)));
		},
		v:function(contener){
			var verticalScroll = $('>.fhui-scroll-vertical',this);
			if(verticalScroll && verticalScroll.length > 0){
				//如果存在
			}else{
				verticalScroll = $('<div class="fhui-scroll-vertical"><div class="fhui-scroll-vertical-bar"></div></div>');
				contener.append(verticalScroll);
			}

			var content = $('.fhui-scroll-content',this);
			$('.fhui-scroll-vertical-bar',this).height(this.height()*(this.height()/content.outerHeight(true)));
		}
	};
	//滚轮滚动
	var mousewheelScroll = {
		h : function(content,delta,cfg){
				var horizontalScrollBar = $('.fhui-scroll-horizontal-bar',this);
				var left = (horizontalScrollBar.position().left + delta);
				left = left < 0 ? 0 : (left + horizontalScrollBar.outerWidth() > horizontalScrollBar.parent().width() ? horizontalScrollBar.parent().width() - horizontalScrollBar.outerWidth() : left);
				horizontalScrollBar.stop().animate({left : left},cfg.dur,cfg.easing);
				content.stop().animate({left : -1*content.outerWidth() * left/(horizontalScrollBar.parent().width())},cfg.dur,cfg.easing);
		},
		v : function(content,delta,cfg){
				var verticalScrollBar = $('.fhui-scroll-vertical-bar',this);
				var top = (verticalScrollBar.position().top + delta);
				top = top < 0 ? 0 : (top + verticalScrollBar.outerHeight() > verticalScrollBar.parent().height() ? verticalScrollBar.parent().height() - verticalScrollBar.outerHeight() : top);

				verticalScrollBar.stop().animate({top : top},cfg.dur,cfg.easing);
				
				content.stop().animate({top : -1*content.outerHeight() * top/(verticalScrollBar.parent().height())},cfg.dur,cfg.easing);
			}
	};

	// 设置为jquery 对象插件
	// usage: $(selector).{pluginNS}();
	$.fn[pluginNS] = function () {

		// 获取我们的方法，遗憾的是，如果我们用function(method){}来实现，这样会毁掉一切的
		var method = arguments[0];

		var _arguments = arguments;
		// 检验方法是否存在
		if (methods[method]) {

			// 如果方法存在，存储起来以便使用
			// 注意：我这样做是为了等下更方便地使用each（）
			method = methods[method];

			// 因为方法存在，所以参数索引从1开始 arguments[0] 为方法名
			_arguments = Array.prototype.slice.call(arguments,1)
		// 如果方法不存在，检验对象是否为一个对象（JSON对象）或者method方法没有被传入
		}else if (typeof(method) == 'object' || !method) {
			// 如果我们传入的是一个对象参数，或者根本没有参数，init方法会被调用
			method = methods.init;

		}else {
			// 如果方法不存在或者参数没传入，则报出错误。需要调用的方法没有被正确调用
			$.error('Method ' +  method + ' does not exist on jQuery.fn.' + pluginNS);
			return this;

		}
        // 调用我们选中的方法
        // 再一次注意我们是如何将each（）从这里转移到每个单独的方法上的
		return method.apply(this,_arguments);

	}
	// 设置为jquery 插件
	// usage: $.{pluginNS}();
	$[pluginNS] = function (method) {
		if (methods[method]) {

			return methods[method].apply(this,Array.prototype.slice.call(arguments,1));

		}else if (typeof method === 'object' || !method) {

			return methods.init.apply(this,arguments);

		}else {

			$.error('Method ' + method + ' does not exist on jQuery.' + pluginNS);
			return this;

		}
	};
	// 暴露默认参数选项
	// e.g.: $(document).ready(function(){ $.{pluginNS}.defaults.{attr}=500; });
	$[pluginNS].defaults = defaults;

	// 添加到window,一般用来判断插件是否加载完成
	// usage: if(window.{pluginNS}){console.log("{pluginNS} plugin loaded");}
	if (window) window[pluginNS] = true;

	// window load 完成后，初始化默认插件
	// 这样可以不用写js，直接在dom元素上写默认的选择器就可以初始化插件
	$(window).load(function () {

		// 根据默认的选择器加载插件
		$(defaultSelector)[pluginNS]();

	});

}(jQuery);
