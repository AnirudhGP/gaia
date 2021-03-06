'use strict';

var assert = require('assert');
var System = require('./lib/system');
var FakeLoopApp = require('./lib/fakeloopapp.js');

marionette('AttentionWindow - Permission Prompt', function() {
  var apps = {};
  apps[FakeLoopApp.DEFAULT_ORIGIN] = __dirname + '/fakeloopapp';

  var client = marionette.client({
    prefs: {
      'dom.w3c_touch_events.enabled': 1
    },
    settings: {
      'ftu.manifestURL': null,
      'lockscreen.enabled': false
    },
    apps: apps
  });

  var system;
  var fakeLoop;

  setup(function() {
    system = new System(client);
    system.waitForStartup();

    fakeLoop = new FakeLoopApp(client);
  });

  test('The prompt should be displayed on top of the attention screen',
  function() {
    fakeLoop.launch();
    fakeLoop.waitForTitleShown(true);
    client.switchToFrame();

    // The prompt is displayed
    var prompt = client.helper.waitForElement('#permission-dialog');
    var attention = client.helper.waitForElement('.attentionWindow.active');

    client.waitFor(function() {
      return prompt.displayed();
    });
    assert(prompt.displayed(), 'The prompt is on top');

    client.helper.waitForElement('#permission-yes').click();

    client.waitFor(function() {
      return attention.displayed();
    });
    assert(attention.displayed(), 'The attention window is now visible');
  });
});
