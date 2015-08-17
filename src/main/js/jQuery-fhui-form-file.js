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
