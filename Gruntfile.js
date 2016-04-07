/*!
 * feihuaui's Gruntfile
 */

module.exports = function (grunt) {
  'use strict';

  // ǿ��ʹ�� Unix ���з�
  grunt.util.linefeed = '\n';
  grunt.initConfig({
	// Ԫ��Ϣ
    pkg: grunt.file.readJSON('package.json'),
	//ͷ��Ϣ
	banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.maintainers[0].email %>)\n' +
            ' * Copyright 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' */\n',
	//���jquery�Ƿ����
    jqueryCheck: [
      'if (typeof jQuery === \'undefined\') {',
      '  throw new Error(\'<%= pkg.name %>\\\'s JavaScript requires jQuery\')',
      '}\n'
    ].join('\n'),
	//���jquery�汾�Ƿ�֧��
    jqueryVersionCheck: [
      '+function ($) {',
      '  var version = $.fn.jquery.split(\' \')[0].split(\'.\')',
      '  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {',
      '    throw new Error(\'<%= pkg.name %>\\\'s JavaScript requires jQuery version 1.9.1 or higher\')',
      '  }',
      '}(jQuery);\n\n'
    ].join('\n'),
	// ��������������
	//���Ŀ¼����
    clean: {
	  build:"build",
      js: 'build/js',
	  css:'build/css',
      docs: 'docs',
	  docs_css:"docs/css"
    },
	//javascript �﷨У��
	jshint: {
		//����У�����
      options: {
        jshintrc: 'config/jshint/.jshintrc'
      },
	  //jsԴ����У��
      mainjs: {
        src: 'src/main/js/*.js'
      },
	  //���Դ���У��
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
	//У��js����ı�����ע���������jshint��ͬ�������﷨��
	jscs: {
      options: {
        config: 'config/jscs/.jscsrc'
      },
	  //jsԴ��У��
      mainjs: {
        src: '<%= jshint.mainjs.src %>'
      },
	  //���Դ���У��
      testjs: {
        src: '<%= jshint.testjs.src %>'
      }
    },
	//ƴ�ӣ��γ�һ���ļ������ɵĵ����ļ�Ϊһ��Դ��
	concat: {
      options: {
	  //ͷ��Ϣ
        banner: '<%= banner %>\n<%= jqueryCheck %>\n<%= jqueryVersionCheck %>',
        stripBanners: false
      },
	  //����jsԴ��ƴ��Ϊһ���ļ�
	  feihuauijs: {
        src: ['<%= jshint.mainjs.src %>','!src/main/js/jQuery-fhui-structure.js'],
        dest: 'build/js/<%= pkg.name %>.js'
      }
    },
	//ѹ��
	//ע����ƴ�Ӳ�ͬ
	uglify: {
      options: {
        preserveComments: 'some'
      },
	  //��ƴ�Ӻõ�jsԴ�����ѹ��
      feihuauiMinijs: {
		src: '<%= concat.feihuauijs.dest %>',
        dest: 'build/js/<%= pkg.name %>.min.js'
      }
	},
	//js ��Ԫ����
	qunit: {
      index: 'src/test/qunit/index.html'
    },
	//css��أ�����cssԴ��
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
	//css��أ����������ǰ׺
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
	  //���ɵ�css
      core: {
        options: {
          map: true
        },
        src: 'build/css/<%= pkg.name %>.css'
      },
	  //���ɵ�����css
      theme: {
        options: {
          map: true
        },
        src: 'build/css/<%= pkg.name %>-theme.css'
      },
	  //�ĵ�
	  docs:{
		src: 'docs/css/<%= pkg.name %>-docs.css'
	  }
    },
	//css�����鹤��
	csslint: {
      options: {
        csslintrc: 'config/csslint/.csslintrc'
      },
	  //���ɵ�css
      build: [
		'build/css/<%= pkg.name %>.css',
        'build/css/<%= pkg.name %>-theme.css',
		'docs/css/<%= pkg.name %>-docs.css'
      ]
    },
	//cssѹ��
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
	//��css���ͷ��Ϣ
	usebanner: {
      options: {
        position: 'top',
        banner: '<%= banner %>'
      },
	  //�������ɵ�css
      files: {
        src: 'build/css/*.css'
      },
	  docs: {
        src: 'docs/css/*.css'
      }
    },
	//CSS��������
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
	//�����帴�Ƶ�buildĿ¼��
	copy: {
      fonts: {
        src: 'src/main/resources/fonts/*',
        dest: 'build/resources/fonts/'
      }
    },
	//����ļ��Ķ���һ�иĶ����������
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
  //���Ŀ¼���﷨У�飬������У�飬ƴ�ӣ�ѹ��
  //grunt.registerTask('build-js', ['clean:js', 'jshint:mainjs', 'jscs:mainjs', 'concat','uglify']);
  grunt.registerTask('build-js', ['clean:js', 'jshint:mainjs',  'concat','uglify']);
  //css build
  //����less
  grunt.registerTask('less-compile', ['less:compileCore', 'less:compileTheme']);
  //css build
  grunt.registerTask('build-css', ['clean:css','less-compile', 'autoprefixer:core', 'autoprefixer:theme', 'usebanner:files', 'csscomb:build', 'cssmin:minifyCore', 'cssmin:minifyTheme']);
// docs css build
  grunt.registerTask('build-docs-css', ['clean:docs_css','less:compileDocs', 'autoprefixer:docs', 'usebanner:docs', 'csscomb:docs', 'cssmin:minifyDocs']);
  
  // Full distribution task.
  //ȫ��build
  grunt.registerTask('build', ['clean:build', 'build-css', 'copy:fonts', 'build-js']);
};
