Introduction
------------

This is an implementation of a WebIntents-like API, as sketched out by Ian Hickson in http://lists.w3.org/Archives/Public/public-webapps/2011JulSep/1509.html

This is implemented as a pure-JS shim - pages need only load `intents.js` and they can function as an invoker of intent or as a handler of intents.  A rough outline of how it hangs together is:

* intents.js arranges to create a hidden iframe back to localhost:8888 and uses a jschannel to communicate for registration and unregistration.  localStorage on this host is the "repository".
* When client code calls `invokeIntent()`, the picker is displayed an a jschannel created between the client code and the picker.
* The picker loads the intent handlers in an iframe and yet another jschannel exists between the picker and the handler.
Thus, the picker acts as a kind of relay - when the client communicates with the handler it goes over its jschannel to the picker, which then relays it over the jschannel to the handler.

As Firefox doesn't implement MessagePorts yet, a simple port-like javascript object is used.

Running the demo
----------------

* Start `server.py` in the root of this tree.  This will start a http server on port 8888.
* Open http://localhost:8888/handlers/sample_handler.html in your browser.  Not much will happen but it should call registerIntentHandler to register that page as a handler for a 'share' intent.  Close the page.

We also use the Firefox Share addon as an OAuth helper for the google etc plugins.  This takes a few steps.

* Grab the `experiment/hixtents` branch from the git repo at https://github.com/mhammond/fx-share-addon
* Grab the `develop` branches from the repos at https://github.com/mozilla/oauthorizer/ and https://github.com/mozilla/activities
* After activating the addon-sdk, run the command:  
`cfx run --pkgdir=path-to-fx-share-addon --package-path=path-to-oauthorizer package-path=path-to-activities`
* Start `server.py' in the root of the fx-share-addon tree.  This will start a http server on port 8889.
* Open http://localhost:8889/data/apps/google/google.html - this will register that page as a share handler.  Close the page.
* Open clients/task.html in the browser - you can open this either as a file:/// URL or via the server (ie, http://localhost:8888/clients/simple.html.
* Click on the link to invoke a share intent.

You should now see the picker with the 2 handlers displayed in tabs.  The google service should be fully functional - ie, you can login and send an email.

Notable differences from Hixie's sketch
---------------------------------------

Instead of:

    var port = navigator.handleIntent(intent, filter);  
    port.postMessage(data);  
    port.onmessage = function (event) { handle(event.data) };  

we use a callback approach:

    navigator.handleIntent(intent, filter, function(port) {  
       port.postMessage(data);  
       port.onmessage = function (event) { handle(event.data) };  
    });

This is done as it make take some time for the UI to select an intent handler and we want to avoid blocking the main thread.

Similarly, `registerIntentHandler`, `isIntentHandlerRegistered` and `unregisterIntentHandler` take a callback, although this was done for pragmatic reasons - the shim uses `postMessage` to a server for the respository implementation.
