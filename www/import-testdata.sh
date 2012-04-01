#!/usr/bin/env node

var jasmine = require('jasmine-node');
var sys = require('util');
app = require('./test_app.js');

for(var key in jasmine) {
  global[key] = jasmine[key];
}

var isVerbose = true;
var showColors = true;

process.argv.forEach(function(arg){
    switch(arg) {
          case '--color': showColors = true; break;
          case '--noColor': showColors = false; break;
          case '--verbose': isVerbose = true; break;
      }
});

jasmine.executeSpecsInFolder(__dirname + '/tests/test-data/specifications', function(runner, log){
  db.disconnect();
  if (runner.results().failedCount == 0) {
    process.exit(0);
  }
  else {
    process.exit(1);
  }
}, isVerbose, showColors, false, false, new RegExp(".(js)$", "i"), {reporter: false});
