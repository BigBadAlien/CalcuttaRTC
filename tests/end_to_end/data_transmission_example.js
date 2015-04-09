/**
 * Test open two tabs and check transfering data between peers.
 */

var webdriver = require("selenium-webdriver"),
    By = webdriver.By,
    assert = require("assert");

var uri = "http://localhost:8080/examples/data_transmission/";

var flow = new webdriver.promise.ControlFlow();
    //.on("uncaughtException", function(e) {
    //    console.log("uncaughtException in flow %s", e);
    //});
function done() {};

describe("Data transmission", function(){
    describe("#", function() {
        it("should open two tabs and transfer data between peers", function(done){
            this.timeout(50000);

            webdriver.promise.controlFlow().on("uncaughtException", function(e) {
                console.error("There was an unhandled exception! " + e);
            });

            var browserCaller = new webdriver.Builder().
                forBrowser("chrome").
                setControlFlow(flow).  // Comment out this line to see the difference.
                build();
            browserCaller.manage().window().setSize(800, 400);
            browserCaller.manage().window().setPosition(10, 10);
            browserCaller.get(uri);


            var browserCallee = new webdriver.Builder().
                forBrowser("chrome").
                setControlFlow(flow).
                build();
            browserCallee.manage().window().setSize(600, 400);
            browserCallee.manage().window().setPosition(800, 10);
            browserCallee.get(uri).then(function() {
                var button = browserCaller.findElement(By.className("send_big_data"));
                browserCaller.executeScript("arguments[0].click();", button);
            });

            //Wait caller error
            browserCaller.wait(function() {
                return browserCaller.getTitle().then(function(title) {
                    var error = title.match(/^(error): (.+)/);
                    var done = title.match(/^done.*/);

                    if(error !== null) {
                        return error[1];
                    } else if(done !== null) {
                        return "done";
                    }
                });
            }, 50000).then(function(message) {
                if (message !== "done") {
                    assert.fail(message, "done");
                    done();
                }
            });


            //Wait callee error
            browserCallee.wait(function() {
                return browserCallee.getTitle().then(function(title) {
                    var error = title.match(/^(error): (.+)/);
                    var done = title.match(/^done.*/);

                    if(error !== null) {
                        return error[2];
                    } else if(done !== null) {
                        return "done";
                    }
                });
            }, 50000).then(function(message) {
                if (message !== "done") {
                    assert.fail(message, "done");
                }

                browserCallee.quit();
                browserCaller.quit();
                done();
            });

        });
    });
});
