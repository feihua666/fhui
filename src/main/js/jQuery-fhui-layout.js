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
