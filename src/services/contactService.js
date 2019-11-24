import contactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import NotificationModel from "./../models/notificationModel";
import _ from "lodash";

const LIMIT_NUMBER_TAKEN = 10;

let findUsersContact = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let deprecatedUserIds = [currentUserId];
    let contactsByUser = await contactModel.findAllByUser(currentUserId);
    contactsByUser.forEach((contact) => {
      deprecatedUserIds.push(contact.userId);
      deprecatedUserIds.push(contact.contactId);
    });

    deprecatedUserIds = _.uniqBy(deprecatedUserIds);
    let users = await UserModel.findAllForAddContact(deprecatedUserIds, keyword);
    resolve(users);
  });
}

let addNew = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let contactExists = await contactModel.checkExists(currentUserId, contactId);
    if (contactExists) {
      return reject(false);
    }
    //create  contact
    let newContactItem = {
      userId: currentUserId,
      contactId: contactId
    }
    let newContact = await contactModel.createNew(newContactItem);
    //create notification
    let notificationItem = {
      senderId: currentUserId,
      recieverId: contactId,
      type: NotificationModel.types.ADD_CONTACT
    };
    await NotificationModel.model.createNew(notificationItem);
    resolve(newContact);
  });
}

let removeRequestContact = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeReq = await contactModel.removeRequestContact(currentUserId, contactId);
    if (removeReq.result.n === 0) {
      return reject(false);
    }
    //remove notification
    await NotificationModel.model.removeRequestContactNotification(currentUserId, contactId, NotificationModel.types.ADD_CONTACT);
    resolve(true);
  });
}

let getContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await contactModel.getContacts(currentUserId, LIMIT_NUMBER_TAKEN);
      let users = contacts.map(async (contact) => {
        if(contact.contactId == currentUserId) {
          return await UserModel.findUserById(contact.userId);
        }else{
          return await UserModel.findUserById(contact.contactId);
        }        
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
}

let getContactsSent = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await contactModel.getContactsSent(currentUserId, LIMIT_NUMBER_TAKEN);
      let users = contacts.map(async (contact) => {
        return await UserModel.findUserById(contact.contactId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(err);
    }
  });
}

let getContactsReceived = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await contactModel.getContactsReceived(currentUserId, LIMIT_NUMBER_TAKEN);
      let users = contacts.map(async (contact) => {
        return await UserModel.findUserById(contact.userId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(err);
    }
  });
}

let countAllContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await contactModel.countAllContacts(currentUserId);
      resolve(count);
    } catch (error) {
      reject(err);
    }
  });
}

let countAllContactsSent = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await contactModel.countAllContactsSent(currentUserId);
      resolve(count);
    } catch (error) {
      reject(err);
    }
  });
}

let countAllContactsReceived = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await contactModel.countAllContactsReceived(currentUserId);
      resolve(count);
    } catch (error) {
      reject(err);
    }
  });
}

module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  removeRequestContact: removeRequestContact,
  getContacts: getContacts,
  getContactsReceived: getContactsReceived,
  getContactsSent: getContactsSent,
  countAllContacts: countAllContacts,
  countAllContactsSent: countAllContactsSent,
  countAllContactsReceived: countAllContactsReceived
}