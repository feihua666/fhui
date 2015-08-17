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
