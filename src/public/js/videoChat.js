function videoChat(divId) {
  $(`#video-chat-${divId}`).unbind("click").on("click", function () {
    let targetId = $(this).data("chat");
    let callerName = $("#navbar-username").text();

    let dataToEmit = {
      listenerId: targetId,
      callerName: callerName
    };

    //step 01 of caller
    socket.emit("caller-check-listener-online-or-not", dataToEmit);

  });
}

function playVideoStream(videoTagId, stream) {
  let video = document.getElementById(videoTagId);
  video.srcObject = stream;
  video.onloadeddata = function () {
    video.play();
  }
};

function closeVideoStream(stream) {
  return stream.getTracks().forEach(track => track.stop());
}

$(document).ready(function () {
  //step 02 of caller
  socket.on("server-send-listener-is-offline", function () {
    alertify.notify("Người dùng này hiện không trực tuyến.", "error", 7);
  });
  let iceServerList = $("#ice-server-list").val();

  let getPeerId = "";
  let peer = new Peer({
    key: "peerjs",
    host: "peerjs-server-trungquandev.herokuapp.com",
    secure: true,
    port: 443,
    config: {"iceServerS": JSON.parse(iceServerList)}
  });
  peer.on("open", function (peerId) {
    getPeerId = peerId;
  });
  //step 03 of listener
  socket.on("server-request-peer-id-of-listener", function (response) {
    let listenerName = $("#navbar-username").text();
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: listenerName,
      listenerPeerId: getPeerId
    };

    //step 04 of listener
    socket.emit("listener-emit-peer-id-to-server", dataToEmit);
  });
  let timerInterval;
  //step 05 of listener
  socket.on("server-send-peer-id-of-listener-to-caller", function (response) {
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId
    };

    //step 6 of caller
    socket.emit("caller-request-call-to-server", dataToEmit);

    Swal.fire({
      title: `Đang gọi cho &nbsp; <span style = "color: #2ecc71;">${response.listenerName}</span> &nbsp; <i class="fa fa-volume-control-phone"></i>`,
      html: `
        Thời gian: <strong style = "color: #2ecc71;"></strong> giây <br/><br/>
        <button id="btn-cancel-call" class="btn btn-danger">
          Hủy cuộc gọi
        </button>
        `,
      backdrop: "rgba(85, 85, 85, 0.4)",
      width: "52rem",
      allowOutsideClick: false,
      timer: 30000,
      timerProgressBar: true,
      onBeforeOpen: () => {
        $("#btn-cancel-call").unbind("click").on("click", function () {
          Swal.close();
          clearInterval(timerInterval);

          //step 07 of caller
          socket.emit("caller-cancel-request-call-to server", dataToEmit);
        })
        if (Swal.getContent().querySelector !== null) {
          Swal.showLoading()
          timerInterval = setInterval(() => {
            Swal.getContent().querySelector("strong")
              .textContent = Math.ceil(Swal.getTimerLeft() / 1000);
          }, 1000);
        }
      },
      onOpen: () => {
        //step 12 of caller
        socket.on("server-send-reject-call-listener", function (response) {
          Swal.close();
          clearInterval(timerInterval);

          Swal.fire({
            type: "info",
            title: `<span style = "color: #2ecc71;">${response.listenerName}</span> &nbsp; đã từ chối cuộc gọi của bạn.`,
            backdrop: "rgba(85, 85, 85, 0.4)",
            width: "52rem",
            allowOutsideClick: false,
            confirmButtonColor: "#2ecc71",
            confirmButtonText: "Xác nhận"
          })
        });
      },
      onClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      return false;
    });
  });
  //step 08 of listener
  socket.on("server-send-request-call-listener", function (response) {
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId
    };
    Swal.fire({
      title: `<span style = "color: #2ecc71;">${response.listenerName}</span> &nbsp; muốn trò chuyện video với bạn &nbsp; <i class="fa fa-volume-control-phone"></i>`,
      html: `
        Thời gian: <strong style = "color: #2ecc71;"></strong> giây <br/><br/>
        <button id="btn-reject-call" class="btn btn-danger">
          Từ chối
        </button>
        <button id="btn-accept-call" class="btn btn-success">
          Đồng ý
        </button>
        `,
      backdrop: "rgba(85, 85, 85, 0.4)",
      width: "52rem",
      allowOutsideClick: false,
      timer: 30000,
      timerProgressBar: true,
      onBeforeOpen: () => {
        $("#btn-reject-call").unbind("click").on("click", function () {
          Swal.close();
          clearInterval(timerInterval);

          //step 10  of listener
          socket.emit("listener-reject-request-call-to-server", dataToEmit);
        });

        $("#btn-accept-call").unbind("click").on("click", function () {
          Swal.close();
          clearInterval(timerInterval);

          //step 11  of listener
          socket.emit("listener-accept-request-call-to-server", dataToEmit);
        });
        if (Swal.getContent().querySelector !== null) {
          Swal.showLoading()
          timerInterval = setInterval(() => {
            Swal.getContent().querySelector("strong")
              .textContent = Math.ceil(Swal.getTimerLeft() / 1000);
          }, 1000);
        }
      },
      onOpen: () => {
        // step 09 of listener
        socket.on("server-send-cancel-resquet-call-listener", function (response) {
          Swal.close();
          clearInterval(timerInterval);
        });

      },
      onClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      return false;
    });
  });
  //step 13 of caller
  socket.on("server-send-accept-call-to-caller", function (response) {
    Swal.close();
    clearInterval(timerInterval);

    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
    getUserMedia({video: true, audio: true}, function(stream) {
      //show modal
      $("#streamModal").modal("show");
      // play my streams in local 
      playVideoStream("local-stream", stream);
      // call to listener
      let call = peer.call(response.listenerPeerId, stream);
      //listen & play stream of listener
      call.on("stream", function(remoteStream) {
        //play stream of listener
        playVideoStream("remote-stream", remoteStream);
      });
      //close modal: remove stream
      $("#streamModal").on("hidden.bs.modal", function() {
        closeVideoStream(stream);
        Swal.fire({
          type: "info",
          title: `Đã kết thúc cuộc gọi với &nbsp <span style = "color: #2ecc71;">${response.listenerName}</span>`,
          backdrop: "rgba(85, 85, 85, 0.4)",
          width: "52rem",
          allowOutsideClick: false,
          confirmButtonColor: "#2ecc71",
          confirmButtonText: "Xác nhận"
        })
      })
    }, function(err) {
      console.log("Failed to get local stream" ,err);
      if(err,toString() === "NotAllowedError: Permission denied"){
        alertify.notify("Yêu cầu truy nhập tiết bị bị từ chối. Vui lòng mở lại trong phần cài đặt của trình duyệt.", "error", 7)
      }
      if(err,toString() === "NotFoundError: Requested device not found"){
        alertify.notify("Không tìm thấy thiết bị trên máy tính của bạn", "error", 7)
      }
    });
  });

  //step 14 of listener
  socket.on("server-send-accept-call-to-listener", function (response) {
    Swal.close();
    clearInterval(timerInterval);
    
    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
    peer.on("call", function(call) {
      getUserMedia({video: true, audio: true}, function(stream) {
        //show modal
        $("#streamModal").modal("show");
        // play my streams in local of listener 
        playVideoStream("local-stream", stream);
        call.answer(stream); // Answer the call with an A/V stream.
        call.on("stream", function(remoteStream) {
           //play stream of caller
          playVideoStream("remote-stream", remoteStream);
        });

        //close modal: remove stream
        $("#streamModal").on("hidden.bs.modal", function() {
          closeVideoStream(stream);
          Swal.fire({
            type: "info",
            title: `Đã kết thúc cuộc gọi với &nbsp <span style = "color: #2ecc71;">${response.callerName}</span>`,
            backdrop: "rgba(85, 85, 85, 0.4)",
            width: "52rem",
            allowOutsideClick: false,
            confirmButtonColor: "#2ecc71",
            confirmButtonText: "Xác nhận"
          })
        })
      }, function(err) {
        console.log("Failed to get local stream" ,err);
        if(err,toString() === "NotAllowedError: Permission denied"){
          alertify.notify("Yêu cầu truy nhập tiết bị bị từ chối. Vui lòng mở lại trong phần cài đặt của trình duyệt.", "error", 7)
        }
        if(err,toString() === "NotFoundError: Requested device not found"){
          alertify.notify("Không tìm thấy thiết bị trên máy tính của bạn", "error", 7)
        }
      });
    });
  });

});