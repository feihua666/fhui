/*!
 * feihuaui v1.0.0 (feihua666@sina.com)
 * Copyright 2014-2016 feihua
 */

if (typeof jQuery === 'undefined') {
  throw new Error('feihuaui\'s JavaScript requires jQuery')
}

+function ($) {
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
    throw new Error('feihuaui\'s JavaScript requires jQuery version 1.9.1 or higher')
  }
}(jQuery);

/**
* jQuery fhui common
* jQuery 插件 fhui的通用工具
*  
* 作者：飞华
* 2014年2月22日 11:20:05
*/
+function ($) {
	'use strict';

	/*
		fhui实用工具
	*/
	var _zIndex = 1000;
    var Fhui = {
		//定义默认的data属性，使用如:<div data-options="{test:'test'}"></div>
		options :"options",
		getData : function (selector) {
			var data = $(selector).data(Fhui.options);
			if(typeof data == "string"){
				if(data.indexOf('{') === 0){
					
				}else{
					data = '{' + data + '}';
				}
				data = eval('(' +data+ ')');
			}
			return data;
		},
		
		zIndex : function () {
			_zIndex = _zIndex >= 1000 ? (_zIndex = _zIndex +1) : 1000;
			return _zIndex;
		},
		//清除选中的文本
		clearSelection : function () {
			if (document.selection && document.selection.empty) {
					document.selection.empty();
				}
				else if (window.getSelection) {
					var sel = window.getSelection();
					sel.removeAllRanges();
				}
		},
		//禁止选中文本，一般是拖拽中使用
		disableSelection : function () {
			var selectstart = "onselectstart" in document.createElement( "div" );
			$('html').bind( ( selectstart ? "selectstart" : "mousedown" ) +
			".fhui-disableSelection", function( event ) {
				event.preventDefault();
			});
		},
		//允许选中文本，一般在拖拽完成后使用
		enableSelection : function () {
			$('html').unbind( ".fhui-disableSelection" );
		},
		//页面滚动条(上下滚动)到
		//selectorOrValue参数可以是css选择器或数值
		//scrollSelector 要滚动的区域css选择器。默认为body
		scrollTo : function (selectorOrValueTo,scrollSelector) {
			var obj;
			var valueTo = 0;
			if (!isNaN(selectorOrValueTo)) {
				valueTo = selectorOrValueTo;
			}else {
				 obj= $(selectorOrValueTo);
			}
			if (obj && obj.length>0) {
				 var scroll_offset = obj.offset();
				 valueTo = scroll_offset.top;
			}
			var scrollObj = $("body,html");
			if (scrollSelector) {
				scrollObj = $(scrollSelector);
			}
			scrollObj.animate({
				scrollTop:valueTo
				},10);
		},
		//定时器
		//fn执行函数，time时间，多长时间执行一次,单位毫秒，times执行次数，0为无限次
		timer : function (fn,time,times) {
			var _times = 0;
			//默认次数为无限次
			if(!times){
				times = 0;
			}
			//默认间隔时间为一秒钟
			if(!time){
				time = 1000;
			}
			var t= setInterval(function () {
				if (fn && typeof fn == "function") {
					fn.call(null,_times);
					_times ++;
					//如果到了执行次数
					if (_times==times) {
						clearInterval(t);
					}
				}else{
					clearInterval(t);
				}
			},time);
			return t;
		},
		//获取url参数，如果url不指定，则获取当前url参数
		getUrlParam : function (name, url) {
			//构造一个含有目标参数的正则表达式对象
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
			var r;
			if (url) {
				r = url.substr(url.indexOf("?"));
			} else {
				r = window.location.search; 
			}
			//匹配目标参数
			r = r.substr(1).match(reg);
			//返回参数值
			if (r != null){ 
				return decodeURI(r[2])
			}
			return null; 
		},
		//当前浏览器是否支持html5
		isHtml5Support : function () {
			if (typeof(Worker) !== "undefined") {
				return true;
			} else {
				return false;
			}
		},
		//判断给定的url图像，加载完成后调用回调函数
		imageLoad : function (src,fn) {
			var image = new Image();
			image.src = src;
			image.onload = function () {
				fn.call(null,image);
			}
			image.onerror = function () {
				fn.call(null);
			}
		},
		/*
			@param selector jquery支持的选择器符号
			@param position 边框的位置，合法的值为：left,right,top,bottom,left-right,right-left,top-bottom,bottom-top,不填写是返回一个边框对象
			@return 以像素为单位返回边框的大小 其中position参数的组合返回两个位置边框大小的和
		*/
		getBorderSize : function (selector,position) {
			var cssAttr = {left:'border-left-width',top:'border-top-width',right:'border-right-width',bottom:'border-bottom-width'};
			return getCssSize(selector,position,cssAttr);
		},
		/*
			@param selector jquery支持的选择器符号
			@param position padding的位置，合法的值为：left,right,top,bottom,left-right,right-left,top-bottom,bottom-top,不填写是返回一个padding数据对象
			@return 以像素为单位返回padding的大小 其中position参数的组合返回两个位置padding大小的和
		*/
		getPaddingSize : function (selector,position) {
			var cssAttr = {left:'padding-left',top:'padding-top',right:'padding-right',bottom:'padding-bottom'};
			return getCssSize(selector,position,cssAttr);
		},
		/*
			@param selector jquery支持的选择器符号
			@param position margin的位置，合法的值为：left,right,top,bottom,left-right,right-left,top-bottom,bottom-top,不填写是返回一个margin数据对象
			@return 以像素为单位返回margin的大小 其中position参数的组合返回两个位置margin大小的和
		*/
		getMarginSize : function (selector,position) {
			var cssAttr = {left:'margin-left',top:'margin-top',right:'margin-right',bottom:'margin-bottom'};
			return getCssSize(selector,position,cssAttr);
		}
	};
	//获取css属性值
	var getCssSize = function (selector,position,cssAttr) {
		var target = $(selector);
		var top = parseInt(target.css(cssAttr.top),10) || 0;
		var right = parseInt(target.css(cssAttr.right),10) || 0;
		var bottom = parseInt(target.css(cssAttr.bottom),10) || 0;
		var left = parseInt(target.css(cssAttr.left),10) || 0;
		if (position) {
			var result = 0;
			switch(position){
				case 'top':
					result = top;
					break;
				case 'right':
					result = right;
					break;
				case 'bottom':
					result = bottom;
					break;
				case 'left':
					result = left;
					break;
				case 'left-right':
				case 'right-left':
					result = left + right;
					break;
				case 'top-bottom':
				case 'bottom-top':
					result = top + bottom;
					break;
			
			}
			return result;
		}else{
			return {
				top:top,
				right:right,
				bottom:bottom,
				left:left
			};
		}
	};
	
	$.fhui = Fhui;
	
	//扩展
	$.fn.extend({
		_paddingLeft : function () {
			return Fhui.getPaddingSize(this,'left');
		},
		_paddingRight : function () {
			return Fhui.getPaddingSize(this,'right');
		},
		_paddingTop : function () {
			return Fhui.getPaddingSize(this,'top');
		},
		_paddingBottom : function () {
			return Fhui.getPaddingSize(this,'bottom');
		},
		_marginLeft : function () {
			return Fhui.getMarginSize(this,'left');
		},
		_marginRight : function () {
			return Fhui.getMarginSize(this,'right');
		},
		_marginTop : function () {
			return Fhui.getMarginSize(this,'top');
		},
		_marginBottom : function () {
			return Fhui.getMarginSize(this,'bottom');
		},
		_borderLeft : function () {
			return Fhui.getBorderSize(this,'left');
		},
		_borderRight : function () {
			return Fhui.getBorderSize(this,'right');
		},
		_borderTop : function () {
			return Fhui.getBorderSize(this,'top');
		},
		_borderBottom : function () {
			return Fhui.getBorderSize(this,'bottom');
		},
		//右击
		_rightClick : function (fn) {
			var $this = this;
			//调用这个方法后将禁止系统的右键菜单 
			$(document).bind('contextmenu',function(){ 
			return false; 
			}); 
			//为这个对象绑定鼠标按下事件 
			return this.each(function(){
					$(this).mouseup(function (e) { 
						//如果按下的是右键，则执行函数 
						if (3 == e.which) { 
							fn.call($this,e); 
							e.stopPropagation()
						} 
					}); 
				}
			);
		},
		//双击
		_dbClick : function (fn) {
			this.dblclick(fn);
		},
		//判断当前对象是否为空
		_isEmpty : function() {
			var result = true;
			if(this && this.length > 0){
				result = false;
			}else{
				result = true;
			}
			return result;
		}
	});
	//动画效果，曲线运动
		$.extend($.easing, {
		fhuiLinear : function (e,t,b,c,d){
			return c*t/d + b;
		},
		fhuiLinearOut : function (e,t,b,c,d){
			t/=d; t--; return c * Math.sqrt(1 - t*t) + b;
		},
		fhuiEaseInOutSmooth : function (e,t,b,c,d){
			t/=d/2;
			if(t<1) return c/2*t*t + b;
			t--;
			return -c/2 * (t*(t-2) - 1) + b;
		},
		fhuiEaseInOutStrong : function (e,t,b,c,d){
			t/=d/2;
			if(t<1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
			t--;
			return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
		},
		fhuiEaseInOut : function (e,t,b,c,d){
			t/=d/2;
			if(t<1) return c/2*t*t*t + b;
			t-=2;
			return c/2*(t*t*t + 2) + b;
		},
		fhuiEaseOutSmooth : function (e,t,b,c,d){
			t/=d; t--;
			return -c * (t*t*t*t - 1) + b;
		},
		fhuiEaseOutStrong : function (e,t,b,c,d){
			return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
		},
		fhuiEaseOut : function (e,t,b,c,d){
			var ts=(t/=d)*t,tc=ts*t;
			return b+c*(0.499999999999997*tc*ts + -2.5*ts*ts + 5.5*tc + -6.5*ts + 4*t);
		}
	});
}(jQuery);

/*
* jQuery	插件
*
* 作者         :飞华
  QQ           :654593600
  着手时间     :2015年2月28日 17:03:02
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
	var pluginNS = 'fhuiContextmenu';

		// 插件前缀
	var	pluginPfx = 'fhContextmenu';

		// 默认选择器
	var	defaultSelector = '.fhui-contextmenu';

		// default options
	var	defaults = {
		target : null
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
					if(_options.target == null) return;
					var target = $(_options.target);
					target.fhuiMenu();
					target.hide();
					$this._rightClick(function(e){
						target.show();
						target.fhuiPosition({
							of:e,
							my:'left top',
							collision:'fit'
						})
					});
					$(document).on('mouseup.fhui-contextmenu',function(){
						target.hide();
					});
				});

			},

			destroy: function () {
				// 验证选择器
				var selector = _selector.call(this);
				// 对选择器每个元素都执行方法
				return $(selector).each(function () {
					// 执行代码
				});

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

/*
* jQuery	插件
*
* 作者         :飞华
  QQ           :654593600
  着手时间     :2015年3月3日 15:42:49
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
	var pluginNS = 'fhuiDialog';

		// 插件前缀
	var	pluginPfx = 'fhDialog';

		// 默认选择器
	var	defaultSelector = '.fhui-dialog';

		// default options
	var	defaults = {
		header         : '',    //窗口标题文本，可以添加html元素
		footer         : '',    //窗口footer
		width          : 500,   //默认宽度
		height         : 300,   //默认高度
		icon           :'',
		draggable      : true,  //是否可拖拽
		resizable      : true,  //是否可拖拽
		closable       : true,  //是否可关闭
		minimizable    : true,  //是否可最小化
		maximizable    : true,  //是否可最大化
		model          : false, //默认模态对话
		onclose        : null,  //一关闭执行的回调函数
		afterclose     : null,  //一关闭后执行的回调函数
		onminimize     : null,  //一最小化执行的回调函数
		afterminimize  : null,  //最小化后执行的回调函数
		onmaximize     : null,  //一最大化执行的回调函数
		aftermaximize  : null   //一最大化后执行的回调函数
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
					}else{
						return;
					}

					var _options = $this.data(pluginPfx);
					$this.addClass('fhui-dialog');
					// 执行代码
					// 例如： privateF();
					var innerHtml = $this.html();
					//组件
					var htmlObj = $('<div class="fhui-dialog-header"><div class="fhui-dialog-icon"></div><div class="fhui-dialog-title"></div><div class="fhui-dialog-tool"></div></div><div class="fhui-dialog-content"></div><div class="fhui-dialog-footer"></div>');
					//添加组件
					$this.empty().append(htmlObj);
					//内容容器
					var content = $('.fhui-dialog-content',$this);
					content.html(innerHtml);
					//header
					var header = $('.fhui-dialog-header',$this);
					$('.fhui-dialog-title',header).html(_options.header);
					//footer
					var footer = $('.fhui-dialog-footer',$this);
					if(_options.footer && _options.footer !== ''){
						footer.append($(_options.footer));
					}else{
						footer.hide();
					}
					//tool
					var tool = $('.fhui-dialog-tool',$this);
					if(_options.closable === true){
						tool.append($('<div class="fhui-dialog-close"><span class="fhui-icon fhui-icon-remove"></span></div>'));
						$('.fhui-dialog-close',header).click(function(){
							methods.hide.call($this);
						});
					}
					//大小
					$this.css({
						width:_options.width,
						height:_options.height
					});
					//content 大小
					content.css({
						height : $this.height() - header.outerHeight() - (footer.is(':hidden')? 0 : footer.outerHeight()),
						width: $this.width() 
					});
					//draggable
					if(_options.draggable === true){
						$this.fhuiDraggable({
							handle : '.fhui-dialog-title',
							iframeFix : true
						});
					}
					if(_options.resizable === true){
						$this.fhuiResizable({
							resize : function(){
								//content 大小
								content.css({
									height : $this.height() - header.outerHeight() - (footer.is(':hidden')? 0 : footer.outerHeight()),
									width: $this.width() 
								});

							}
						});
					}
					if(_options.model === true){
						var mask = $('<div class="fhui-dialog-mask"></div>');
						mask.css('z-index',$this.css('z-index'));
						mask.insertBefore($this);
						$this.data(pluginPfx + '.dialog-mask',mask);
					}
					methods.moveToTop.call($this);
					//向上一层
					$this.on('mousedown.fhui-dialog',function(){
						methods.moveToTop.call($this);
					});
					//居中
					$this.fhuiPosition({
						of : $(window),
						at : 'center',
						my : 'center'
					});
				});

			},

			show: function () {
				// 验证选择器
				var selector = _selector.call(this);
				// 对选择器每个元素都执行方法
				return $(selector).each(function () {
					// 执行代码
					var $this = $(this);
					$(this).show();
					if($this.data(pluginPfx + '.dialog-mask')){
						$this.data(pluginPfx + '.dialog-mask').show();
					}
				});

			},
			hide: function () {
				// 验证选择器
				var selector = _selector.call(this);
				// 对选择器每个元素都执行方法
				return $(selector).each(function () {
					// 执行代码
					var $this = $(this);
					var _options = $this.data(pluginPfx);
					if(typeof _options.onclose == 'function'){
						var re = _options.onclose.call($this);
						if(re === false) return;
					}
					
					$(this).hide();
					if($this.data(pluginPfx + '.dialog-mask')){
						$this.data(pluginPfx + '.dialog-mask').hide();
					}
					if(typeof _options.afterclose == 'function'){
						_options.afterclose.call($this);
					}
				});

			},
			moveToTop: function () {
				// 验证选择器
				var selector = _selector.call(this);
				// 对选择器每个元素都执行方法
				return $(selector).each(function () {
					// 执行代码
					var $this = $(this);
					$(this).css({
						zIndex : $.fhui.zIndex
					});
					if($this.data(pluginPfx + '.dialog-mask')){
						$this.data(pluginPfx + '.dialog-mask').css('z-index',$(this).css('z-index'));
					}
				});

			},
			remove: function () {
				// 验证选择器
				var selector = _selector.call(this);
				// 对选择器每个元素都执行方法
				return $(selector).each(function () {
					// 执行代码
					var $this = $(this);
					if($this.data(pluginPfx + '.dialog-mask')){
						$this.data(pluginPfx + '.dialog-mask').remove();
					}
					$(this).remove();
				});

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
/*
* jQuery	插件
*
* 作者         :飞华
  QQ           :654593600
  着手时间     :2015年3月3日 17:43:07
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
	var pluginNS = 'fhuiAlert';

		// 插件前缀
	var	pluginPfx = 'fhAlert';

		// 默认选择器
	var	defaultSelector = '.fhui-alert';

		// default options
	var	defaults = {
		header         : '',    //窗口标题文本，可以添加html元素
		message        : '',    //提示内容
		width          : 270,   //默认宽度
		height         : 130,   //默认高度
		draggable      : false, //是否可拖拽
		closable       : true,  //是否可关闭
		model          : true   //默认模态对话
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
					}else{
						return;
					}

					var _options = $this.data(pluginPfx);
					$this.addClass('fhui-alert');
					if(_options.message !== ''){
						$this.html(_options.message);
					}
					var button = $('<button class="fhui-button">确定</button>');
					$this.fhuiDialog({
						header : _options.header,
						footer : button,
						width : _options.width,
						height: _options.height,
						draggable : _options.draggable,
						resizable : false,
						closable : _options.closable,
						model : _options.model,
						onclose : function(){
							$this.fhuiDialog('remove');
							return false;
						}
					});
					button.click(function(){
						$this.fhuiDialog('remove');
					});
				});

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
	$[pluginNS] = function () {
		var alert = $('<div></div>');
		$('body').append(alert);
		return methods.init.apply(alert,arguments);
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
/*
* jQuery	插件
*
* 作者         :飞华
  QQ           :654593600
  着手时间     :2015年3月3日 17:43:07
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
	var pluginNS = 'fhuiConfirm';

		// 插件前缀
	var	pluginPfx = 'fhConfirm';

		// 默认选择器
	var	defaultSelector = '.fhui-confirm';

		// default options
	var	defaults = {
		header         : '',    //窗口标题文本，可以添加html元素
		message        : '',    //提示内容
		width          : 270,   //默认宽度
		height         : 130,   //默认高度
		draggable      : false, //是否可拖拽
		closable       : true,  //是否可关闭
		model          : true,  //默认模态对话
		sure           : null   //确定回调
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
					}else{
						return;
					}

					var _options = $this.data(pluginPfx);
					$this.addClass('fhui-confirm');
					if(_options.message !== ''){
						$this.html(_options.message);
					}
					var buttonHtmlObj = $('<button class="fhui-button">确定</button><button class="fhui-button">取消</button>');
					var button = buttonHtmlObj.eq(0);
					var cancel = buttonHtmlObj.eq(1);
					$this.fhuiDialog({
						header : _options.header,
						footer : buttonHtmlObj,
						width : _options.width,
						height: _options.height,
						draggable : _options.draggable,
						resizable : false,
						closable : _options.closable,
						model : _options.model,
						onclose : function(){
							$this.fhuiDialog('remove');
							return false;
						}
					});
					button.click(function(){
						if(typeof _options.sure == 'function'){
							_options.sure.call($this);
						}
						$this.fhuiDialog('remove');
					});
					cancel.click(function(){
						$this.fhuiDialog('remove');
					});
				});

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
	$[pluginNS] = function () {
		var confirm = $('<div></div>');
		$('body').append(confirm);
		return methods.init.apply(confirm,arguments);
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
/*
* jQuery	插件
*
* 作者         :飞华
  QQ           :654593600
  着手时间     :2015年3月3日 17:43:07
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
	var pluginNS = 'fhuiPrompt';

		// 插件前缀
	var	pluginPfx = 'fhPrompt';

		// 默认选择器
	var	defaultSelector = '.fhui-prompt';

		// default options
	var	defaults = {
		header         : '',    //窗口标题文本，可以添加html元素
		width          : 270,   //默认宽度
		height         : 130,   //默认高度
		draggable      : false, //是否可拖拽
		closable       : true,  //是否可关闭
		model          : true,  //默认模态对话
		sure           : null   //确定回调
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
					}else{
						return;
					}

					var _options = $this.data(pluginPfx);
					$this.addClass('fhui-prompt');
					$('> textarea',$this).addClass('fhui-dialog-textarea');
					var buttonHtmlObj = $('<button class="fhui-button">确定</button><button class="fhui-button">取消</button>');
					var button = buttonHtmlObj.eq(0);
					var cancel = buttonHtmlObj.eq(1);
					$this.fhuiDialog({
						header : _options.header,
						footer : buttonHtmlObj,
						width : _options.width,
						height: _options.height,
						draggable : _options.draggable,
						resizable : false,
						closable : _options.closable,
						model : _options.model,
						onclose : function(){
							$this.fhuiDialog('remove');
							return false;
						}
					});
					button.click(function(){
						if(typeof _options.sure == 'function'){
							_options.sure.call($this,$('.fhui-dialog-textarea',$this).val());
						}
						$this.fhuiDialog('remove');
					});
					cancel.click(function(){
						$this.fhuiDialog('remove');
					});
				});
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
	$[pluginNS] = function () {
		var prompt = $('<div><textarea></textarea></div>');
		$('body').append(prompt);
		return methods.init.apply(prompt,arguments);
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
/*
* jQuery	插件
*
* 作者         :飞华
  QQ           :654593600
  着手时间     :2014年12月26日 12:00:58
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
	var pluginNS = 'fhuiDraggable';

		// 插件前缀
	var	pluginPfx = 'fhDraggable';

		// 默认选择器
	var	defaultSelector = '.fhui-draggable';

		// default options
	var	defaults = {
		revert       : false,      //拖拽结束是否回到原始位置
		speed        : 300,        //回到原始位置速度
		proxy        : false,      //是否使用代理
		axis         : null,       //方向y,x
		zIndex       : null,       //垂直层叠次序
		cursor       : 'move',  //拖拽时鼠标样式
		handle       : null,       //拖拽的位置，默认为无，整体
		iframeFix    : false,      //拖拽时是否添加考虑iframe,默认不考虑
		//回调函数
		start        : null,       //拖拽开始函数
		drag         : null,       //拖拽中函数
		stop         : null        //拖拽停止函数
	};
		/* validates selector (if selector is invalid or undefined uses the default one) */
		// 验证选择器（如果选择器不合法或未定义，则使用默认的）
	var	_selector = function () {
			return (typeof $(this) !== 'object' || $(this).length < 1) ? defaultSelector : this;
		};
	var body = $('body');
	//iframe遮罩
	var	iframeFix = function () {
			$('iframe').each(function(){
				var iframeParent = $(this).parent();
				var iframeFix = $('<div class="fhui-draggable-iframeFix" style="position:absolute;"></div>');
				iframeFix.css({
					'left':$(this).offset().left,
					'top':$(this).offset().top,
					'width':$(this).outerWidth(true),
					'height':$(this).outerHeight(true)
				}).appendTo(iframeParent);
				//遮罩层的位置再次调整
				if($(this).offset().left != iframeFix.offset.left){
					iframeFix.css({
						'left':$(this).position().left,
						'top':$(this).position().top
					});
				}
			});
		};
	
	//移除iframe遮罩
	var	removeIframeFix = function(){
			$('.fhui-draggable-iframeFix').remove();
		};
	//还原默认样式
	var restoreCursor = function(){
		var bodyCursor = body.data('oldCursor.' + pluginPfx);
		if(bodyCursor){
			body.css('cursor',bodyCursor == 'auto' ? '' : bodyCursor);
		}
		var thisCusor = this.data('oldCursor.' + pluginPfx);
		if(thisCusor){
			this.css('cursor',thisCusor == 'auto' ? '' : thisCusor);
		}
	};
	//添加鼠标样式
	var cursor = function (cursor){
		body.css('cursor',cursor);
		this.css('cursor',cursor);
	};
	
	var isDragging = false;
	// 通过字面量创造一个对象，存储我们需要的共有方法
	var	methods = {
			// 在字面量对象中定义每个单独的方法
			// 插件的初始化方法，创建 插件数据对象和参数
			init: function (options) {

				// 验证选择器
				var selector = _selector.call(this);
				//缓存body鼠标样式
				if(body.css('cursor')){
					body.data('oldCursor.' + pluginPfx,body.css('cursor'));
				}
				// 为了更好的灵活性，对来自主函数，并进入每个方法中的选择器其中的每个单独的元素都执行代码
				return $(selector).each(function () {
					// 为每个独立的元素创建一个jQuery对象
					var $this = $(this);
					//缓存自己鼠标样式
					if($this.css('cursor')){
						$this.data('oldCursor.' + pluginPfx,$this.css('cursor'));
					}
					if (!$this.data(pluginPfx)) {
						// 保存我们新创建的settings
						// 深度拷贝重载默认参数
						$this.data(pluginPfx, $.extend(true,{},defaults,$.fhui.getData($this),options));
					}
					var _options = $this.data(pluginPfx);
					
					if(_options.handle == null){
						_options.handle = $this;
					}else{
						_options.handle = $(_options.handle,$this);
					}
					$this.data('handle.' + pluginPfx,_options.handle);
					//添加draggable class以供droppable默认接收accept
					if(!$this.hasClass('fhui-draggable')){
						$this.addClass('fhui-draggable');
					}
					//被拖拽的对象
					var dragObj = $this;
					var dragStart = false;
					_options.handle.on("mousedown.fhui-draggable",function (e) {
						if(isDragging === true) return;
						//禁用选择
						$.fhui.disableSelection();
						
						var offset = $this.offset();    //DIV在页面的位置
						var x = e.pageX - offset.left;  //获得鼠标指针离DIV元素左边界的距离
						var y = e.pageY - offset.top;   //获得鼠标指针离DIV元素上边界的距离
						//如果使用代理
						if(_options.proxy === true){
							dragObj = $this.clone().appendTo('body');
						}
						//如果考虑iframe
						if(_options.iframeFix === true){
							iframeFix.call(null);
						}
						isDragging = true;
						//拖拽前原始位置
						var originalPosition = {left:$this.position().left,top:$this.position().top};
						$(document).on("mousemove.fhui-draggable", function (e){
							//如果是resize不执行
							if($this.data('fhuiResize') && $this.data('fhuiResize') === true) return;
							//拖拽开始
							if(dragStart === false){
								dragStart = true;
								e.stopPropagation();
								dragMethods.start.call($this,_options,e,dragObj);
							}
							//拖拽中
							dragMethods.drag.call($this,_options,e,dragObj,x,y);
						});
						//拖拽结束
						$(document).on("mouseup.fhui-draggable",function (e) {
							dragStart = false;
							isDragging = false;
							dragMethods.stop.call($this,_options,e,dragObj,originalPosition);
							if (checkArea.call(_options.handle,e)){
								cursor.call(_options.handle,_options.cursor);
							} else {
							restoreCursor.call(_options.handle);
							}
						});
					}).on('mousemove.fhui-draggable',function (e){
						if(isDragging === true) return;
						if (checkArea.call($(this),e)){
							cursor.call($(this),_options.cursor);
						} 
					}).on('mouseleave.fhui-draggable', function(){
						if(isDragging === true) return;
						restoreCursor.call($(this));
					});
				});

			},

			disable : function () {
				// 验证选择器
				var selector = _selector.call(this);
				// 对选择器每个元素都执行方法
				return $(selector).each(function () {
					var $this = $(this);
					if( $this.data('handle.' + pluginPfx) ){
						$this.data('handle.' + pluginPfx).off('mousedown.fhui-draggable');
						$this.removeData('handle.' + pluginPfx);
					}
				});
			},
			enable : function () {
				return methods.init.call(this);
			}
		};
		// check if the handle can be dragged
		var checkArea =	function (e) {
				var handle = this;
				var offset = $(handle).offset();
				var width = $(handle).outerWidth();
				var height = $(handle).outerHeight();
				var t = e.pageY - offset.top;
				var r = offset.left + width - e.pageX;
				var b = offset.top + height - e.pageY;
				var l = e.pageX - offset.left;
				var edge = 0;
				//取消resize鼠标样式冲突
				if(handle.data('fhResizable')){
					edge = 5;
				}
				return Math.min(t,r,b,l) > edge;
			}
	var dragMethods = {
		start : function (cfg,e,dragTarget) {
			//停止动画
			dragTarget.stop();

			//设置z-index
			if(cfg.zIndex){
				dragTarget.data('zIndex',dragTarget.css('z-index'));
				dragTarget.css({ "zIndex":  cfg.zIndex});
			}
			//回调
			if(typeof cfg.start == 'function'){
				cfg.start.call(this,e,dragTarget);
			}
			this.trigger('start.fhui-droppable',[e,this]);
		},
		drag : function (cfg,e,dragTarget,x,y) {
			var offset = this.offset();
			var _x = e.pageX - x; //获得X轴方向移动的值
				_x -= offset.left - this.position().left;
			var _y = e.pageY - y; //获得Y轴方向移动的值
				_y -= offset.top - this.position().top;
			if(cfg.axis == null){
				dragTarget.css({ left: _x , top: _y});
			}else if(cfg.axis=="x"){
				dragTarget.css({ left: _x });
			}else if(cfg.axis=="y"){
				dragTarget.css({top: _y });
			}
			//回调
			if(typeof cfg.drag == 'function'){
				cfg.drag.call(this,e,dragTarget);
			}
			this.trigger('drag.fhui-droppable',[e,this]);
		},
		stop : function (cfg,e,dragTarget,originalPosition) {
			$(document).off("mousemove.fhui-draggable");
			$(document).off("mouseup.fhui-draggable");
			//移除iframe遮罩
			if(cfg.iframeFix === true){
				removeIframeFix.call(null);
			}
			dragTarget.css("cursor",'auto');
			//恢复css的z-index
			if(dragTarget.data('zIndex')){
				dragTarget.css({ "zIndex":  dragTarget.data('zIndex')});
			}
			if(cfg.revert === true){
				dragTarget.animate(originalPosition,cfg.speed,function(){
					$(this).css({
					left:originalPosition.left,
					top:originalPosition.top
					});
					//如果使用代理
					if(cfg.proxy === true){
						dragTarget.remove();
					}
				});
			}else{
				//如果使用代理
				if(cfg.proxy === true){
					dragTarget.remove();
				}
			}
			//启用选择
			$.fhui.enableSelection();
			//回调结束
			if(typeof cfg.stop == 'function'){
				cfg.stop.call(this,e,dragTarget);
			}
			this.trigger('stop.fhui-droppable',[e,this]);
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

/*
* jQuery	插件
*
* 作者         :飞华
  QQ           :654593600
  着手时间     :2015年2月9日 12:00:58
  完成时间     :2015年2月11日 16:27:14
  修订历史     :

  使用方法     :
  备注         :

  plugin URI :
  Version    :*/
+function ($)
{
	'use strict';

	// 命名空间
	var pluginNS = 'fhuiDroppable';

		// 插件前缀
	var	pluginPfx = 'fhDroppable';

		// 默认选择器
	var	defaultSelector = '.fhui-droppable';

		// default options
	var	defaults = {
		accept : ".fhui-draggable",  //可以接受的选择器
		start  : null, //拖拽开始时触发
		drag   : null, //拖拽时触发
		over   : null, //经过时触发
		leave  : null, //离开时触发
		drop   : null, //停止拖拽时触发
		stop   : null  //停止拖拽时触发
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
					$this.data('enabled.' + pluginPfx,true);
					$.each(['start','drag','stop'],function (i,ev){
						$(_options.accept).on(ev + '.fhui-droppable',function (e,we,that) {
							if($this.data('enabled.' + pluginPfx) === true)
							droppableMethods[ev].call($this,we,that,_options);
						});
					});
				});

			},
			enable : function () {
				// 验证选择器
				var selector = _selector.call(this);
				// 对选择器每个元素都执行方法
				return $(selector).each(function () {
					var $this = $(this);
					$this.data('enabled.' + pluginPfx,true);
				});
			},
			disable : function () {
				// 验证选择器
				var selector = _selector.call(this);
				// 对选择器每个元素都执行方法
				return $(selector).each(function () {
					var $this = $(this);
					$this.data('enabled.' + pluginPfx,false);
				});
			}
		};
	//记录当前鼠标拖拽对象到drop的对象
	var top = [];
	//为了为避免多次调整都遍历整个文档，加一个标识
	var isOrder = false;
	
	var droppableMethods = {
		start : function (e,that,cfg){
			if(typeof cfg.start == 'function'){
				cfg.start.call(this,e,that);
			}
			this.removeData('trigger-leave');
			this.removeData('trigger-over');
		},
		drag : function (e,that,cfg){
			var x = e.pageX;
			var y = e.pageY;
			var offset = this.offset();
			if(offset.left < x && offset.left + this.width() > x & offset.top < y && offset.top + this.height() > y){
				if(!this.data('trigger-over')){
					droppableMethods.over.call(this,e,that,cfg);
					this.data('trigger-over','trigger');
				}
			}else{
				if(!this.data('trigger-leave')){
					droppableMethods.leave.call(this,e,that,cfg);
					this.data('trigger-leave','trigger');
				}
			}
			if(typeof cfg.drag == 'function'){
				cfg.drag.call(this,e,that);
			}
		},
		over : function (e,that,cfg){
			this.removeData('trigger-leave');
			if(typeof cfg.over == 'function'){
				cfg.over.call(this,e,that);
			}
			//将自己添加
			top.push(this);
		},
		leave : function (e,that,cfg){
			this.removeData('trigger-over');
			if(typeof cfg.leave == 'function'){
				cfg.leave.call(this,e,that);
			}
			//leave后移除自己
			for(var i = 0;i < top.length;i++){
				if(top[i][0] == this[0]){
					top.splice(i,1);
				}
			}
		},
		stop : function (e,that,cfg){
			var x = e.pageX;
			var y = e.pageY;
			var offset = this.offset();
			if(offset.left < x && offset.left + this.width() > x & offset.top < y && offset.top + this.height() > y){
				droppableMethods.drop.call(this,e,that,cfg);
			}
			if(typeof cfg.stop == 'function'){
				cfg.stop.call(this,e,that);
			}
			
		},
		drop : function (e,that,cfg){
			//如果top中没有自己则不调用
			var exist = false;
			for(var i = 0;i < top.length;i++){
				if(top[i][0] == this[0]){
					exist = true;
				}
			}
			if(exist === false) return;
			var topElement = getTopElement(top);
			//如果是放到自己了，则触发drop
			if(topElement && topElement[0] == this[0] && typeof cfg.drop == 'function'){
				cfg.drop.call(this,e,that);
			}
			//leave后移除自己
			for(var j = 0;j < top.length;j++){
				if(top[j][0] == this[0]){
					top.splice(j,1);
				}
			}
			//重置
			isOrder = false;
		}
	};

	//获取drop元素
	var getTopElement = function(elementArray){
		var element;
		//var positionReg = (/^(?:a|f)/);
		var arraytemp = [];
		if(isOrder === false){
			//没有找到判断两个元素在文档中的顺序的好方法，调整顺序
			$('*').each(function(){
				var $this = $(this);
				for(var j = 0;j < elementArray.length; j++){
					if($this[0] == elementArray[j][0]){
						arraytemp.push(elementArray[j]);
					}
				}
			});
			elementArray = arraytemp;
			isOrder = true;
		}
		
		for(var i = 0;i < elementArray.length; i++){
			if(i === 0){
				element = elementArray[0];
			}else{
				//如果具有包含关系
				if($.contains(element[0],elementArray[i][0])){
					element = elementArray[i];
				}else{
					var currentZIndex = elementArray[0].css('z-index');
					if($.isNumeric(currentZIndex)){
						var elementZIndex = element.css('z-index');
						if($.isNumeric(elementZIndex)){
							//比较z-index
							if(currentZIndex > elementZIndex){
								element = elementArray[i];
							}
						}
						//当前有z-index是靠前
						else{
							element = elementArray[i];
						}
					}
					//如果当前没有z-index
					else {
						var _elementZIndex = element.css('z-index');
						//如果element也没有
						if(!$.isNumeric(_elementZIndex)){
							//比较文档顺序
							element = elementArray[i];
						}
					}
				}
			}
		}
		return element;
	}
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

/*
* jQuery	插件
*
* 作者         :飞华
  QQ           :654593600
  着手时间     :2015年1月29日 17:45:35
  完成时间     :2015年2月5日 13:59:39
  修订历史     :

  使用方法     :
  备注         :

  plugin URI :
  Version    :*/
+function ($)
{
	'use strict';

	// 命名空间
	var pluginNS = 'fhuiFormFile';

		// 插件前缀
	var	pluginPfx = 'fhFormFile';

		// 默认选择器
	var	defaultSelector = '.fhui-form-file';

		// default options
	var	defaults = {};
		/* validates selector (if selector is invalid or undefined uses the default one) */
		// 验证选择器（如果选择器不合法或未定义，则使用默认的）
	var	_selector = function () {
			return (typeof $(this) !== 'object' || $(this).length < 1) ? defaultSelector : this;
		};
	var buttonText = '选择...';
	var warpHtml = '<div class="fhui-form-file-box" style="display:inline-block;position:relative;"><input type="text" class="fhui-input" readonly="readonly" style="position:relative;z-index:2; display:inline-block;" />&nbsp;&nbsp;&nbsp;&nbsp;<button class="fhui-button" style="display:inline-block;">'+buttonText+'</button></div>';
	var inputFileStyle = 'position: absolute;top:0;left:-5000px;';
	//文件大小计算
	var formatFileSize = function (size){
		var sizeSuffix = ['Bytes','KB','MB','GB','TB'];
		var index = 0;
		while(sizeSuffix.length-1 != index){
			if(parseFloat(size) >= 1024){
				size = parseFloat(size/1024);
				index++;
			}else{
				break;
			}
		}
		return parseFloat(size).toFixed(4) + ' ' + sizeSuffix[index];
	}
	// 通过字面量创造一个对象，存储我们需要的共有方法
	var	methods = {
			// 在字面量对象中定义每个单独的方法
			// 插件的初始化方法，创建 插件数据对象和参数
			init: function () {

				// 验证选择器
				var selector = _selector.call(this);

				// 为了更好的灵活性，对来自主函数，并进入每个方法中的选择器其中的每个单独的元素都执行代码
				return $(selector).each(function () {
					// 为每个独立的元素创建一个jQuery对象
					var $this = $(this);

					if ($this.data(pluginPfx + '.load') == 'load') {
						//如果已经加载过了不执行操作
					}else{
						$this.attr('style',inputFileStyle);
						var warp = $(warpHtml);
						warp.insertBefore($this);
						warp.append($this);
						$this.data(pluginPfx + '.warp',warp);
						if($this.attr('disabled')){
							methods.disable.call($this);
						}
						warp.on('click.' + pluginPfx + 'change.' + pluginPfx , 'button' , function () {
							return $('input[type=file]',warp).click();
						});
						warp.on('change.' + pluginPfx , 'input[type=file]' , function () {
							$('input[type=text]',warp).val($(this).val());
						});
						
						$this.data(pluginPfx + '.load', 'load');
					}
				});
			},
			disable : function () {
				var selector = _selector.call(this);
				return $(selector).each(function () {
					var $this = $(this);
					var warp = $this.data(pluginPfx + '.warp');
					$('button',warp).attr('disabled','disabled');
					$('input[type=text]',warp).attr('disabled','disabled');
					$this.attr('disabled','disabled');
				});
				
			},
			clear : function () {
				var selector = _selector.call(this);
				return $(selector).each(function () {
					var $this = $(this);
					var warp = $this.data(pluginPfx + '.warp');
					var objFile = $('input[type=file]',warp)[0];
					objFile.outerHTML=objFile.outerHTML;
					$('input[type=file]',warp).data(pluginPfx + '.warp',warp);
					$('input[type=text]',warp).val('');
				});
			},
			enable : function () {
				var selector = _selector.call(this);
				return $(selector).each(function () {
					var $this = $(this);
					var warp = $this.data(pluginPfx + '.warp');
					$('button',warp).removeAttr('disabled');
					$('input[type=text]',warp).removeAttr('disabled');
					$this.removeAttr('disabled','disabled');
				});
			},
			info : function () {
				var selector = _selector.call(this);
				var fileInput = selector[0];
  
				var fileSize = null;		//大小
				var fileName = null;		//文件名称
				var fileEx  = null;			//扩展名
				try{
					var file = fileInput.files[0];
					if (file) {
						if('size' in file){
							fileSize = file.size;
						}else if('fileSize' in file){
							fileSize = file.fileSize;
						}
						if('name' in file){
							fileName = file.name;
						}else if('fileName' in file){
							fileName = file.fileName;
						}
					}
				}catch(error){
					try{
						var image = $('<img/>').appendTo('body'); 
						image[0].dynsrc = fileInput.value;     
						fileSize = image[0].fileSize;
						image.remove();
						if(fileInput.value.lastIndexOf('\\') != -1){
							fileName = fileInput.value.substring(fileInput.value.lastIndexOf('\\') + 1);
						}
					}catch(error1){}
				}
				if(fileName){
					fileEx = fileName.substring(fileName.lastIndexOf('.'));
				}
				
				return {
					name : fileName,
					size : formatFileSize(fileSize),
					extension : fileEx
				};
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

/*
* jQuery	插件
*
* 作者         :飞华
  QQ           :654593600
  着手时间     :2015年2月25日 11:33:32
  完成时间     :2015年2月25日 18:18:06
  修订历史     :

  使用方法     :
  备注         :

  plugin URI :
  Version    :*/
+function ($)
{
	'use strict';

	// 命名空间
	var pluginNS = 'fhuiLayout';

		// 插件前缀
	var	pluginPfx = 'fhLayout';

		// 默认选择器
	var	defaultSelector = '.fhui-layout';

		// default options
	var	defaults = {
		type : 'inner'//layout类型，合法值为page，inner
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
					//
					var _options = $this.data(pluginPfx);
					//添加class
					$this.addClass('fhui-layout');
					
					//添加class
					$this.children().each(function(){
						var o = $.fhui.getData($(this));
						$(this).addClass('fhui-layout-' + o.position);
					});
					_init.call(null,$this,_options);
					//resize
					$.each(['top','left','right','bottom'],function(i,dir){
						resize[dir].call($this);
					});
					$(window).resize(function(){
						_init.call(null,$this,_options);
					});
				});
			},

			destroy : function () {
				// 验证选择器
				var selector = _selector.call(this);
				// 对选择器每个元素都执行方法
				return $(selector).each(function () {
					// 执行代码
				});
			}
		};
	var _init = function($this,_options){
		//page与inner大小不同
		switch(_options.type){
			case 'page' : 
				$('body').css({
					overflow:'hidden'
				})
				$this.height($(window).height());
				$this.width($(window).width());
				$this.css({
					left : 0,
					top :0,
					position:'absolute'
				});
				break;
		}
		$.each(['top','bottom','left','right','center'],function(i,dir){
			regions[dir].call($this);
		});
	};
	//resize
	var resize = {
		top : function(){
			var $this = this;
			var top = $('>.fhui-layout-top',this);
			var topResize = $('>.fhui-layout-top-resize',this);
			var o = top.data(pluginPfx + '.top');
			if(o.resize && o.resize === true){
				topResize._dbClick(function(){
					var _o = top.data(pluginPfx + '.top');
					if(top.height() === 0){
						_o.height = top.data(pluginPfx + '.height');
					}else{
						top.data(pluginPfx + '.height',top.height());
						_o.height = 0;
					}
					top.data(pluginPfx + '.top',_o);
					_init.call(null,$this,$this.data(pluginPfx));
				});
				topResize.fhuiDraggable({axis:'y',cursor:'s-resize',stop:function(e,target){
					var _o = top.data(pluginPfx + '.top');
					_o.height = top.height() + target.position().top - top.outerHeight();
					top.data(pluginPfx + '.top',_o);
					_init.call(null,$this,$this.data(pluginPfx));
				}});
			}
		},
		left : function(){
			var $this = this;
			var left = $('>.fhui-layout-left',this);
			var leftResize = $('>.fhui-layout-left-resize',this);
			var o = left.data(pluginPfx + '.left');
			if(o.resize && o.resize === true){
				leftResize._dbClick(function(){
					var _o = left.data(pluginPfx + '.left');
					if(left.width() === 0){
						_o.width = left.data(pluginPfx + '.width');
					}else{
						left.data(pluginPfx + '.width',left.width());
						_o.width = 0;
					}
					left.data(pluginPfx + '.left',_o);
					_init.call(null,$this,$this.data(pluginPfx));
				});
				leftResize.fhuiDraggable({axis:'x',cursor:'e-resize',stop:function(e,target){
					var _o = left.data(pluginPfx + '.left');
					_o.width = left.width() + target.position().left - left.outerWidth();
					left.data(pluginPfx + '.left',_o);
					_init.call(null,$this,$this.data(pluginPfx));
				}});
			}
		},
		right : function(){
			var $this = this;
			var right = $('>.fhui-layout-right',this);
			var rightResize = $('>.fhui-layout-right-resize',this);
			var o = right.data(pluginPfx + '.right');
			if(o.resize && o.resize === true){
				rightResize._dbClick(function(){
					var _o = right.data(pluginPfx + '.right');
					if(right.width() === 0){
						_o.width = right.data(pluginPfx + '.width');
					}else{
						right.data(pluginPfx + '.width',right.width());
						_o.width = 0;
					}
					right.data(pluginPfx + '.right',_o);
					_init.call(null,$this,$this.data(pluginPfx));
				});
				rightResize.fhuiDraggable({axis:'x',cursor:'e-resize',stop:function(e,target){
					var _o = right.data(pluginPfx + '.right');
					_o.width = right.width() + $this.width() - (target.position().left + target.width()) - right.outerWidth();
					right.data(pluginPfx + '.right',_o);
					_init.call(null,$this,$this.data(pluginPfx));
				}});
			}
		},
		bottom : function(){
			var $this = this;
			var bottom = $('>.fhui-layout-bottom',this);
			var bottomResize = $('>.fhui-layout-bottom-resize',this);
			var o = bottom.data(pluginPfx + '.bottom');
			if(o.resize && o.resize === true){
				bottomResize._dbClick(function(){
					var _o = bottom.data(pluginPfx + '.bottom');
					if(bottom.height() === 0){
						_o.height = bottom.data(pluginPfx + '.height');
					}else{
						bottom.data(pluginPfx + '.height',bottom.height());
						_o.height = 0;
					}
					bottom.data(pluginPfx + '.bottom',_o);
					_init.call(null,$this,$this.data(pluginPfx));
				});
				bottomResize.fhuiDraggable({axis:'y',cursor:'s-resize',stop:function(e,target){
					var _o = bottom.data(pluginPfx + '.bottom');
					_o.height = bottom.height() + $this.height() - (target.position().top + target.height()) - bottom.outerHeight();
					bottom.data(pluginPfx + '.bottom',_o);
					_init.call(null,$this,$this.data(pluginPfx));
				}});
			}
		}
		
	};
	//区域
	var regions = {
		top : function (){
			var top = $('>.fhui-layout-top',this);
			if(top && top.length > 0){
				top.css({
					left : 0,
					top  : 0,
					right: 0
				});
				if(!top.data(pluginPfx + '.top')){
					top.data(pluginPfx + '.top',$.fhui.getData(top));
				}
				var o = top.data(pluginPfx + '.top');
				if(o.height != 'undefined'){
					top.height(o.height);
				}
				if(o.resize && o.resize === true){
					var topResize = $('>.fhui-layout-top-resize',this);
					if(topResize && topResize.length > 0){}
					else{
						topResize = $('<div class="fhui-layout-top-resize"></div>');
						this.append(topResize);
					}
					topResize.css({
						left : 0,
						top  : top.outerHeight(),
						right: 0
					});
				}
			}
			
		},
		right : function (){
			var right = $('>.fhui-layout-right',this);
			if(right && right.length > 0){
				var positionTop = ($('>.fhui-layout-top',this).outerHeight() || 0) + ($('>.fhui-layout-top-resize',this).outerHeight() || 0);
				var positionBottom = ($('>.fhui-layout-bottom',this).outerHeight() || 0) + ($('>.fhui-layout-bottom-resize',this).outerHeight() || 0);
				right.css({
					right : 0,
					top  : positionTop,
					bottom : positionBottom
				});
				if(!right.data(pluginPfx + '.right')){
					right.data(pluginPfx + '.right',$.fhui.getData(right));
				}
				var o = right.data(pluginPfx + '.right');
				if(o.width != 'undefined'){
					right.width(o.width);
				}
				if(o.resize && o.resize === true){
					var rightResize = $('>.fhui-layout-right-resize',this);
					if(rightResize && rightResize.length > 0){}
					else{
						rightResize = $('<div class="fhui-layout-right-resize"></div>');
						this.append(rightResize);
					}
					rightResize.css({
						right : right.outerWidth(),
						top  : positionTop,
						bottom : positionBottom,
						left:''
					});
				}
			}
		},
		bottom : function (){
			var bottom = $('>.fhui-layout-bottom',this);
			if(bottom && bottom.length > 0){
				bottom.css({
					left : 0,
					bottom  : 0,
					right : 0
				});
				if(!bottom.data(pluginPfx + '.bottom')){
					bottom.data(pluginPfx + '.bottom',$.fhui.getData(bottom));
				}
				var o = bottom.data(pluginPfx + '.bottom');
				if(o.height != 'undefined'){
					bottom.height(o.height);
				}
				if(o.resize && o.resize === true){
					var bottomResize = $('>.fhui-layout-bottom-resize',this);
					if(bottomResize && bottomResize.length > 0){}
					else{
						bottomResize = $('<div class="fhui-layout-bottom-resize"></div>');
						this.append(bottomResize);
					}
					bottomResize.css({
						left : 0,
						bottom  : bottom.outerHeight(),
						right : 0,
						top:''
					});
				}
			}
		},
		left : function(){
			var left = $('>.fhui-layout-left',this);
			if(left && left.length > 0){
				var positionTop = ($('>.fhui-layout-top',this).outerHeight() || 0) + ($('>.fhui-layout-top-resize',this).outerHeight() || 0);
				var positionBottom = ($('>.fhui-layout-bottom',this).outerHeight() || 0) + ($('>.fhui-layout-bottom-resize',this).outerHeight() || 0);
				left.css({
					left : 0,
					top  : positionTop,
					bottom : positionBottom
				});
				if(!left.data(pluginPfx + '.left')){
					left.data(pluginPfx + '.left',$.fhui.getData(left));
				}
				var o = left.data(pluginPfx + '.left');
				if(o.width != 'undefined'){
					left.width(o.width);
				}
				if(o.resize && o.resize === true){
					var leftResize = $('>.fhui-layout-left-resize',this);
					if(leftResize && leftResize.length > 0){}
					else{
						leftResize = $('<div class="fhui-layout-left-resize"></div>');
						this.append(leftResize);
					}
					leftResize.css({
						left : left.outerWidth(),
						top  : positionTop,
						bottom : positionBottom
					});
				}
			}
		},
		center : function(){
			var center = $('>.fhui-layout-center',this);
			if(center && center.length > 0){
				var positionTop = ($('>.fhui-layout-top',this).outerHeight() || 0) + ($('>.fhui-layout-top-resize',this).outerHeight() || 0);
				var positionBottom = ($('>.fhui-layout-bottom',this).outerHeight() || 0) + ($('>.fhui-layout-bottom-resize',this).outerHeight() || 0);
				var positionLeft = ($('>.fhui-layout-left',this).outerWidth() || 0) + ($('>.fhui-layout-left-resize',this).outerWidth() || 0);
				var positionRight = ($('>.fhui-layout-right',this).outerWidth() || 0) + ($('>.fhui-layout-right-resize',this).outerWidth() || 0);
				center.css({
					left : positionLeft,
					right : positionRight,
					top  : positionTop,
					bottom : positionBottom
				});
			}
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

/*
* jQuery	插件
*
* 作者         :飞华
  QQ           :654593600
  着手时间     :2015年2月28日 13:36:49
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
	var pluginNS = 'fhuiMessage';

		// 插件前缀
	var	pluginPfx = 'fhMessage';

		// 默认选择器
	var	defaultSelector = '.fhui-message';

		// default options
	var	defaults = {
		position:{top:20,right:20},//消息位置，
		header:'',//标题，默认为消息类型对应的标题
		message:'',//默认消息内容为空
		type:"info",//消息类型，可能的值：info,warn,error
		duration:6000//持续时长，默认为6秒，0表示始终显示
	};
		/* validates selector (if selector is invalid or undefined uses the default one) */
		// 验证选择器（如果选择器不合法或未定义，则使用默认的）
	var	_selector = function () {
			return (typeof $(this) !== 'object' || $(this).length < 1) ? defaultSelector : this;
		};
	var body = $('body');
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
						$this.data(pluginPfx, $.extend({},defaults,$.fhui.getData($this),options));
					}

					var _options = $this.data(pluginPfx);
					$this.addClass('fhui-message').addClass('fhui-message-' + _options.type);
					var messageBox = methods.getMessageBox.call($this);
					
					messageBox.css(_options.position);
					messageBox.append($this);
					
					var htmlObj = $('<div class="fhui-message-header"></div><div class="fhui-message-content"></div><span class="fhui-message-close">x</span>');
					$this.append(htmlObj);
					$('.fhui-message-header',$this).text(_options.header);
					$('.fhui-message-content',$this).html(_options.message);
					
					//event
					if(_options.duration !== 0){
						$.fhui.timer(function(){
							methods.remove.call($this);
						},_options.duration,1);
					}
					$('.fhui-message-close',$this).click(function(){
						methods.remove.call($this);
					});
				});

			},

			show: function () {
				// 验证选择器
				var selector = _selector.call(this);
				// 对选择器每个元素都执行方法
				return $(selector).each(function () {
					// 执行代码
					$(this).fadeIn();
				});

			},
			hide: function () {
				// 验证选择器
				var selector = _selector.call(this);
				// 对选择器每个元素都执行方法
				return $(selector).each(function () {
					// 执行代码
					$(this).fadeOut();
				});

			},
			remove: function () {
				// 验证选择器
				var selector = _selector.call(this);
				// 对选择器每个元素都执行方法
				return $(selector).each(function () {
					// 执行代码
					var $this = $(this);
					methods.hide.call($this);
					$this.queue(function () {
						methods.remove.call($this);
					});
				});

			},
			//获取消息盒子,可以外部调用
			getMessageBox:function(){
				var boxPos = "";
				// 验证选择器
				var selector = _selector.call(this);
				var _options = selector.data(pluginPfx);
				//位置所有
				var pos = ['top','right','bottom','left'];
				for(var i in pos){
					var item = pos[i];
					boxPos += item + _options.position[item];
				}
				var messageBox = $('.fhui-message-box[boxpos='+boxPos+']',body);
				if(messageBox && messageBox.length>0){}else{
					messageBox =  $('<div class="fhui-message-box"></div>');
					messageBox.attr('boxpos',boxPos);
					messageBox.appendTo(body);
				}
				return messageBox;
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

/*
* jQuery	插件
*
* 作者         :飞华
  QQ           :654593600
  着手时间     :2015年3月4日 17:24:27
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
	var pluginNS = 'fhuiPaginator';

		// 插件前缀
	var	pluginPfx = 'fhPaginator';

		// 默认选择器
	var	defaultSelector = '.fhui-paginator';

		// default options
	var	defaults = {
		currentPage:1,//当前页数，默认选择第一页
		totalPage:1,//总页数，默认为1页
		maxLeft:2,//分页小数目个数,最小为1
		maxCenter:7,//分页中间数目个数,最小为1
		maxRight:2,//分页右边数目个数,最小为1
		preNext:true,//是否添加上一页，下一页
		goPage:true,//是否添加页面跳转
		click:null//点击页码回调函数
	};
		/* validates selector (if selector is invalid or undefined uses the default one) */
		// 验证选择器（如果选择器不合法或未定义，则使用默认的）
	var	_selector = function () {
			return (typeof $(this) !== 'object' || $(this).length < 1) ? defaultSelector : this;
		};
	var textString = {
		pre:"上一页",
		next:"下一页",
		goLabel:"跳转到：",
		go:"go"
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
					}else{
						return;
					}

					var _options = $this.data(pluginPfx);
					$this.addClass('fhui-paginator');
					// 执行代码
					$this.data(pluginPfx + '.currentPage',_options.currentPage);
					//页码ui对应的数组
					initPage.call($this);
					paginate.call($this);
				});

			},

			getCurrentPage: function () {
				// 验证选择器
				var selector = _selector.call(this);
				// 对选择器每个元素都执行方法
				return $(selector).data(pluginPfx + '.currentPage');

			},
			goPage: function (num) {
				// 验证选择器
				var selector = _selector.call(this);
				// 对选择器每个元素都执行方法
				goPage.call(selector,num);

			}
		};
	var initPage = function(){
		var _options = this.data(pluginPfx);
		var page = [];
		var left = [];
		var center = [];
		var right = [];
		var totalPage = _options.totalPage;
		var currentPage = this.data(pluginPfx + '.currentPage');
		if(totalPage > _options.maxLeft + _options.maxCenter + _options.maxRight){
			for(var i=0;i < _options.maxLeft;i++){
				left[i] = i + 1;
			}
			for(var j=0;j < _options.maxRight;j++){
				right[j] = totalPage-_options.maxRight+(j+1);
			}
			var centerPage = Math.round(totalPage/2);
			if((currentPage >= left[0] + (left.length/2)) || (currentPage <= right[0] + right.length/2) ){
				centerPage = currentPage;
			}
			var start = centerPage - Math.round(_options.maxCenter/2);
			if(start <= left[left.length - 1]){
				start = left[left.length - 1];
			}else if(start + _options.maxCenter >= right[0]){
				start = right[0] - _options.maxCenter-1
			}
			
			for(var m = 0;m < _options.maxCenter;m++){
				center[m] = start + (m+1);
			}
			
			page = page.concat(left);
			if( left[left.length - 1] + 1 < center[0]){
				page = page.concat([0]);
			}
			page = page.concat(center);
			if(center[center.length-1] + 1 <right[0]){
				page = page.concat([0]);
			}
			page = page.concat(right);

		}else{
			for(var n=0;n<totalPage;n++){
				page[n] = n+1;
			}
		}
		this.data(pluginPfx + '.left',left);
		this.data(pluginPfx + '.center',center);
		this.data(pluginPfx + '.right',right);
		this.data(pluginPfx + '.page',page);
	};
	var paginate = function(){
		var _options = this.data(pluginPfx);
		var $this = this;
		var currentPage = this.data(pluginPfx + '.currentPage');
		$this.empty();
		//添加上一页
		if(_options.preNext === true){
			var pre = $('<span class="fhui-paginator-pre">' + textString.pre + '</span>');
			pre.click(function(){
				goPage.call($this,parseInt(currentPage,10) -1);
			}),
			this.append(pre);
		}
		var page = this.data(pluginPfx + '.page');
		var elementClick = function(){
			goPage.call($this,parseInt($(this).data(pluginPfx + '.pageNum'),10));
		};
		for(var i = 0;i < page.length;i++){
			if(page[i] === 0){
				this.append($('<span class="fhui-paginator-ellipsis">...</span>'));
			}else{
				if(page[i]){
					var element = $('<span class="fhui-paginator-element">' + page[i] + '</span>');
					element.data(pluginPfx + '.pageNum',page[i]);
					if(page[i] == currentPage){
						element.addClass('fhui-paginator-element-current');
					}else{
						element.click(elementClick);
					}
					this.append(element);
				}
			}
		}
		//添加下一页
		if(_options.preNext){
			var next = $('<span class="fhui-paginator-next">' + textString.next + '</span>');
			next.click(function(){
				goPage.call($this,parseInt(currentPage,10) + 1);
			}),
			this.append(next);
		}
		//添加页面跳转
		if(_options.goPage){
			var go = $('<span class="fhui-paginator-go-box">'+textString.goLabel+'<input type="text" value="'+ currentPage +'" style="padding:1px 3px;" size=5/><span class="fhui-paginator-go-button">'+ textString.go +'</span></span>')
			go.find('.fhui-paginator-go-button').click(function(){
				goPage.call($this,parseInt(go.find('input').val(),10));
			});
			this.append(go);
		}
	};
	var goPage = function(pageNum){
		var _options = this.data(pluginPfx);
		var totalPage = _options.totalPage;
		var currentPage = this.data(pluginPfx + '.currentPage');
		if(parseInt(pageNum,10) > parseInt(totalPage,10) || parseInt(pageNum,10) < 1 || parseInt(currentPage,10) == parseInt(pageNum,10)) return;
		this.data(pluginPfx + '.currentPage',pageNum);
		initPage.call(this);
		paginate.call(this);
		if(typeof _options.click == 'function'){
			_options.click.call(null,pageNum);
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

/*
* jQuery	插件
*
* 作者         :飞华
  QQ           :654593600
  着手时间     :2015年1月27日 16:52:15
  完成时间     :2015年2月9日 15:41:34
  修订历史     :

  使用方法     :
  备注         :

  plugin URI :
  Version    :*/
+function ($)
{
	'use strict';

	// 命名空间
	var pluginNS = 'fhuiPosition';

		// 默认选择器
	var	defaultSelector = '.fhui-position';

		// default options
	
	var	defaults = {
		of : window,//目标，即相对于谁
		at : 'center center',//在目标的哪个位置，合法值：空格分隔的两个值，表示x方向与y方向的位置，可以为数值或字符串（或具有返回数值或字符串的函数，函数的调用this指向目录对象），其中字符串合法值为：top,left,bottom,right,center
		my : 'center center',//自身的定位标准，合法值同上，但函数的调用this指向当前对象
		collision: 'none none'//冲突解决办法，合法值为：fit,none,flipfit,function（一个函数，参数为position）
	};
		/* validates selector (if selector is invalid or undefined uses the default one) */
		// 验证选择器（如果选择器不合法或未定义，则使用默认的）
	var	_selector = function () {
			return (typeof $(this) !== 'object' || $(this).length < 1) ? defaultSelector : this;
		};
	var horizontalPositions = /left|center|right/,
            verticalPositions = /top|center|bottom/,
            center = "center";
	var collisions = /fit|flipfit|flip|none/;
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
					
					var _options = $.extend(true,{},defaults,$.fhui.getData($this),options);
					// 执行代码
					var target = $( _options.of ),
						targetElem = target[0],
						targetWidth,
						targetHeight,
						targetPosition;
					//document
					if ( targetElem.nodeType === 9 ) {
						targetWidth = target.width();
						targetHeight = target.height();
						targetPosition = { top: 0, left: 0 };
					}
					//window
					else if ( $.isWindow(targetElem) ) {
							targetWidth = target.width();
							targetHeight = target.height();
							targetPosition = { top: target.scrollTop(), left: target.scrollLeft() };
					}
					//event
					else if ( targetElem.preventDefault ) {
							_options.at = "left top";
							targetWidth = targetHeight = 0;
							targetPosition = { top: _options.of.pageY, left: _options.of.pageX };
					}
					//else
					else {
							targetWidth = target.outerWidth();
							targetHeight = target.outerHeight();
							targetPosition = target.offset();
					}

					//如果其中一个值未指定或不合法，则以center添加
					$.each( [ 'my', 'at' ], function(i) {
						if(typeof _options[this] === 'function'){
							if(i === 0){
								_options[ this ] = _options[this].call($this);
							}else{
								_options[ this ] = _options[this].call(target);
							}
						}
						var pos = ( (_options[this] + '') || '' ).split( ' ' );
						if ( pos.length === 1) {
								pos = horizontalPositions.test( pos[0] ) ?
										pos.concat( [center] ) :
										verticalPositions.test( pos[0] ) ?
												[ center ].concat( pos ) :
												[ center, center ];
						}
						_options[ this ] = pos[ 0 ] + ' ' + pos[ 1 ];

					});
					
					var myPos = ( _options.my || '' ).split( ' ' );
					var atPos = ( _options.at || '' ).split( ' ' );
					//在target的位置
					var atPosition = $.extend( {}, targetPosition );
					
					if ( atPos[0] === 'left' ){
					}else if ( atPos[0] === 'right' ) {
						atPosition.left += targetWidth;
					}else if( atPos[0] === center){
						atPosition.left += targetWidth / 2;
					}
					//如果为数值
					else{
						atPosition.left += parseInt(atPos[0],10) || 0;
					}
					
					if ( atPos[1] === 'top' ) {
					}else if ( atPos[1] === 'bottom' ) {
						atPosition.top += targetHeight;
					}else if( atPos[1] === center ){
						atPosition.top += targetHeight / 2;
					}
					//如果为数值
					else{
						atPosition.top += parseInt(atPos[1],10) || 0;
					}
					
					var thisWidth = $this.outerWidth();
                    var thisHeight = $this.outerHeight();
					//$this 的最终位置
					var position = $.extend( {}, atPosition );
					
					if ( myPos[0] === 'left' ){
					}else if ( myPos[0] === 'right' ) {
						position.left -= thisWidth;
					}else if( myPos[0] === center){
						position.left -= thisWidth / 2;
					}
					//如果为数值
					else{
						position.left -= parseInt(myPos[0],10) || 0;
					}
					
					if ( myPos[1] === 'top' ) {
					}else if ( myPos[1] === 'bottom' ) {
						position.top -= thisHeight;
					}else if( myPos[1] === center ){
						position.top -= thisHeight / 2;
					}
					//如果为数值
					else{
						position.top -= parseInt(myPos[1],10) || 0;
					}
					if(typeof _options.collision == 'function'){
						_options.collision.call($this,position);
					}else{
						//冲突解决，不管哪一种解决方案，都是以最大面积呈现
						var collision = ( _options.collision || '' ).split( ' ' );
						if ( collision.length === 1){
							collision = collisions.test( collision )?collision.concat( collision ):['none','none'];
						}
						//这一个写的很不错，从jqueryui借鉴再来
						$.each( [ "left", "top" ], function( i, dir ) {
							if ( collisionPosition[ collision[i] ] ) {
								collisionPosition[ collision[i] ][ dir ]( position, {
									targetWidth: targetWidth,
									targetHeight: targetHeight,
									thisWidth: thisWidth,
									thisHeight: thisHeight,
									my: myPos,
									at: atPos
								});
							}
						});
					}

					$this.css(position);
					
				});

			}
		};
	var collisionPosition = {
		//位置调整，适应
		fit : {
			left : function (position,data) {
				var win = $(window);
				var winWidth = win.width();
				//左边被遮挡的宽度
				var left = position.left - win.scrollLeft();
				//右边被遮挡的宽度
				var right = position.left + data.thisWidth - win.scrollLeft() - winWidth;
				//左边部分有被遮挡
				if(left < 0){
					position.left +=  Math.abs(left);
				}
				//左边部分没有被遮挡
				else{
					//右边部分有被遮挡
					if(right > 0){
						position.left = win.scrollLeft() + winWidth -data.thisWidth;
					}
				}
			},
			top : function (position,data){
				var win = $(window);
				var winHeight = win.height();
				//上边被遮挡的高度
				var top = position.top - win.scrollTop();
				//下边被遮挡的高度
				var bottom = position.top + data.thisHeight - win.scrollTop() - winHeight;
				//如果上边部分有被遮挡
				if(top < 0){
					position.top +=  Math.abs(top);
				}else{
					//右边部分有被遮挡
					if(bottom > 0){
						position.top = win.scrollTop() + winHeight -data.thisHeight;
					}
				}
			}
		},
		//位置调整，翻转
		flip : {
			left : function (position,data) {
				if ( data.my[0] === 'center' ) {
						return;
				}
				//数值正则
				var numberReg = /^\-?[0-9]*$/;
				var win = $(window);
				var winWidth = win.width();
				//左边被遮挡的宽度
				var left = position.left - win.scrollLeft();
				//右边被遮挡的宽度
				var right = position.left + data.thisWidth - win.scrollLeft() - winWidth;
				//左边部分有被遮挡
				if(left < 0){
					if(data.my[0] == 'right'){
						position.left += data.thisWidth;
					}else if(numberReg.test(data.my[0])){
						position.left += 2 * parseInt(data.my[0],10) - data.thisWidth ;
					}
				}
				//左边部分没有被遮挡
				else{
					//右边部分有被遮挡
					if(right > 0){
						if(data.my[0] == 'left'){
							position.left -= data.thisWidth;
						}else if(numberReg.test(data.my[0])){
							position.left -= data.thisWidth - 2 * parseInt(data.my[0],10);
						}
					}

				}
			},
			top : function (position,data){
				if ( data.my[1] === 'center' ) {
						return;
				}
				//数值正则
				var numberReg = /^\-?[0-9]*$/;
				var win = $(window);
				var winHeight = win.height();
				//上边被遮挡的高度
				var top = position.top - win.scrollTop();
				//下边被遮挡的高度
				var bottom = position.top + data.thisHeight - win.scrollTop() - winHeight;
				//如果上边部分有被遮挡
				if(top < 0){
					if(data.my[1] == 'bottom'){
						position.top +=  data.thisHeight;
					}else if(numberReg.test(data.my[1])){
						position.top += 2 * parseInt(data.my[1],10) - data.thisHeight;
					}
					
				}else{
					//右边部分有被遮挡
					if(bottom > 0){
						if(data.my[1] == 'top'){
							position.top -= data.thisHeight;
						}else if(numberReg.test(data.my[1])){
							position.top -= data.thisHeight - 2 *  parseInt(data.my[1],10);
						}
						
					}
				}
			}
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

/*
* jQuery	插件
*
* 作者         :飞华
  QQ           :654593600
  着手时间     :2015年2月11日 17:28:26
  完成时间     :2015年2月13日 16:19:57
  修订历史     :

  使用方法     :
  备注         :

  plugin URI :
  Version    :*/
+function ($)
{
	'use strict';

	// 命名空间
	var pluginNS = 'fhuiResizable';

		// 插件前缀
	var	pluginPfx = 'fhResizable';

		// 默认选择器
	var	defaultSelector = '.fhui-resizable';

		// default options
	var	defaults = {
		handles    : 'all',   //可以改变大小的方向合法值n, e, s, w, ne, se, sw, nw, all
		helper     : false,    //不直接改变当前大小，使用一个框显示描述
		radio      : false,   //比例改变，改变一个方向时，另一个方向等比改变
		minWidth   : 0,       //最小宽度
		maxWidth   : 10000,   //最大宽度
		minHeight  : 0,       //最小高度
		maxHeight  : 10000,   //最大高度
		start      : null,    //开始函数
		resize     : null,    //过程函数
		stop       : null     //结束函数
	};
		/* validates selector (if selector is invalid or undefined uses the default one) */
		// 验证选择器（如果选择器不合法或未定义，则使用默认的）
	var	_selector = function () {
			return (typeof $(this) !== 'object' || $(this).length < 1) ? defaultSelector : this;
		};

	var body = $('body');
	
	var isResizing = false;
	// 通过字面量创造一个对象，存储我们需要的共有方法
	var	methods = {
			// 在字面量对象中定义每个单独的方法
			// 插件的初始化方法，创建 插件数据对象和参数
			init: function (options) {

				// 验证选择器
				var selector = _selector.call(this);
				//缓存body鼠标样式
				if(body.css('cursor')){
					body.data('oldCursor.' + pluginPfx,body.css('cursor'));
				}
				// 为了更好的灵活性，对来自主函数，并进入每个方法中的选择器其中的每个单独的元素都执行代码
				return $(selector).each(function () {
					// 为每个独立的元素创建一个jQuery对象
					var $this = $(this);
					//缓存自己鼠标样式
					if($this.css('cursor')){
						$this.data('oldCursor.' + pluginPfx,$this.css('cursor'));
					}
					if (!$this.data(pluginPfx)) {
						// 保存我们新创建的settings
						// 深度拷贝重载默认参数
						$this.data(pluginPfx, $.extend(true,{},defaults,$.fhui.getData($this),options));
					}
					var _options = $this.data(pluginPfx);

					$this.on('mousemove.fhui-resizable',function(e) {
						if( isResizing === true) return;
						cursorMethod.call($this,e,_options);
					}).on('mouseout.fhui-resizable',function (){
						if(isResizing === true) return;
						restoreCursor.call($this);
						$this.data('move.' + pluginPfx,false);
					}).on('mousedown.fhui-resizable',function (e) {
						var resizePfx = $this.data('resize.' + pluginPfx);

						if(resizePfx && resizePfx != 'undefined'){
							//拖拽开始标识
							var moveStart = false;
							if(isResizing) return;
							isResizing = true;
							//改变大小时，鼠标初始位置x
							var _x = e.pageX;
							//改变大小时，鼠标初始位置y
							var _y = e.pageY;
							//改变大小时，当前对象宽度
							var _width = $this.width();
							//改变大小时，当前对象高度
							var _height = $this.height();
							//禁用文本选择
							$.fhui.disableSelection();
							//记录初始position
							$this.data('postition.' + pluginPfx,$this.position());
							resizableHelper.data('postition.' + pluginPfx,$this.position());
							//没有找到好的方法，所以依赖了draggalbe的插件前缀在resize的时候来禁用draggable
							$this.data('fhuiResize',true);
							$(document).on('mousemove.fhui-resizable',function (e) {
								//改变大小开始
								if(moveStart === false){
									//helper设置
									if(_options.helper === true){
										resizableHelper.height($this.height()).width($this.width()).css($this.data('postition.' + pluginPfx));
										resizableHelper.css('z-index',$this.css('z-index'));
										resizableHelper.appendTo(body);
									}
									//回调
									if(typeof _options.start == 'function'){
										_options.start.call($this,e);
									}
									moveStart = true;
								}
								//改变大小中
								cursorMethods[resizePfx].call($this,e,_x,_y,_width,_height,_options);
								//回调
								if(typeof _options.resize == 'function'){
									_options.resize.call($this,e);
								}								
							}).on('mouseup.fhui-resizable',function (e) {
								//开始标志为false
								moveStart = false;
								//移除helper
								if(_options.helper === true){
									if(resizableHelper.data('postition.' + pluginPfx)){
										$this.css(resizableHelper.data('postition.' + pluginPfx));
										$this.removeData('postition.' + pluginPfx);
										
									}
									resizableHelper.removeData('postition.' + pluginPfx);
									$this.height(resizableHelper.height()).width(resizableHelper.width());
									removeResizableHelper.call(null);
								}
								$this.removeData('postition.' + pluginPfx);
								//不再移动绑定
								$(document).off('mousemove.fhui-resizable');
								$(document).off('mouseup.fhui-resizable');

								isResizing = false;
								//启用拖拽
								$this.removeData('fhuiResize');
								//结束后鼠标样式还原
								restoreCursor.call($this);
								//启用选择
								$.fhui.enableSelection();
								//回调
								if(typeof _options.stop == 'function'){
									_options.stop.call($this,e);
								}
							});
						}//end resizePfx
					});
				});

			},
			enable: function () {
				return methods.init.call(this);
			},
			disable: function () {
				// 验证选择器
				var selector = _selector.call(this);
				// 对选择器每个元素都执行方法
				return $(selector).each(function () {
					// 执行代码
					$(this).off('mousemove.fhui-resizable').off('mouseout.fhui-resizable').off('mousedown.fhui-resizable');
				});

			}
		};
	//都是以helper来帮助
	var resizableHelper = $('<div class="fhui-resizable-helper" style="overflow:hidden;position:absolute;"></div>');
	//从文档中删除helper
	var removeResizableHelper = function () {
		return resizableHelper.remove();
	};
	
	//还原默认样式
	var restoreCursor = function(){
		var bodyCursor = body.data('oldCursor.' + pluginPfx);
		if(bodyCursor){
			body.css('cursor',bodyCursor == 'auto' ? '' : bodyCursor);
		}
		var thisCusor = this.data('oldCursor.' + pluginPfx);
		if(thisCusor){
			this.css('cursor',thisCusor == 'auto' ? '' : thisCusor);
		}
		this.removeData('resize.' + pluginPfx);
	};
	//给body添加鼠标样式
	var cursorBody = function (resize){
		body.css('cursor',resize);
		this.css('cursor',resize);
		this.data('resize.' + pluginPfx,resize.replace('-resize',''));
	};
	var edge = 5;
	//八个向的鼠标样式
	var cursorMethod = function (e,cfg){
		var x = e.pageX;
		var y = e.pageY;
		var offset = this.offset();
		var left = offset.left;
		var right = left + this.outerWidth();
		var top = offset.top;
		var bottom = top + this.outerHeight();
		var handles = cfg.handles.split(',');
		var handle;
		//e
		if((right- edge <= x) && (right+ edge >= x) && (top + edge < y) && (bottom - edge > y)){
			handle = 'e';
		}
		//s
		else if((bottom- edge <= y) && (bottom+ edge >= y) && (left + edge < x) && (right - edge > x)){
			handle = 's';
		}
		//w
		else if((left - edge <= x) && (left +  edge >= x) && (top + edge < y) && (bottom - edge > y)){
			handle = 'w';
		}
		//n
		else if((top - edge <= y) && (top + edge >= y) && (left + edge < x) && (right - edge > x)){
			handle = 'n';
		}
		//se
		else if((right- edge <= x) && (right+ edge >= x) && (bottom - edge <= y) && (bottom + edge >= y)){
			handle = 'se';
		}
		//sw
		else if((left - edge <= x) && (left + edge >= x) && (bottom - edge <= y) && (bottom + edge >= y)){
			handle = 'sw';
		}
		//ne
		else if((right- edge <= x) && (right + edge >= x) && (top  - edge <= y) && (top + edge >= y)){
			handle = 'ne';
		}
		//nw
		else if((left - edge <= x) && (left + edge >= x) && (top - edge <= y) && (top + edge >= y)){
			handle = 'nw';
		}else{
			if(!this.data('move.' + pluginPfx)){
				restoreCursor.call(this);
				this.data('move.' + pluginPfx,true);
			}
			
		}
		//如果是all
		if(handles.length == 1 && 'all' == handles[0]){
			cursorBody.call(this,handle + '-resize');
		}
		//否则看指定的哪个handle
		else{
			for(var i = 0;i < handles.length;i++){
				if(handle && handle == handles[i]){
					cursorBody.call(this,handle + '-resize');
					break;
				}
			}
		}
	};
	
	//drag 方法
	var cursorMethods = {
		e : function (e,_x,_y,_width,_height,cfg) {
			var x = e.pageX;
			//var y = e.pageY;
			//var offset = this.offset();
			var _offset = x - _x;
			var minWidth = cfg.minWidth;
			var maxWidth = cfg.maxWidth;
			var minHeight = cfg.minHeight;
			var maxHeight = cfg.maxHeight;

			var currentWidth = _width + _offset;
			//最大宽度与最小宽度
			currentWidth = currentWidth > maxWidth ? maxWidth : currentWidth;
			currentWidth = currentWidth < minWidth ? minWidth : currentWidth
			
			//radio时height
			var currentHeight;
			//如果按比例
			if(cfg.radio === true){
				currentHeight = currentWidth * _height/_width;
			
				currentHeight = currentHeight > maxHeight ? maxHeight : currentHeight;
				currentHeight = currentHeight < minHeight ? minHeight : currentHeight;
				currentWidth = currentHeight * _width/_height;
			}else{
				currentHeight = _height;
			}
			//如果使用helper
			if(cfg.helper === true){
				resizableHelper.width(currentWidth);
				resizableHelper.height(currentHeight);
			}
			//如果不使用helper
			else{
				this.width(currentWidth);
				this.height(currentHeight);
			}
			
		},
		s : function (e,_x,_y,_width,_height,cfg) {
			//var x = e.pageX;
			var y = e.pageY;
			//var offset = this.offset();
			var _offset = y - _y;
			var minWidth = cfg.minWidth;
			var maxWidth = cfg.maxWidth;
			var minHeight = cfg.minHeight;
			var maxHeight = cfg.maxHeight;
			var currentHeight = _height + _offset;
			currentHeight = currentHeight > maxHeight ? maxHeight : currentHeight;
			currentHeight = currentHeight < minHeight ? minHeight : currentHeight;
			var currentWidth;
			if(cfg.radio === true){
				currentWidth = currentHeight * _width/_height;
				currentWidth = currentWidth > maxWidth ? maxWidth : currentWidth;
				currentWidth = currentWidth < minWidth ? minWidth : currentWidth
				currentHeight = currentWidth * _height/_width;
			}else{
				currentWidth = _width;
			}
			//如果使用helper
			if(cfg.helper === true){
				resizableHelper.width(currentWidth);
				resizableHelper.height(currentHeight);
			}
			//如果不使用helper
			else{
				this.width(currentWidth);
				this.height(currentHeight);
			}
		},
		w : function (e,_x,_y,_width,_height,cfg) {
			var x = e.pageX;
			//var y = e.pageY;
			//var offset = this.offset();
			var _offset =  _x - x ;
			var minWidth = cfg.minWidth;
			var maxWidth = cfg.maxWidth;
			var minHeight = cfg.minHeight;
			var maxHeight = cfg.maxHeight;
			
			var currentWidth = _width + _offset;
			//最大宽度与最小宽度
			currentWidth = currentWidth > maxWidth ? maxWidth : currentWidth;
			currentWidth = currentWidth < minWidth ? minWidth : currentWidth
			
			//radio时height
			var currentHeight;
			//如果按比例
			if(cfg.radio === true){
				currentHeight = currentWidth * _height/_width;
				currentHeight = currentHeight > maxHeight ? maxHeight : currentHeight;
				currentHeight = currentHeight < minHeight ? minHeight : currentHeight;
				currentWidth = currentHeight * _width/_height;
			}else{
				currentHeight = _height;
			}
			//如果使用helper
			if(cfg.helper === true){
				resizableHelper.width(currentWidth);
				resizableHelper.height(currentHeight);
				resizableHelper.css({
					left : this.data('postition.' + pluginPfx).left + _width - currentWidth
				});
			}
			//如果不使用helper
			else{
				this.width(currentWidth);
				this.height(currentHeight);
				this.css({
					left : this.data('postition.' + pluginPfx).left + _width - currentWidth
				});
			}
			
		},
		n : function (e,_x,_y,_width,_height,cfg) {
			//var x = e.pageX;
			var y = e.pageY;
			//var offset = this.offset();
			var _offset = _y - y;
			var minWidth = cfg.minWidth;
			var maxWidth = cfg.maxWidth;
			var minHeight = cfg.minHeight;
			var maxHeight = cfg.maxHeight;
			var currentHeight = _height + _offset;
			
			currentHeight = currentHeight > maxHeight ? maxHeight : currentHeight;
			currentHeight = currentHeight < minHeight ? minHeight : currentHeight;
			var currentWidth;
			if(cfg.radio === true){
				currentWidth = currentHeight * _width/_height;
				currentWidth = currentWidth > maxWidth ? maxWidth : currentWidth;
				currentWidth = currentWidth < minWidth ? minWidth : currentWidth
			
				currentHeight = currentWidth * _height/_width;
			}else{
				currentWidth = _width;
			}
			//如果使用helper
			if(cfg.helper === true){
				resizableHelper.width(currentWidth);
				resizableHelper.height(currentHeight);
				resizableHelper.css({
					top : this.data('postition.' + pluginPfx).top + _height - currentHeight
				});
			}
			//如果不使用helper
			else{
				this.width(currentWidth);
				this.height(currentHeight);
				this.css({
					top : this.data('postition.' + pluginPfx).top + _height - currentHeight
				});
			}
			
		},
		se : function (e,_x,_y,_width,_height,cfg) {
			var x = e.pageX;
			var y = e.pageY;
			//var offset = this.offset();
			var _offsetX = x - _x;
			var _offsetY = y - _y;
			var minWidth = cfg.minWidth;
			var maxWidth = cfg.maxWidth;
			var minHeight = cfg.minHeight;
			var maxHeight = cfg.maxHeight;

			var currentWidth = _width + _offsetX;
			var currentHeight = _height + _offsetY;
						//如果按比例
			if(cfg.radio === true){
					//通过交叉判断来计算比例
					currentHeight = currentWidth * _height/_width;
					currentHeight = currentHeight > maxHeight ? maxHeight : currentHeight;
					currentHeight = currentHeight < minHeight ? minHeight : currentHeight;
					currentWidth = currentHeight * _width/_height;
					
					currentWidth = currentWidth > maxWidth ? maxWidth : currentWidth;
					currentWidth = currentWidth < minWidth ? minWidth : currentWidth
					currentHeight = currentWidth * _height/_width;

					currentWidth = currentHeight * _width/_height;
					currentWidth = currentWidth > maxWidth ? maxWidth : currentWidth;
					currentWidth = currentWidth < minWidth ? minWidth : currentWidth
					currentHeight = currentWidth * _height/_width;
					
					currentHeight = currentHeight > maxHeight ? maxHeight : currentHeight;
					currentHeight = currentHeight < minHeight ? minHeight : currentHeight;
					currentWidth = currentHeight * _width/_height;
			}else{
				currentWidth = currentWidth > maxWidth ? maxWidth : currentWidth;
				currentWidth = currentWidth < minWidth ? minWidth : currentWidth
				
				currentHeight = currentHeight > maxHeight ? maxHeight : currentHeight;
				currentHeight = currentHeight < minHeight ? minHeight : currentHeight;
			}


			//如果使用helper
			if(cfg.helper === true){
				resizableHelper.width(currentWidth);
				resizableHelper.height(currentHeight);
			}
			//如果不使用helper
			else{
				this.width(currentWidth);
				this.height(currentHeight);
			}
		},
		sw : function (e,_x,_y,_width,_height,cfg) {
			var x = e.pageX;
			var y = e.pageY;
			//var offset = this.offset();
			var _offsetX = _x - x;
			var _offsetY = y - _y;
			var minWidth = cfg.minWidth;
			var maxWidth = cfg.maxWidth;
			var minHeight = cfg.minHeight;
			var maxHeight = cfg.maxHeight;

			var currentWidth = _width + _offsetX;
			var currentHeight = _height + _offsetY;
						//如果按比例
			if(cfg.radio === true){
					//通过交叉判断来计算比例
					currentHeight = currentWidth * _height/_width;
					currentHeight = currentHeight > maxHeight ? maxHeight : currentHeight;
					currentHeight = currentHeight < minHeight ? minHeight : currentHeight;
					currentWidth = currentHeight * _width/_height;
					
					currentWidth = currentWidth > maxWidth ? maxWidth : currentWidth;
					currentWidth = currentWidth < minWidth ? minWidth : currentWidth
					currentHeight = currentWidth * _height/_width;

					currentWidth = currentHeight * _width/_height;
					currentWidth = currentWidth > maxWidth ? maxWidth : currentWidth;
					currentWidth = currentWidth < minWidth ? minWidth : currentWidth
					currentHeight = currentWidth * _height/_width;
					
					currentHeight = currentHeight > maxHeight ? maxHeight : currentHeight;
					currentHeight = currentHeight < minHeight ? minHeight : currentHeight;
					currentWidth = currentHeight * _width/_height;
			}else{
				currentWidth = currentWidth > maxWidth ? maxWidth : currentWidth;
				currentWidth = currentWidth < minWidth ? minWidth : currentWidth
				
				currentHeight = currentHeight > maxHeight ? maxHeight : currentHeight;
				currentHeight = currentHeight < minHeight ? minHeight : currentHeight;
			}


			//如果使用helper
			if(cfg.helper === true){
				resizableHelper.width(currentWidth);
				resizableHelper.height(currentHeight);
				resizableHelper.css({
					left : this.data('postition.' + pluginPfx).left + _width - currentWidth
				});
			}
			//如果不使用helper
			else{
				this.width(currentWidth);
				this.height(currentHeight);
				this.css({
					left : this.data('postition.' + pluginPfx).left + _width - currentWidth
				});
			}
			
		},
		ne : function (e,_x,_y,_width,_height,cfg) {
			var x = e.pageX;
			var y = e.pageY;
			//var offset = this.offset();
			var _offsetX = x - _x;
			var _offsetY = _y - y;
			var minWidth = cfg.minWidth;
			var maxWidth = cfg.maxWidth;
			var minHeight = cfg.minHeight;
			var maxHeight = cfg.maxHeight;

			var currentWidth = _width + _offsetX;
			var currentHeight = _height + _offsetY;
						//如果按比例
			if(cfg.radio === true){
					//通过交叉判断来计算比例
					currentHeight = currentWidth * _height/_width;
					currentHeight = currentHeight > maxHeight ? maxHeight : currentHeight;
					currentHeight = currentHeight < minHeight ? minHeight : currentHeight;
					currentWidth = currentHeight * _width/_height;
					
					currentWidth = currentWidth > maxWidth ? maxWidth : currentWidth;
					currentWidth = currentWidth < minWidth ? minWidth : currentWidth
					currentHeight = currentWidth * _height/_width;

					currentWidth = currentHeight * _width/_height;
					currentWidth = currentWidth > maxWidth ? maxWidth : currentWidth;
					currentWidth = currentWidth < minWidth ? minWidth : currentWidth
					currentHeight = currentWidth * _height/_width;
					
					currentHeight = currentHeight > maxHeight ? maxHeight : currentHeight;
					currentHeight = currentHeight < minHeight ? minHeight : currentHeight;
					currentWidth = currentHeight * _width/_height;
			}else{
				currentWidth = currentWidth > maxWidth ? maxWidth : currentWidth;
				currentWidth = currentWidth < minWidth ? minWidth : currentWidth
				
				currentHeight = currentHeight > maxHeight ? maxHeight : currentHeight;
				currentHeight = currentHeight < minHeight ? minHeight : currentHeight;
			}


			//如果使用helper
			if(cfg.helper === true){
				resizableHelper.width(currentWidth);
				resizableHelper.height(currentHeight);
				resizableHelper.css({
					top : this.data('postition.' + pluginPfx).top + _height - currentHeight
				});
			}
			//如果不使用helper
			else{
				this.width(currentWidth);
				this.height(currentHeight);
				this.css({
					top : this.data('postition.' + pluginPfx).top + _height - currentHeight
				});
			}
			
		},
		nw : function (e,_x,_y,_width,_height,cfg) {
			var x = e.pageX;
			var y = e.pageY;
			//var offset = this.offset();
			var _offsetX = _x - x;
			var _offsetY = _y - y;
			var minWidth = cfg.minWidth;
			var maxWidth = cfg.maxWidth;
			var minHeight = cfg.minHeight;
			var maxHeight = cfg.maxHeight;

			var currentWidth = _width + _offsetX;
			var currentHeight = _height + _offsetY;
						//如果按比例
			if(cfg.radio === true){
					//通过交叉判断来计算比例
					currentHeight = currentWidth * _height/_width;
					currentHeight = currentHeight > maxHeight ? maxHeight : currentHeight;
					currentHeight = currentHeight < minHeight ? minHeight : currentHeight;
					currentWidth = currentHeight * _width/_height;
					
					currentWidth = currentWidth > maxWidth ? maxWidth : currentWidth;
					currentWidth = currentWidth < minWidth ? minWidth : currentWidth
					currentHeight = currentWidth * _height/_width;

					currentWidth = currentHeight * _width/_height;
					currentWidth = currentWidth > maxWidth ? maxWidth : currentWidth;
					currentWidth = currentWidth < minWidth ? minWidth : currentWidth
					currentHeight = currentWidth * _height/_width;
					
					currentHeight = currentHeight > maxHeight ? maxHeight : currentHeight;
					currentHeight = currentHeight < minHeight ? minHeight : currentHeight;
					currentWidth = currentHeight * _width/_height;
			}else{
				currentWidth = currentWidth > maxWidth ? maxWidth : currentWidth;
				currentWidth = currentWidth < minWidth ? minWidth : currentWidth
				
				currentHeight = currentHeight > maxHeight ? maxHeight : currentHeight;
				currentHeight = currentHeight < minHeight ? minHeight : currentHeight;
			}


			//如果使用helper
			if(cfg.helper === true){
				resizableHelper.width(currentWidth);
				resizableHelper.height(currentHeight);
				resizableHelper.css({
					top : this.data('postition.' + pluginPfx).top + _height - currentHeight,
					left : this.data('postition.' + pluginPfx).left + _width - currentWidth
				});
			}
			//如果不使用helper
			else{
				this.width(currentWidth);
				this.height(currentHeight);
				this.css({
					top : this.data('postition.' + pluginPfx).top + _height - currentHeight,
					left : this.data('postition.' + pluginPfx).left + _width - currentWidth
				});
			}
			
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

/*
* jQuery	插件
*
* 作者         :飞华
  QQ           :654593600
  着手时间     :2015年2月9日 15:45:38
  完成时间     :2015年2月9日 18:26:27
  修订历史     :

  使用方法     :
  备注         :  注意：table中除了tr，如果为tr，请为该tr的每个td设定宽度，以更好的处理，请不要对table其它子元素使用该插件，此插件没有兼容上述元素，若要适应请自行修改
					如果遇到其它bug请联系作者。

  plugin URI :
  Version    :*/
+function ($)
{
	'use strict';

	// 命名空间
	var pluginNS = 'fhuiSticky';

		// 插件前缀
	var	pluginPfx = 'fhSticky';

		// 默认选择器
	var	defaultSelector = '.fhui-sticky';

		// default options
	var	defaults = {
			position:{top:0}//postion参数为一个对象参数，合法值为left,right,top,bottom即为固定对象的位置
		};
		/* validates selector (if selector is invalid or undefined uses the default one) */
		// 验证选择器（如果选择器不合法或未定义，则使用默认的）
	var	_selector = function () {
			return (typeof $(this) !== 'object' || $(this).length < 1) ? defaultSelector : this;
		};
		//判断是否是table中的tr固定表头的
	var	isTrFixed = function(target){
		if("tr" == target[0].nodeName.toLowerCase()){
			return true;
		}else{
			return false;
		}
	};
	var fix = function($this,_options){
		if(typeof $this.data('stickyGhost') == 'undefined'){
			if(isTrFixed($this)){
				var parentTbody = $this.parent('tbody')
				var parentTable = parentTbody.parent('table');
				var cloneTable = parentTable.clone();
				var cloneTbody = cloneTable.children('tbody');
				if(cloneTbody && cloneTbody.length > 0){
					cloneTbody.empty();
					cloneTbody.append($this.clone());
				}
				cloneTable.empty();
				cloneTable.append(cloneTbody);
				cloneTable.appendTo(parentTable.parent());
				cloneTable.width(parentTable.width());
				//修正
				if(cloneTable.width() < parentTable.width()){
					cloneTable.width(parentTable.width()+(parentTable.width()-cloneTable.width()));
				}
				$this.data('stickyGhost',cloneTable);
			}else{
				var stickyGhost = $this.clone();
				stickyGhost.appendTo($this.parent());
				stickyGhost.width($this.width());
				$this.data('stickyGhost',stickyGhost);
			}
		}
		$this.data('stickyGhost').css({
			'position': 'fixed'
		}).css(_options.position).addClass('fhui-sticky-ghost');
	}
		// 通过字面量创造一个对象，存储我们需要的共有方法
	var	methods = {
			// 在字面量对象中定义每个单独的方法
			// 插件的初始化方法，创建 插件数据对象和参数
			init: function (options) {

				// 验证选择器
				var selector = _selector.call(this);

				// 为了更好的灵活性，对来自主函数，并进入每个方法中的选择器其中的每个单独的元素都执行代码
				return $(selector).each(function (i) {
					// 为每个独立的元素创建一个jQuery对象
					var $this = $(this);

					if (!$this.data('fhuiFixed')) {
						// 保存我们新创建的settings
						// 深度拷贝重载默认参数
						var _options = $.extend({},defaults,$.fhui.getData($this),options);
						var win = $(window);
						$this.data('scrollEvent', 'scroll.' + pluginPfx +i);
						if(win.scrollTop() > $this.offset().top) {
							fix($this,_options);
						}
						win.bind($this.data('scrollEvent'),function(){
							if(win.scrollTop() > $this.offset().top) {
								fix($this,_options);
							}
							else {
								methods.destroy.call($this);
							}
						});
						
						$this.data('fhuiFixed',true);
					}
				});

			},
			//刷新，可以外部调用 
			refresh: function() {
				methods.destroy.call(this);
				return methods.init.call(this);
			},
			destroy: function () {
				// 验证选择器
				var selector = _selector.call(this);
				return $(selector).each(function () {
					var $this = $(this);
					$this.removeData('fhuiFixed');
					if($this.data('stickyGhost')){
						$this.data('stickyGhost').remove();
						$this.removeData('stickyGhost');
					}
					$this.removeData('scrollEvent');
				});
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

/*
* jQuery	插件
*
* 作者         :飞华
  QQ           :654593600
  着手时间     :2015年2月15日 16:30:14
  完成时间     :2015年2月16日 15:09:40
  修订历史     :

  使用方法     :
  备注         :

  plugin URI :
  Version    :*/
+function ($)
{
	'use strict';

	// 命名空间
	var pluginNS = 'fhuiTip';

		// 插件前缀
	var	pluginPfx = 'fhTip';

		// 默认选择器
	var	defaultSelector = '.fhui-tip';

		// default options
	var	defaults = {
		tip : '',//提示内容
		position:'right',//位置，默认不右边，合法值为：left right top bottom
		tooltip : true//是否以tooltip模式下工作
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
					var tip = $('<div class="fhui-tip-box"><div class="fhui-tip-inner"></div><div class="fhui-tip-arrow"><div class="fhui-tip-arrow-border"></div><div class="fhui-tip-arrow-bg"></div></div></div>');
					tip.insertAfter($this)
					$('.fhui-tip-inner',tip).html(_options.tip);
					$this.data('tip.'+pluginPfx,tip);
					position[_options.position].call($this,tip)

					if(_options.tooltip === true){
						tip.hide();
						$this.on('mouseover.fhui-tip',function(){
							methods.show.call(this);
						}).on('mouseout.fhui-tip',function(){
							methods.hide.call(this);
						});
					}
				});

			},
			hide : function () {
				// 验证选择器
				var selector = _selector.call(this);
				// 对选择器每个元素都执行方法
				return $(selector).each(function () {
					// 执行代码
					var $this = $(this);
					var tip = $this.data('tip.'+pluginPfx);
					tip.fadeOut();
				});
			},
			show : function () {
				// 验证选择器
				var selector = _selector.call(this);
				// 对选择器每个元素都执行方法
				return $(selector).each(function () {
					// 执行代码
					var $this = $(this);
					var tip = $this.data('tip.'+pluginPfx);
					tip.fadeIn();
				});
			},
			remove: function () {
				// 验证选择器
				var selector = _selector.call(this);
				// 对选择器每个元素都执行方法
				return $(selector).each(function () {
					// 执行代码
					var $this = $(this);
					var tip = $this.data('tip.'+pluginPfx);
					tip.remove();
					$this.removeData('tip.'+pluginPfx);
					$this.off('mouseover.fhui-tip').off('mouseout.fhui-tip');
				});
			}
		};
	var position ={
		left : function(tip){
		var arrow =	$('.fhui-tip-arrow',tip).addClass('arrow-right');
			var offset = this.offset();
			tip.css({
				left : offset.left - tip.outerWidth() - arrow.outerWidth(),
				top : offset.top + this.outerHeight()/2 - tip.outerHeight()/2
			});
			//arrow的位置不无需再调整，根据tip位置计算所得
			arrow.css({
				top : offset.top + this.outerHeight()/2 - tip.position().top - arrow.outerHeight()/2
			});
		},
		right : function(tip){
			var arrow =	$('.fhui-tip-arrow',tip).addClass('arrow-left');
			var offset = this.offset();
			tip.css({
				left : offset.left + this.outerWidth() + arrow.outerWidth(),
				top : offset.top + this.outerHeight()/2 - tip.outerHeight()/2
			});
			//arrow的位置不无需再调整，根据tip位置计算所得
			arrow.css({
				top : offset.top + this.outerHeight()/2 - tip.position().top - arrow.outerHeight()/2
			});
		},
		top : function(tip){
			var arrow =	$('.fhui-tip-arrow',tip).addClass('arrow-bottom');
			var offset = this.offset();
			tip.css({
				left : offset.left + this.outerWidth()/2 - tip.outerWidth()/2,
				top : offset.top - tip.outerHeight() - arrow.outerHeight()
			});
			//arrow的位置不无需再调整，根据tip位置计算所得
			arrow.css({
				left : offset.left + this.outerWidth()/2 - tip.position().left - arrow.outerWidth()/2
			});
		},
		bottom : function(tip){
			var arrow =	$('.fhui-tip-arrow',tip).addClass('arrow-top');
			var offset = this.offset();
			tip.css({
				left : offset.left + this.outerWidth()/2 - tip.outerWidth()/2,
				top : offset.top + this.outerHeight() + arrow.outerHeight()
			});
			//arrow的位置不无需再调整，根据tip位置计算所得
			arrow.css({
				left : offset.left + this.outerWidth()/2 - tip.position().left - arrow.outerWidth()/2
			});
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
