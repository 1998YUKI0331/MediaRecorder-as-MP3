var constraints = { video: true, audio: true };

var shareBtn = document.querySelector("button#shareScreen");
var recBtn = document.querySelector("button#rec");
var stopBtn = document.querySelector("button#stop");

var videoElement = document.querySelector("video");
var downloadLink = document.querySelector("a#downloadLink");

videoElement.controls = false;

var mediaRecorder;
var chunks = [];
var localStream = null;

function onShareScreen() {
  if (navigator.mediaDevices.getDisplayMedia && window.MediaRecorder !== undefined) {
    navigator.mediaDevices.getDisplayMedia(constraints).then(function(screenStream) {
      localStream = screenStream;
      localStream.getTracks().forEach(function(track) {});

      videoElement.srcObject = localStream;
      videoElement.play();
      videoElement.muted = true;
      recBtn.disabled = false;
      shareBtn.disabled = true;

      try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        window.audioContext = new AudioContext();
      } catch (e) {
      }
    })
  }
}

function onBtnRecordClicked() {
  if (localStream == null) {
    alert("Could not get local stream from mic/camera");
  } else {
    recBtn.disabled = true;
    stopBtn.disabled = false;

    if (typeof MediaRecorder.isTypeSupported == "function") {
      var options = { mimeType: "audio/webm; codecs=opus" };
      mediaRecorder = new MediaRecorder(localStream, options);
    } else {
      mediaRecorder = new MediaRecorder(localStream);
    }

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    };

    mediaRecorder.onstop = function() {
      var blob = new Blob(chunks, { type: "audio/webm" });

      chunks = [];
      var name = "video_" + ".mp3";

      W3Module.convertWebmToMP3(blob).then((mp3Blob) => {
        let formData = new FormData();
        formData.append('audio', mp3Blob, name);

        var videoURL = window.URL.createObjectURL(mp3Blob);
        downloadLink.href = videoURL;
        videoElement.src = videoURL;
        downloadLink.innerHTML = "Download video file";
  
        downloadLink.setAttribute("download", name);
        downloadLink.setAttribute("name", name);

        $.ajax({
          type: 'post',
          url: '/',
          cache: false,
          data: formData,
          processData: false,
          contentType: false
        }).catch(error => {
          console.log(error.message)
        })
      });
    };

    mediaRecorder.start(10);
  }
}

function onBtnStopClicked() {
  mediaRecorder.stop();
  videoElement.controls = true;
  recBtn.disabled = false;
  stopBtn.disabled = true;
}