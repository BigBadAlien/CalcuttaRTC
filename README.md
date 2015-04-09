Simple p2p connection and data transfering with WebRTC

### Installation and running
Needed global gulp and bower.

```
npm install -g lodash-cli
npm install
gulp install
```

For starting statics and WebRTC signaling server
```
node server.js
```

### Testing
```
gulp test
```
For testing [ChromeDriver](http://chromedriver.storage.googleapis.com/index.html) must be in one of the $PATH folder.

### Usages
```javascript
var RTCManager = require("rtc_manager");

//For callee
RTCManager.listen(function(channel) {
    //Doing channel.send("or something")
});

//For caller
RTCManager.createChannel(function(channel) {
    //Doing channel.send("or something")
});
```

More examples in folder public/examples .

### Build
```
gulp build
```
