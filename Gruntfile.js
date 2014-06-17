module.exports = function (grunt) {

    /* Task configuration */

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        watch: {

            src: {

                files: [ 'Gruntfile.js', 'src/**/*.js' ],
                tasks: [ 'jshint:src', 'build' ],

            },

            spec: {

                files: 'spec/**/*.js',
                tasks: 'jshint:spec',

            }
        },

        concat: {

            dist: {

                src: [ 'src/tmc-web-client.js', 'src/**/*.js' ],
                dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js',
                options: {

                    separator: ';'

                }
            }
        },

        uglify: {

            dist: {

                files: {

                    'dist/<%= pkg.name %>-<%= pkg.version %>-min.js': 'dist/<%= pkg.name %>-<%= pkg.version %>.js'

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

        jasmine: {

            src: [ 'src/tmc-web-client.js', 'src/**/*.js' ],
            options: {

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
        },

        sass: {

            dist: {

                files: {

                    'demo/assets/css/tmc-web-client.css': 'src/css/tmc-web-client.scss'

                }
            }
        },

        copy: {

            assets: {

                expand: true,
                flatten: true,
                src: 'dist/*.js',
                dest: 'demo/assets/js/',
                filter: 'isFile'

            }
        }
    });

    /* Load tasks */

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');

    /* Register tasks */

    grunt.registerTask('test', [ 'jshint', 'jasmine' ]);
    grunt.registerTask('build', [ 'concat', 'uglify', 'sass', 'copy' ]);
    grunt.registerTask('default', [ 'test', 'build' ]);
}
