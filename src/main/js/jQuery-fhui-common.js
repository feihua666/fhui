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
