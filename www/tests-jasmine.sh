#!/usr/bin/env node

var jasmine = require('jasmine-node');
var sys = require('util');
app = require('./test_app.js');

for(var key in jasmine) {
  global[key] = jasmine[key];
}

var isVerbose = true;
var showColors = true;

var specsFolder = "";

process.argv.forEach(function(arg){
    if (arg.indexOf('-oneFolder') !== -1) {
        specsFolder = arg.substring(11,arg.length);
    }
    switch(arg) {
          case '--color': showColors = true; break;
          case '--noColor': showColors = false; break;
          case '--verbose': isVerbose = true; break;
    }
});

specsFolder = __dirname + '/tests/specifications' + (specsFolder != "" ? "/" : "") + specsFolder;

jasmine.executeSpecsInFolder(specsFolder, function(runner, log){
  db.disconnect();
  if (runner.results().failedCount == 0) {
    process.exit(0);
  }
  else {
    process.exit(1);
  }
}, isVerbose, showColors, false, false, new RegExp(".(js)$", "i"), {reporter: false});
