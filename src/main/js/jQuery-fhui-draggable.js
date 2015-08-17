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
