This directory contains some demo "intent handlers".  While they can be served by the server as a convenience, they don't rely on being on the same origin as the server.  One way to test this out is to load them as file:/// URLs - but Browsers take a dim view of file:/// content hosted in iframes.  To work around this, you can modify your profile's user.js and add the following lines:

```
user_pref("capability.policy.policynames", "localfilelinks");
user_pref("capability.policy.localfilelinks.sites", "http://localhost:8888");
user_pref("capability.policy.localfilelinks.checkloaduri.enabled", "allAccess");
```

You will then be able to load them from a file:/// URL (to re-register it) and the picker will display them.
