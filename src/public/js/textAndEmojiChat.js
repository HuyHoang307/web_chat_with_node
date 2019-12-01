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
        let messageOfMe = $(`<div class="convert-emoji bubble me" data-mess-id=${data.message._id}></div>`)
        if (dataTextEmojiForSend.isChatGroup) {
          messageOfMe.html(`<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}">`);
          messageOfMe.text(data.message.text);
        }else{
          messageOfMe.text(data.message.text);
        }
        let convertEmojiMessage = emojione.toImage(messageOfMe.html());
        messageOfMe.html(convertEmojiMessage);

        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        nineScrollRight(divId);

        $(`#write-chat-${divId}`).val("");
        currentEmojioneArea.find(".emojionearea-editor").text("");

        $(`.person[data-chat=${divId}]`).find("span.time").html(moment(data.message.createAt).locale("vi").startOf("seconds").fromNow())
        $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));

        $(`.person[data-chat=${divId}]`).on("click.moveConversationToTheTop", function() {
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("click.moveConversationToTheTop");
        });
        $(`.person[data-chat=${divId}]`).click();

        

      }).fail(function(response) {
        alertify.notify(response.responseText, "error", 7);
        
      }); 
    }
  });
}