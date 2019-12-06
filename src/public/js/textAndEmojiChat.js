function textAndEmojiChat(divId) {
  $(".emojionearea").unbind("keyup").on("keyup", function(element) {
    let currentEmojioneArea = $(this);
    if(element.which === 13) {
      let targetId = $(`#write-chat-${divId}`).data("chat");
      let messageVal = $(`#write-chat-${divId}`).val();
      
      if (!targetId.length || !messageVal.length) {
        return false;
      }
      let dataTextEmojiForSend = {
        uid: targetId,
        messageVal: messageVal
      };
      if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
        dataTextEmojiForSend.isChatGroup = true;
      }
      $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function(data) {
        let dataToEmit = {
          message: data.message
        }
        let messageOfMe = $(`<div class="convert-emoji bubble me" data-mess-id=${data.message._id}></div>`)
        messageOfMe.text(data.message.text);
        let convertEmojiMessage = emojione.toImage(messageOfMe.html());
        if (dataTextEmojiForSend.isChatGroup) {
          let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}">`;
          messageOfMe.html(`${senderAvatar} ${convertEmojiMessage}`);
          dataToEmit.groupId = targetId;
        }else{
          messageOfMe.html(convertEmojiMessage);
          dataToEmit.contactId = targetId;
        }
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        nineScrollRight(divId);

        $(`#write-chat-${divId}`).val("");
        currentEmojioneArea.find(".emojionearea-editor").text("");

        $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createAt).locale("vi").startOf("seconds").fromNow())
        $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));

        $(`.person[data-chat=${divId}]`).on("event.moveConversationToTheTop", function() {
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("event.moveConversationToTheTop");
        });
        $(`.person[data-chat=${divId}]`).trigger("event.moveConversationToTheTop");

        socket.emit("chat-text-emoji", dataToEmit);

        typingOff(divId);

        let checkTyping = $(`.chat[data-chat=${divId}]`).find("div.bubble-typing-gif");
        if(checkTyping.length) {
          checkTyping.remove();
        }

      }).fail(function(response) {
        alertify.notify(response.responseText, "error", 7);
        
      }); 
    }
  });
}

$(document).ready(function () {
  socket.on("response-chat-text-emoji", function(response) {
    let divId = "";
    let messageOfYou = $(`<div class="convert-emoji bubble you" data-mess-id=${response.message._id}></div>`);
    messageOfYou.text(response.message.text);
    let convertEmojiMessage = emojione.toImage(messageOfYou.html());
    if (response.currentGroupId) {
      let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}">`;
      messageOfYou.html(`${senderAvatar} ${convertEmojiMessage}`);
      divId = response.currentGroupId;
    }else{
      messageOfYou.html(convertEmojiMessage);
      
      divId = response.currentUserId;
    }

    if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
      $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
      nineScrollRight(divId);
      $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime").html(moment(response.message.createAt).locale("vi").startOf("seconds").fromNow());
    }
    $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createAt).locale("vi").startOf("seconds").fromNow())
    $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(response.message.text));

    $(`.person[data-chat=${divId}]`).on("event.moveConversationToTheTop", function() {
      let dataToMove = $(this).parent();
      $(this).closest("ul").prepend(dataToMove);
      $(this).off("event.moveConversationToTheTop");
    });
    $(`.person[data-chat=${divId}]`).trigger("event.moveConversationToTheTop");

  });
});