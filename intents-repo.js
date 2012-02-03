
(function() {

  function _getIntentRegistrations() {
      if (localStorage.intentHandlers) {
          return JSON.parse(localStorage.intentHandlers);
      }
      return {};
  }
  
  function _setIntentRegistrations(ob) {
      localStorage.intentHandlers = JSON.stringify(ob);
  }

  var chan = Channel.build({window: window.parent, origin: "*", scope: "intents_channel"});
  chan.bind("registerIntentHandler", function(trans, data) {
    var intentsOb = _getIntentRegistrations();
    if (!intentsOb[data.intent]) {
        intentsOb[data.intent] = {};
    }
    if (!intentsOb[data.intent][data.filter]) {
        intentsOb[data.intent][data.filter] = {};
    }
    intentsOb[data.intent][data.filter][data.url] = data;
    _setIntentRegistrations(intentsOb);
  });

  chan.bind("isIntentHandlerRegistered", function(trans, data) {
    var intentsOb = _getIntentRegistrations();
    try {
        return !!intentsOb[data.intent][data.filter][data.url];
    } catch(ex) {
        return false;
    }
  });

  chan.bind("unregisterIntentandler", function(trans, data) {
    var intentsOb = _getIntentRegistrations();
    try {
        delete localStorage.intentHandlers[data.intent][data.filter][data.url];
    } catch (ex) {
        return; // nothing to do.
    }
    _setIntentRegistrations(intentsOb);
  });

})();
