function addFriendsToGroup() {
  $("ul#group-chat-friends").find("div.add-user").bind("click", function () {
    let uid = $(this).data("uid");
    $(this).remove();
    let html = $("ul#group-chat-friends").find("div[data-uid=" + uid + "]").html();

    let promise = new Promise(function (resolve, reject) {
      $("ul#friends-added").append(html);
      $("#groupChatModal .list-user-added").show();
      resolve(true);
    });
    promise.then(function (success) {
      $("ul#group-chat-friends").find("div[data-uid=" + uid + "]").remove();
    });
  });
}

function cancelCreateGroup() {
  $("#btn-cancel-group-chat").bind("click", function () {
    $("#groupChatModal .list-user-added").hide();
    if ($("ul#friends-added>li").length) {
      $("ul#friends-added>li").each(function (index) {
        $(this).remove();
      });
    }
  });
}

function callSearchFriends(element) {
  if (element.which === 13 || element.type === "click") {
    let keyword = $("#input-search-friends-to-add-group-chat").val();
    let regexKeyword = new RegExp(/^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)

    if (!keyword.length) {
      alertify.notify("Chưa nhập nội dung tìm kiếm.", "error", 7);
      return false;
    }
    if (!regexKeyword.test(keyword)) {
      alertify.notify("Từ khóa tìm kiếm không hợp lệ.", "error", 7);
      return false;
    }

    $.get(`/contact/search-friends/${keyword}`, function (data) {
      $("ul#group-chat-friends").html(data);
      // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
      addFriendsToGroup();
      // Action hủy việc tạo nhóm trò chuyện
      cancelCreateGroup();
    });
  }
}
function callCreateGroupChat() {
  $("#btn-create-group-chat").unbind("click").on("click", function () {
    let countUsers = $("ul#friends-added").find("li");
    if (countUsers.length < 2) {
      alertify.notify("Vui lòng thêm bạn bè vào nhóm, tối thiểu 2 thành viên.", "error", 7);
      return false;
    }

    let groupChatName = $("#input-name-group-chat").val();
    let regexGroupChatName = new RegExp(/^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)
    if (!regexGroupChatName.test(groupChatName) || groupChatName.length < 5 || groupChatName.length > 30) {
      alertify.notify("Tên nhóm không hợp lệ tối thiểu 5 kí tự, tối đa 30 kí tự và không chứa kí tự đặc biệt.", "error", 7);
      return false;
    }

    let arrayIds = [];
    $("ul#friends-added").find("li").each(function (index, item) {
      arrayIds.push({ "userId": $(item).data("uid") });
    });

    Swal.fire({
      title: `Bạn có chắc chắn muốn tạo nhóm &nbsp: ${groupChatName}?`,
      type: "info",
      showCancelButton: true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#ff7675",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy"
    }).then((result) => {
      if (!result.value) {
        return false;
      }
      $.post("/group-chat/add-new", {
        arrayIds: arrayIds,
        groupChatName: groupChatName
      }, function (data) {
        $("#input-name-group-chat").val("");
        $("#btn-cancel-group-chat").click();
        $("#groupChatModal").modal("hide");

        let subGroupChatName = data.groupChat.name;
        if (subGroupChatName.length > 15) {
          subGroupChatName = subGroupChatName.substr(0, 14);
        }
        let leftSideData = `
        <a href="#uid_${data.groupChat._id}" class="room-chat" data-target="#to_${data.groupChat._id}">
          <li class="person group-chat" data-chat="${data.groupChat._id}">
              <div class="left-avatar">
                  <img src="images/users/group-avatar-trungquandev.png" alt="">
              </div>
              <span class="name">
                  <span class="group-chat-name">
                      ${subGroupChatName}<span>...</span>
                  </span>
              </span>
              <span class="time"></span>
              <span class="preview convert-emoji"></span>
          </li>
        </a>
        `;
        $("#all-chat").find("ul").prepend(leftSideData);
        $("#group-chat").find("ul").prepend(leftSideData);

        let rightSideData = `
        <div class="right tab-pane" data-chat="${data.groupChat._id}"
            id="to_${data.groupChat._id}">
            <div class="top">
                <span>To: <span class="name">${data.groupChat.name}</span></span>
                <span class="chat-menu-right">
                    <a href="#attachsModal" id="show-attachs" data-toggle="modal">
                        Tệp đính kèm
                        <i class="fa fa-paperclip"></i>
                    </a>
                </span>
                <span class="chat-menu-right">
                    <a href="javascript:void(0)">&nbsp;</a>
                </span>
                <span class="chat-menu-right">
                    <a href="#imagesModal" id="show-images" data-toggle="modal">
                        Hình ảnh
                        <i class="fa fa-photo"></i>
                    </a>
                </span>
                <span class="chat-menu-right">
                    <a href="javascript:void(0)">&nbsp;</a>
                </span>
                <span class="chat-menu-right">
                    <a href="javascript:void(0)" id="number-members" data-toggle="modal">
                        <span class="show-number-members">${data.groupChat.userAmount}</span>
                        <i class="fa fa-users"></i>
                    </a>
                </span>
            </div>
            <div class="content-chat">
                <div class="chat" data-chat="${data.groupChat._id}">
                    
                </div>
            </div>
            <div class="write" data-chat="${data.groupChat._id}">
                <input type="text" class="write-chat chat-in-group" id="write-chat-${data.groupChat._id}" data-chat="${data.groupChat._id}">
                <div class="icons">
                    <a href="#" class="icon-chat" data-chat="${data.groupChat._id}"><i class="fa fa-smile-o"></i></a>
                    <label for="image-chat-${data.groupChat._id}">
                        <input type="file" id="image-chat-${data.groupChat._id}" name="my-image-chat" class="image-chat chat-in-group"
                            data-chat="${data.groupChat._id}">
                        <i class="fa fa-photo"></i>
                    </label>
                    <label for="attach-chat">
                        <input type="file" id="attach-chat" name="my-attach-chat" class="attach-chat"
                            data-chat="${data.groupChat._id}">
                        <i class="fa fa-paperclip"></i>
                    </label>
                    <a href="#streamModal" id="video-chat" class="video-chat" data-chat="${data.groupChat._id}"
                        data-toggle="modal">
                        <i class="fa fa-video-camera"></i>
                    </a>
                    <input type="hidden" id="peer-id" value="">
                </div>
            </div>
        </div>
        `;
        $("#screen-chat").prepend(rightSideData);

        changeScreenChat();

        let imagesModalData = `
        <div class="modal fade" id="imagesModal" role="dialog">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                      <h4 class="modal-title">All Images in this conversation.</h4>
                  </div>
                  <div class="modal-body">
                      <div class="all-images" style="visibility: hidden;">
                      </div>
                  </div>
              </div>
          </div>
        </div>`

        $("body").append(imagesModalData);

        //gridPhotos(5);

        let attachmentModalData = `
        <div class="modal fade" id="attachsModal" role="dialog">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">All Attachs in this conversation.</h4>
                </div>
                <div class="modal-body">
                    <ul class="list-attachs">
                        
                    </ul>
                </div>
            </div>
          </div>
        </div>`;
        $("body").append(attachmentModalData);

        socket.emit("new-group-created", { groupChat: data.groupChat });

        socket.emit("check-status");
      })
        .fail(function (response) {
          alertify.notify(response.responseText, "error", 7);
        });
    });

  });
}

