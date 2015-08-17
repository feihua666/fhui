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