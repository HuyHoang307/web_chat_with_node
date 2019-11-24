
function removeRequestContactSent() {
  $(".user-remove-request-contact-sent").unbind("click").on("click", function() {
    let targetId = $(this).data("uid");
    $.ajax({
      url: "/contact/remove-request-contact-sent",
      type:"delete",
      data: {uid: targetId},
      success: function(data) {
        if (data.success){
          $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${targetId}]`).hide();
          $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display", "inline-block");
          
          decreaseNumberNotification("noti_contact_counter");
          decreaseNumberNotifContact("count-request-contact-sent");

          $("#request-contact-sent").find(`li[data-uid = ${targetId}]`).remove();
          
          socket.emit("remove-request-contact-sent", { contactId: targetId });
        }
      } 
    });
  });
}
socket.on("response-remove-request-contact-sent", function (user) {
  $(".noti_content").find(`div[data-uid = ${user.id}]`).remove();
  $(".list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove();

  $("#request-contact-received").find(`li[data-uid = ${user.id}]`).remove();

  decreaseNumberNotifContact("count-request-contact-received");

  decreaseNumberNotification("noti_contact_counter");
  decreaseNumberNotification("noti_counter");
});

$(document).ready(function() {
  removeRequestContactSent();
});