$(document).ready(function () {
  $("#input-search-friends-to-add-group-chat").bind("keypress", callSearchFriends);
  $("#btn-search-friends-to-add-group-chat").bind("click", callSearchFriends);
  callCreateGroupChat();

  socket.on("response-new-group-created", function (response) {

    let subGroupChatName = response.groupChat.name;
    if (subGroupChatName.length > 15) {
      subGroupChatName = subGroupChatName.substr(0, 14);
    }
    let leftSideData = `
        <a href="#uid_${response.groupChat._id}" class="room-chat" data-target="#to_${response.groupChat._id}">
          <li class="person group-chat" data-chat="${response.groupChat._id}">
              <div class="left-avatar">
                  <img src="images/users/group-avatar-trungquandev.png" alt="">
              </div>
              <span class="name">
                  <span class="group-chat-name">
                      ${subGroupChatName}<span>...</span>
                  </span>
              </span>
              <span class="time"></span>
              <span class="preview convert-emoji"></span>
          </li>
        </a>
        `;
    $("#all-chat").find("ul").prepend(leftSideData);
    $("#group-chat").find("ul").prepend(leftSideData);

    let rightSideData = `
        <div class="right tab-pane" data-chat="${response.groupChat._id}"
            id="to_${response.groupChat._id}">
            <div class="top">
                <span>To: <span class="name">${response.groupChat.name}</span></span>
                <span class="chat-menu-right">
                    <a href="#attachsModal" id="show-attachs" data-toggle="modal">
                        Tệp đính kèm
                        <i class="fa fa-paperclip"></i>
                    </a>
                </span>
                <span class="chat-menu-right">
                    <a href="javascript:void(0)">&nbsp;</a>
                </span>
                <span class="chat-menu-right">
                    <a href="#imagesModal" id="show-images" data-toggle="modal">
                        Hình ảnh
                        <i class="fa fa-photo"></i>
                    </a>
                </span>
                <span class="chat-menu-right">
                    <a href="javascript:void(0)">&nbsp;</a>
                </span>
                <span class="chat-menu-right">
                    <a href="javascript:void(0)" id="number-members" data-toggle="modal">
                        <span class="show-number-members">${response.groupChat.userAmount}</span>
                        <i class="fa fa-users"></i>
                    </a>
                </span>
            </div>
            <div class="content-chat">
                <div class="chat" data-chat="${response.groupChat._id}">
                    
                </div>
            </div>
            <div class="write" data-chat="${response.groupChat._id}">
                <input type="text" class="write-chat chat-in-group" id="write-chat-${response.groupChat._id}" data-chat="${response.groupChat._id}">
                <div class="icons">
                    <a href="#" class="icon-chat" data-chat="${response.groupChat._id}"><i class="fa fa-smile-o"></i></a>
                    <label for="image-chat-${response.groupChat._id}">
                        <input type="file" id="image-chat-${response.groupChat._id}" name="my-image-chat" class="image-chat chat-in-group"
                            data-chat="${response.groupChat._id}">
                        <i class="fa fa-photo"></i>
                    </label>
                    <label for="attach-chat">
                        <input type="file" id="attach-chat" name="my-attach-chat" class="attach-chat"
                            data-chat="${response.groupChat._id}">
                        <i class="fa fa-paperclip"></i>
                    </label>
                    <a href="#streamModal" id="video-chat" class="video-chat" data-chat="${response.groupChat._id}"
                        data-toggle="modal">
                        <i class="fa fa-video-camera"></i>
                    </a>
                    <input type="hidden" id="peer-id" value="">
                </div>
            </div>
        </div>
        `;
    $("#screen-chat").prepend(rightSideData);

    changeScreenChat();

    let imagesModalData = `
        <div class="modal fade" id="imagesModal" role="dialog">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                      <h4 class="modal-title">All Images in this conversation.</h4>
                  </div>
                  <div class="modal-body">
                      <div class="all-images" style="visibility: hidden;">
                      </div>
                  </div>
              </div>
          </div>
        </div>`

    $("body").append(imagesModalData);

    //gridPhotos(5);

    let attachmentModalData = `
        <div class="modal fade" id="attachsModal" role="dialog">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">All Attachs in this conversation.</h4>
                </div>
                <div class="modal-body">
                    <ul class="list-attachs">
                        
                    </ul>
                </div>
            </div>
          </div>
        </div>`;
    $("body").append(attachmentModalData);

    socket.emit("member-received-group-chat", {groupChatId: response.groupChat._id});

    socket.emit("check-status");
  })
});