const webpackConfig = require('./webpack.test.config.js');

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    // list of files / patterns to load in the browser
    files: [
      { pattern: 'test/**/*.test.js', watched: false },
    ],
    // preprocess matching files before serving them to the browser
    preprocessors: {
      'test/**/*.test.js': ['webpack'],
    },
    reporters: ['spec'],
    // port: 9876,
    // colors: true,
    // logLevel: config.LOG_INFO,
    // autoWatch: true,
    browsers: ['ChromeHeadless', 'FirefoxHeadless'],
    // singleRun: true,
    concurrency: Infinity,
    webpack: webpackConfig,
  });
};
