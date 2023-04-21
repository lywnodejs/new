function __log(e, data) {
//        log.innerHTML += "\n" + e + " " + (data || '');
}

var audio_context;
var recorder;
var token;
var recBtn = document.getElementById('recBtn')
var isRecording = false;
recording()
getToken()

function startUserMedia(stream) {
  console.log(stream)
  var input = audio_context.createMediaStreamSource(stream);
  recorder = new Recorder(input);
}

function recording() {
  recBtn.onclick = function () {
    if (isRecording) {
      recorder && recorder.stop();
      createDownloadLink();
      recorder.clear();
      isRecording = false
    } else {
      audio_context && audio_context.resume()
      recorder && recorder.record();
      isRecording = true;
    }
  }
}

function createDownloadLink() {

  recorder && recorder.exportWAV(function (blob) {
    var url = URL.createObjectURL(blob);
    getTextRequest(blob, url)
  });
}

function getToken() {
  var getTokenParam = {
    grant_type: "client_credentials",
    client_id: "sejadtjouZfMmEOneY3PFE0l",
    client_secret: 'cea7ae50d33ceada8f4a5942ebe4b847'
  }
  var queryTokenStr = objToString(getTokenParam)
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true
  var url = '/openapi/token' + queryTokenStr
  // 开始上传
  xhr.open("POST", url, true);
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  var response = {responseText: ''}
  xhr.onload = function (e) {
    if (this.status == 200 || this.status == 304) {
      response.responseText = this.responseText
      token = JSON.parse(response.responseText).access_token;
    }
  };

  xhr.send()
}

function getTextRequest(blob, audioUrl) {
  var reader = new FileReader();
  reader.readAsDataURL(blob);

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true
  var url = '/vop/server_api'
  // 开始连接
  xhr.open("POST", url, true);
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.setRequestHeader('Content-Type', 'application/json');

  var size = blob.size
  xhr.onload = function (e) {
    if (this.status == 200 || this.status == 304) {
      var responseText = JSON.parse(this.responseText);
      var text;
      if (responseText.err_no == 0) {
        text = responseText.result[0]
      } else {
        text = ""
      }

      console.log(text)
      if (text) {
        freeQuestion(text, text)
      } else {
        sendQuestion('没有识别您的问题', null, false)
      }
      // var questionHtml = '<div class="question clearfix"><div class="q-voice clearfix"><div class="fr voice" onclick="playAudio(this)"><span class="q-voice-play"></span><audio src="' + audioUrl + '"></audio></div><span class="fr"></span></div><div class="q-font fr"><div class="text">' + text + '</div></div></div>'
      // $('.center').append(questionHtml)

      // var questions = $('.center .question')
      // var question = questions.eq(questions.length - 1)
      // var audio = question.find('audio')[0]
      //
      // audio.ondurationchange = function () {
      //   question.find('.fr').eq(1).text(Math.round(audio.duration) + '″')
      // }
    }
  };
  reader.onload = function () {
    var speechObj = {
      token: token,
      base64data: ''
    }
    var base64data = this.result;
    speechObj.base64data = base64data.substr(base64data.indexOf(',') + 1)
    var param = {
      "format": "wav",
      "rate": 16000,
      "dev_pid": 1536,
      "channel": 1,
      "token": token,
      "cuid": "baidu_workshop",
      "len": size,
      "speech": speechObj.base64data, // xxx为 base64（FILE_CONTENT）
    }
    param = JSON.stringify(param)
    xhr.send(param)
  }
}

function objToString(obj) {
  var str = '?'
  for (var item in obj) {
    str += item + '=' + obj[item] + "&"
  }
  str = str.substr(0, str.length - 1)
  return str
}


function playAudio(audio) {
  var audioContainer = $('.center .clearfix .voice')
  var audioIndex = audioContainer.index(audio)

  for (var i = 0; i < audioContainer.length; i++) {
    if (i == audioIndex) {
      continue
    } else if (audioContainer.eq(i).find('audio')[0].ended == false) {
      var audioTmp = audioContainer.eq(i)
      var audioTmpAudio = audioContainer.eq(i).find('audio')[0]
      audioTmpAudio.pause()
      audioTmpAudio.currentTime = 0;
      var $audioTmp = $(audioTmp)

      if ($audioTmp.attr('class') == 'fl voice') {
        $audioTmp.find('.a-voice-play').css('background-image', 'url("./img/left-stop-min.png")')
      }
      if ($audioTmp.attr('class') == 'fr voice') {
        audioTmpAudio = $audioTmp.find('audio')[0]
        $audioTmp.find('.q-voice-play').css('background-image', 'url("./img/right-stop-min.png")')
      }
    }
  }
  audio.getElementsByTagName('audio')[0].play()
  var $audio = $(audio)

  audio = $audio.find('audio')[0]
  if ($audio.attr('class') == 'fl voice') {
    $audio.find('.a-voice-play').css('background-image', 'url("./img/left-play.gif")')
  }
  if ($audio.attr('class') == 'fr voice') {
    audio = $audio.find('audio')[0]
    $audio.find('.q-voice-play').css('background-image', 'url("./img/right-play.gif")')
    audio.onended = function () {
      $audio.find('.q-voice-play').css('background-image', 'url("./img/right-stop-min.png")')
    }
  }
}

window.onload = function init() {
  try {
    // webkit shim
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.getUserMedia;
    window.URL = window.URL || window.webkitURL;

    audio_context = new AudioContext;
  } catch (e) {
    // alert('No web audio support in this browser!');
    console.log('当前环境不支持语音，推荐使用新版本的chrome或火狐浏览器，同时一定要使用https协议!')
  }

  // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }

  // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
  // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {

      // 首先，如果有getUserMedia的话，就获得它
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }

      // 否则，为老的navigator.getUserMedia方法包裹一个Promise
      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    }
  }

  navigator.getUserMedia({audio: true}, startUserMedia, function (e) {
    __log('No live audio input: ' + e);
    console.log('没有发现音频设备')
  });
};
