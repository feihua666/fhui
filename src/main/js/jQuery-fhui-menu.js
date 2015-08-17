/*
* jQuery	插件
*
* 作者         :飞华
  QQ           :654593600
  着手时间     :2015年2月28日 14:46:22
  完成时间     :2015年2月28日 17:00:23
  修订历史     :

  使用方法     :
  备注         :

  plugin URI :
  Version    :*/
+function ($)
{
	'use strict';

	// 命名空间
	var pluginNS = 'fhuiMenu';

		// 插件前缀
	var	pluginPfx = 'fhMenu';

		// 默认选择器
	var	defaultSelector = '.fhui-menu';

		// default options
	var	defaults = {
		triger:"eager"//菜单触发的方式，lazy,eager
	};
		/* validates selector (if selector is invalid or undefined uses the default one) */
		// 验证选择器（如果选择器不合法或未定义，则使用默认的）
	var	_selector = function () {
			return (typeof $(this) !== 'object' || $(this).length < 1) ? defaultSelector : this;
		};

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
					// 执行代码
					// 例如： privateF();
					menu.call(null,$this,_options,$this);
					
					$(document).on('mouseup.fhui-menu',function(){
						$('ul',$this).hide();
					});
				});

			}
		};
		//生成菜单
		var menu = function(ulObj,_options,$this){
			ulObj.addClass('fhui-menu');
			ulObj.children('li').each(function(){
				var li = $(this);
				li.addClass('fhui-menu-item');
				li.children().each(function(){
					if($(this)[0].nodeName.toLowerCase() == "a"){
						$(this).addClass('fhui-menu-link');
						_triger[_options.triger].call(null,li);
						
						
					}else if($(this)[0].nodeName.toLowerCase() == "ul"){
						li.addClass('fhui-menu-group');
						var ul = $(this);
						ul.parent().children('a').eq(0).append($('<span class="fhui-icon fhui-icon-right"></span>'));
						triger[_options.triger].call(null,li,ul);
						ul.hide();
						menu.call(null,ul,_options,$this);
					}
					
				});
			});
		};
	var _triger = {
		eager : function(li){
			li.children('a').eq(0).on('mouseenter.fhui-menu',function(){
				li.parent().find("ul").hide();
			});
		},
		lazy : function(li){
			if(li.children('ul').length === 0)
			li.children('a').eq(0).click(function(){
				li.parent().find("ul").hide();
			});
		}
	};
	var triger = {
		eager : function(li,ul){
			ul.parent().children('a').eq(0).on('mouseenter.fhui-menu',
			function(){
				clearTimeout(ul.data("timeout"));
				show.call(null,ul);
			}).on('mouseleave.fhui-menu',
			function(e){
				e.stopPropagation() 
				clearTimeout(ul.data("timeout"));
				var timeout = setTimeout(function(){
						ul.hide();
					},300);
					ul.data("timeout",timeout);
				});
			ul.on('mouseenter.fhui-menu',
				function(){
					clearTimeout(ul.data("timeout"));
				}).on('mouseleave.fhui-menu',
				function(e){
					e.stopPropagation() 
					clearTimeout(ul.data("timeout"));
					var timeout = setTimeout(function(){
							ul.hide();
						},300);
					ul.data("timeout",timeout);
				});
		},
		lazy : function(li,ul){
			ul.parent().children('a').eq(0).click(function(){
				if(ul.is(":hidden")){
					show.call(null,ul);
				}else{
					ul.hide();
				}
				
			});
		}
	};
	var show = function(ul){
			ul.parent().parent().find("ul").hide();
			ul.show();
			ul.css({
			left:ul.parent().parent().outerWidth(),
			top:ul.parent().offset().top-ul.parent().parent().offset().top
			});
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
