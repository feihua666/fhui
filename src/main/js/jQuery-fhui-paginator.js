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
