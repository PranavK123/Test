/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var storage = window.localStorage;
var name = storage.getItem("name");
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        try {
            ApiAIPlugin.init(
                {
                    subscriptionKey: "10",
                    clientAccessToken: "07eb0d835328443d9a6f2e2180c3f99e"
                }
            );
            var recognizing;
            reset();
            recognition = new SpeechRecognition();
            recognition.onend = reset();
            recognition.continuous = true;
            var i = 0;
		    recognition.onresult = function(event) {
		        if (event.results.length > 0) {
		        	alert(event.results[i][0].transcript);
		            if (event.results[i][0].transcript.toUpperCase() === name.toUpperCase()) {
		            	navigator.vibrate(500);
		            	alert("Matched");
		            }
		            i++;
		        }
		        recognition.start();
		    }
        }
        catch (error) {
            alert(error);
        }
    }
};
function sendVoice() {
    try {
        ApiAIPlugin.setListeningStartCallback(function () {
            // alert("listening started");
        });
         
        ApiAIPlugin.setListeningFinishCallback(function () {
            // alert("listening stopped");
        });
        ApiAIPlugin.requestVoice(
           {}, // empty for simple requests, some optional parameters can be here 
           function (response) {
               // place your result processing here
               alert(JSON.stringify(response.result.fulfillment.speech));
           },
           function (error) {
               // place your error processing here
               alert(error);
        });                
    } catch (e) {
        alert(e);
    }
}
function reset() {
  recognizing = false;
  button1.innerHTML = "Click to Speak";
}

function toggleStartStop() {
  if (recognizing) {
    recognition.stop();
    reset();
  } else {
    recognition.start();
    recognizing = true;
    button1.innerHTML = "Click to Stop";
  }
}

function speak() {
	var u = new SpeechSynthesisUtterance();
	u.text = prompt("Enter:", "");
	u.lang = "en-US";
	speechSynthesis.speak(u);
}

function changeName() {
	name = prompt("Enter name:", "");
	storage.setItem("name", name);
	alert(storage.getItem("name"));
}

function test() {
	navigator.device.capture.captureAudio(
		captureSuccess, captureError, {limit:2}
	);
}

var captureSuccess = function(mediaFiles) {
    var i, path, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        path = mediaFiles[i].fullPath;
        alert(path);
        // do something interesting with the file
    }
};

// capture error callback
var captureError = function(error) {
    navigator.notification.alert('Error code: ' + error);
};
           
