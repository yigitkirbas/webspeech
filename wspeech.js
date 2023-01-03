var transcriptClass = '';
var final_transcript = '';
var interim_transcript = '';
var recognizing = false;
var ignore_onend;
var imageId = '';
var obj = {};


if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function () {
        recognizing = true;
        document.getElementById(imageId).src = 'mic-animate.gif';
    };

    recognition.onerror = function (event) {
        // console.log(event);
        if (event.error == 'no-speech') {
            document.getElementById(imageId).src = 'mic.gif';
            ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
            document.getElementById(imageId).src = 'mic.gif';
            ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
            document.getElementById(imageId).src = 'mic-slash.gif';
            ignore_onend = true;
        }
    };

    recognition.onend = function () {
        recognizing = false;
        if (ignore_onend) {
            return;
        }
        document.getElementById(imageId).src = 'mic.gif';
        if (previmageId != imageId){
            document.getElementById(previmageId).src = 'mic.gif'
        }
        if (!final_transcript) {
            return;
        }
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
            var range = document.createRange();
            range.selectNode(document.getElementById(transcriptClass.id));
            window.getSelection().addRange(range);
        }
    };
    var character= '…';
    recognition.onresult = function (event) {
        console.log(event.results)
        if (event.results[event.results.length - 1].isFinal) {
            final_transcript = event.results[event.results.length - 1][0].transcript;
            if (transcriptClass.value.indexOf(character) > -1) {
                transcriptClass.value = transcriptClass.value.substring(0, transcriptClass.value.indexOf(character));
            }
            transcriptClass.value += capitalize(final_transcript);
        }
        else {
            interim_transcript = character + event.results[event.results.length - 1][0].transcript;

            if (transcriptClass.value.indexOf(character) > -1) {
                transcriptClass.value = transcriptClass.value.substring(0, transcriptClass.value.indexOf(character));
            }
            transcriptClass.value += interim_transcript;
        }

    };
}
var previmageId = '';
function startButtonNew(event) {

    if (recognizing) {
        recognition.stop();      
    }
    else{
        previmageId = event.srcElement.id;
    }    

    console.log(event);
    console.log(event.path[1].id)
    var clickId = document.getElementById(event.path[1].id);

    final_transcript = '';
    transcriptClass = clickId.previousElementSibling;
    console.log(transcriptClass)
    imageId = event.srcElement.id;
    recognition.lang = 'tr-TR';

    recognition.start();
    ignore_onend = false;

    event.srcElement.src = 'mic-slash.gif';

}

function upgrade() {
    start_button.style.visibility = 'hidden';
}


var first_char = /\S/;
function capitalize(s) {
    return s.replace(first_char, function (m) { return m.toUpperCase(); });
}

var inputs, textareas;
document.addEventListener("DOMContentLoaded", function () {

    inputs = document.getElementsByTagName('input');
    textareas = document.getElementsByTagName('textarea');

    //   console.log(inputs);
    //   console.log(textareas);

    for (var i = 0; i < inputs.length; ++i) {
        var btn = document.createElement("button");

        btn.id = 'ibtn' + i;
        btn.className = 'start_button'
        btn.style = "border: 0;background-color:transparent;padding: 0";
        btn.innerHTML = '<img id="istart_img_' + i + '"  src="mic.gif" >';
        btn.onclick = function () {
            startButtonNew(event); return false;
        }
        inputs[i].after(btn);
    }

    for (var i = 0; i < textareas.length; i++) {
        var btn = document.createElement("button");

        btn.id = 'tbtn' + i;
        btn.className = 'start_button'
        btn.style = "border: 0;background-color:transparent;padding: 0";
        btn.innerHTML = '<img id="tstart_img_' + i + '"  src="mic.gif" >';
        btn.onclick = function () {
            startButtonNew(event); return false;
        }
        textareas[i].after(btn);
    }

});



