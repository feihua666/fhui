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
