module.exports = function (grunt) {

    /* Task configuration */
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: [ 'dist/', 'coverage/', 'demo/assets/js/tmc-web-client*.js' ]
        },
        watch: {
            src: {
                files: [ 'Gruntfile.js', 'src/**/*.js', 'src/templates/**/*.template' ],
                tasks: [ 'jshint:src', 'build' ],
            },
            spec: {
                files: 'spec/**/*.js',
                tasks: 'jshint:spec',
            },
            sass: {
                files: 'src/css/*.sass',
                tasks: 'sass',
            }
        },
        handlebars: {
            template: {
                files: {
                    'dist/<%= pkg.name %>-templates.js': 'src/templates/**/*.template'
                },
                options: {
                    namespace: 'Handlebars.templates',
                    processName: function (path) {
                        // Use filename as the name of the template (View.template -> View)
                        var split = path.split('/');
                        var file = split[split.length - 1];
                        var filename = file.split('.')[0];
                        return filename;
                    }
                }
            }
        },
        concat: {
            dist: {
                src: [ 'src/<%= pkg.name %>.js', 'src/**/*.js' ],
                dest: 'dist/<%= pkg.name %>.js',
                options: {
                    separator: ';'
                }
            },
            handlebars: {
                src: ['dist/<%= pkg.name %>-templates.js',
                      'dist/<%= pkg.name %>.js'],
                dest: 'dist/<%= pkg.name %>.js',
                options: {
                    separator: ';'
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/<%= pkg.name %>-min.js': 'dist/<%= pkg.name %>.js'
                },
                options: {
                    report: 'min'
                }
            }
        },
        jshint: {
            src: {
                src: [ 'Gruntfile.js', 'src/**/*.js' ],
                options: {
                    jshintrc: 'jshint.json'
                }
            },
            spec: {
                src: 'spec/**/*.js',
                options: {
                    jshintrc: 'spec/jshint.json'
                }
            }
        },
        sass: {
            dist: {
                files: {
                    'demo/assets/css/<%= pkg.name %>.css': 'src/css/<%= pkg.name %>.sass'
                },
                options: {
                    style: 'compressed'
                }
            }
        },
        postcss: {
          options: {
            map: true,
            processors: [
              require('autoprefixer') ({browsers: 'last 2 versions'})
            ]
          },
          dist: {
            src: 'demo/assets/css/*.css'
          }
        },
        copy: {
            assets: {
                expand: true,
                flatten: true,
                src: [ 'dist/<%= pkg.name %>.js', 'dist/<%= pkg.name %>-min.js' ],
                dest: 'demo/assets/js/',
                filter: 'isFile'
            }
        },
        jasmine: {
            src: [ 'dist/<%= pkg.name %>-templates.js', 'src/<%= pkg.name %>.js', 'src/**/*.js' ],
            options: {
                vendor: [ 'http://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars.runtime.min.js' ],
                specs: 'spec/**/*-spec.js',
                template: require('grunt-template-jasmine-istanbul'),
                templateOptions: {
                    coverage: 'coverage/coverage.json',
                    report: {
                        type: 'lcov',
                        options: {
                            dir: 'coverage/'
                        }
                    }
                }
            }
        }
    });

    /* Load tasks */

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-postcss');

    /* Register tasks */

    grunt.registerTask('build', [ 'handlebars', 'concat:dist', 'concat:handlebars', 'uglify', 'sass', 'postcss', 'copy' ]);
    grunt.registerTask('default', [ 'clean', 'test', 'build' ]);
}
