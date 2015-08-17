﻿/*
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