import NotificationModel from "./../models/notificationModel";
import UserModel from "./../models/userModel";


let getNotifications = (currentUserId, limit = 10) => {
  return new Promise(async (resolve, rejects) => {
    try {
      let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId, limit);
      
      let getNotifContents = notifications.map(async (notification) => {
        let sender = await UserModel.findUserById(notification.senderId);
        return NotificationModel.content.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
      });

      resolve(await Promise.all(getNotifContents));
      
    } catch (error) {
      rejects(error);
    }
  })
}

let countNotifUnread = (currentUserId) => {
  return new Promise(async (resolve, rejects) => {
    try {
      let notificationsUnread = await NotificationModel.model.countNotifUnread(currentUserId);
      resolve(notificationsUnread);
      
    } catch (error) {
      rejects(error);
    }
  });
}

module.exports = {
  getNotifications : getNotifications,
  countNotifUnread : countNotifUnread
};