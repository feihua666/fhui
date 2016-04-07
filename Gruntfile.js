/*!
 * feihuaui's Gruntfile
 */

module.exports = function (grunt) {
  'use strict';

  // 强制使用 Unix 换行符
  grunt.util.linefeed = '\n';
  grunt.initConfig({
	// 元信息
    pkg: grunt.file.readJSON('package.json'),
	//头信息
	banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.maintainers[0].email %>)\n' +
            ' * Copyright 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' */\n',
	//检查jquery是否存在
    jqueryCheck: [
      'if (typeof jQuery === \'undefined\') {',
      '  throw new Error(\'<%= pkg.name %>\\\'s JavaScript requires jQuery\')',
      '}\n'
    ].join('\n'),
	//检查jquery版本是否支持
    jqueryVersionCheck: [
      '+function ($) {',
      '  var version = $.fn.jquery.split(\' \')[0].split(\'.\')',
      '  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {',
      '    throw new Error(\'<%= pkg.name %>\\\'s JavaScript requires jQuery version 1.9.1 or higher\')',
      '  }',
      '}(jQuery);\n\n'
    ].join('\n'),
	// 以下是任务配置
	//清空目录配置
    clean: {
	  build:"build",
      js: 'build/js',
	  css:'build/css',
      docs: 'docs',
	  docs_css:"docs/css"
    },
	//javascript 语法校验
	jshint: {
		//参数校验规则
      options: {
        jshintrc: 'config/jshint/.jshintrc'
      },
	  //js源代码校验
      mainjs: {
        src: 'src/main/js/*.js'
      },
	  //测试代码校验
      testjs: {
        options: {
          jshintrc: 'config/jshint/test/.jshintrc'
        },
        src: 'src/test/js/*.js'
      },
	  docsjs:{
		options: {
          jshintrc: 'config/jshint/test/.jshintrc'
        },
		src: 'src/docs/js/*.js'
	  }
    },
	//Grunt task for checking JavaScript Code Style with jscs
	//校验js代码的编码风格，注意与上面的jshint不同（侧重语法）
	jscs: {
      options: {
        config: 'config/jscs/.jscsrc'
      },
	  //js源码校验
      mainjs: {
        src: '<%= jshint.mainjs.src %>'
      },
	  //测试代码校验
      testjs: {
        src: '<%= jshint.testjs.src %>'
      }
    },
	//拼接，形成一个文件，生成的单独文件为一个源码
	concat: {
      options: {
	  //头信息
        banner: '<%= banner %>\n<%= jqueryCheck %>\n<%= jqueryVersionCheck %>',
        stripBanners: false
      },
	  //所有js源码拼接为一个文件
	  feihuauijs: {
        src: ['<%= jshint.mainjs.src %>','!src/main/js/jQuery-fhui-structure.js'],
        dest: 'build/js/<%= pkg.name %>.js'
      }
    },
	//压缩
	//注意与拼接不同
	uglify: {
      options: {
        preserveComments: 'some'
      },
	  //将拼接好的js源码进行压缩
      feihuauiMinijs: {
		src: '<%= concat.feihuauijs.dest %>',
        dest: 'build/js/<%= pkg.name %>.min.js'
      }
	},
	//js 单元测试
	qunit: {
      index: 'src/test/qunit/index.html'
    },
	//css相关，编译css源码
	less: {
      compileCore: {
		src: 'src/main/less/<%= pkg.name %>.less',
        dest: 'build/css/<%= pkg.name %>.css'
      },
      compileTheme: {
        src: 'src/main/less/<%= pkg.name %>-theme.less',
        dest: 'build/css/<%= pkg.name %>-theme.css'
      },
	  compileDocs:{
		src: 'src/docs/less/<%= pkg.name %>-docs.less',
        dest: 'docs/css/<%= pkg.name %>-docs.css'
	  }
    },
	//css相关，处理浏览器前缀
	autoprefixer: {
      options: {
        browsers: [
          'Android 2.3',
          'Android >= 4',
          'Chrome >= 20',
          'Firefox >= 24', // Firefox 24 is the latest ESR
          'Explorer >= 8',
          'iOS >= 6',
          'Opera >= 12',
          'Safari >= 6'
        ]
      },
	  //生成的css
      core: {
        options: {
          map: true
        },
        src: 'build/css/<%= pkg.name %>.css'
      },
	  //生成的主题css
      theme: {
        options: {
          map: true
        },
        src: 'build/css/<%= pkg.name %>-theme.css'
      },
	  //文档
	  docs:{
		src: 'docs/css/<%= pkg.name %>-docs.css'
	  }
    },
	//css代码检查工具
	csslint: {
      options: {
        csslintrc: 'config/csslint/.csslintrc'
      },
	  //生成的css
      build: [
		'build/css/<%= pkg.name %>.css',
        'build/css/<%= pkg.name %>-theme.css',
		'docs/css/<%= pkg.name %>-docs.css'
      ]
    },
	//css压缩
	cssmin: {
      options: {
        compatibility: 'ie8',
        keepSpecialComments: '*',
        noAdvanced: true
      },
      minifyCore: {
        src: 'build/css/<%= pkg.name %>.css',
        dest: 'build/css/<%= pkg.name %>.min.css'
      },
      minifyTheme: {
        src: 'build/css/<%= pkg.name %>-theme.css',
        dest: 'build/css/<%= pkg.name %>-theme.min.css'
      },
      minifyDocs: {
        src: 'docs/css/<%= pkg.name %>-docs.css',
        dest: 'docs/css/<%= pkg.name %>-docs.min.css'
      }
    },
	//给css添加头信息
	usebanner: {
      options: {
        position: 'top',
        banner: '<%= banner %>'
      },
	  //所有生成的css
      files: {
        src: 'build/css/*.css'
      },
	  docs: {
        src: 'docs/css/*.css'
      }
    },
	//CSS属性排序
	csscomb: {
      options: {
        config: 'config/csscomb/.csscomb.json'
      },
      build: {
        expand: true,
        cwd: 'build/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'build/css/'
      },
	  docs: {
        expand: true,
        cwd: 'docs/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'docs/css/'
      }
    },
	//将字体复制到build目录下
	copy: {
      fonts: {
        src: 'src/main/resources/fonts/*',
        dest: 'build/resources/fonts/'
      }
    },
	//监测文件改动，一有改动则进行任务
    watch: {
      srcmain: {
        files: '<%= jshint.mainjs.src %>',
        tasks: ['jshint:srcmain', 'qunit', 'concat']
      },
      srctest: {
        files: '<%= jshint.testjs.src %>',
        tasks: ['jshint:srctest', 'qunit']
      },
      less: {
        files: ['src/main/less/*.less','src/docs/less/*.less'],
        tasks: 'less'
      }
    }
  });
    // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
  require('time-grunt')(grunt);
  // js build
  //清空目录，语法校验，编码风格校验，拼接，压缩
  //grunt.registerTask('build-js', ['clean:js', 'jshint:mainjs', 'jscs:mainjs', 'concat','uglify']);
  grunt.registerTask('build-js', ['clean:js', 'jshint:mainjs',  'concat','uglify']);
  //css build
  //编译less
  grunt.registerTask('less-compile', ['less:compileCore', 'less:compileTheme']);
  //css build
  grunt.registerTask('build-css', ['clean:css','less-compile', 'autoprefixer:core', 'autoprefixer:theme', 'usebanner:files', 'csscomb:build', 'cssmin:minifyCore', 'cssmin:minifyTheme']);
// docs css build
  grunt.registerTask('build-docs-css', ['clean:docs_css','less:compileDocs', 'autoprefixer:docs', 'usebanner:docs', 'csscomb:docs', 'cssmin:minifyDocs']);
  
  // Full distribution task.
  //全部build
  grunt.registerTask('build', ['clean:build', 'build-css', 'copy:fonts', 'build-js']);
};
