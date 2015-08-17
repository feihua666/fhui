﻿/*
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
