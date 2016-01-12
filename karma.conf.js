module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      // bower:js
      'src/main/webapp/bower_components/jquery/dist/jquery.js',
      'src/main/webapp/bower_components/angular/angular.js',
      'src/main/webapp/bower_components/angular-route/angular-route.js',
      'src/main/webapp/bower_components/angular-loader/angular-loader.js',
      'src/main/webapp/bower_components/angular-mocks/angular-mocks.js',
      'src/main/webapp/bower_components/angular-sanitize/angular-sanitize.js',
      'src/main/webapp/bower_components/bootstrap/dist/js/bootstrap.js',
      'src/main/webapp/bower_components/bootstrap3-dialog/dist/js/bootstrap-dialog.min.js',
      'src/main/webapp/bower_components/lodash/dist/lodash.compat.js',
      'src/main/webapp/bower_components/restangular/dist/restangular.js',
      'src/main/webapp/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'src/main/webapp/bower_components/leaflet/dist/leaflet-src.js',
      'src/main/webapp/bower_components/leaflet-plugins/control/Distance.js',
      'src/main/webapp/bower_components/leaflet-plugins/control/Layers.Load.js',
      'src/main/webapp/bower_components/leaflet-plugins/control/Permalink.js',
      'src/main/webapp/bower_components/leaflet-plugins/control/Permalink.Layer.js',
      'src/main/webapp/bower_components/leaflet-plugins/control/Permalink.Line.js',
      'src/main/webapp/bower_components/leaflet-plugins/control/Permalink.Marker.js',
      'src/main/webapp/bower_components/leaflet-plugins/layer/Icon.Canvas.js',
      'src/main/webapp/bower_components/leaflet-plugins/layer/Layer.Deferred.js',
      'src/main/webapp/bower_components/leaflet-plugins/layer/Marker.Rotate.js',
      'src/main/webapp/bower_components/leaflet-plugins/layer/Marker.Text.js',
      'src/main/webapp/bower_components/leaflet-plugins/layer/OpenStreetBugs.js',
      'src/main/webapp/bower_components/leaflet-plugins/layer/vector/GPX.js',
      'src/main/webapp/bower_components/leaflet-plugins/layer/vector/GPX.Speed.js',
      'src/main/webapp/bower_components/leaflet-plugins/layer/vector/KML.js',
      'src/main/webapp/bower_components/leaflet-plugins/layer/vector/OSM.js',
      'src/main/webapp/bower_components/leaflet-plugins/layer/tile/Bing.js',
      'src/main/webapp/bower_components/leaflet-plugins/layer/tile/Google.js',
      'src/main/webapp/bower_components/leaflet-plugins/layer/tile/Yandex.js',
      'src/main/webapp/bower_components/esri-leaflet/dist/esri-leaflet.js',
      'src/main/webapp/bower_components/esri-leaflet-clustered-feature-layer/dist/esri-leaflet-clustered-feature-layer.js',
      'src/main/webapp/bower_components/Leaflet.EasyButton/src/easy-button.js',
      'src/main/webapp/bower_components/angular-leaflet-directive/dist/angular-leaflet-directive.js',
      'src/main/webapp/bower_components/Leaflet.awesome-markers/dist/leaflet.awesome-markers.js',
      'src/main/webapp/bower_components/underscore/underscore.js',
      'src/main/webapp/bower_components/spin.js/spin.js',
      'src/main/webapp/bower_components/angular-spinner/angular-spinner.js',
      'src/main/webapp/bower_components/spin/javascripts/jquery.spin.js',
      'src/main/webapp/bower_components/ng-csv/build/ng-csv.min.js',
      'src/main/webapp/bower_components/angu-fixed-header-table/angu-fixed-header-table.js',
      'src/main/webapp/bower_components/angular-wizard/dist/angular-wizard.min.js',
      'src/main/webapp/bower_components/angular-cookie-law/dist/angular-cookie-law.min.js',
      // endbower
      'src/main/webapp/components/**/*.js',
      'src/main/webapp/view*/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],
            
    // reporters : ['junit'], // uncomment if junit reports are needed

    junitReporter : {
      outputFile: 'test-results.xml',
      suite: 'unit'
    }

  });
};
