import contactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import chatGroupModel from "./../models/chatGroupModel";
import MessageModel from "./../models/messageModel";
import _ from "lodash";

const LIMIT_CONVERSATIONS_TAKEN = 15;
const LIMIT_MESSAGES_TAKEN = 40;

let getAllConversationItems = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await contactModel.getContacts(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
      let userConversationsPromise = contacts.map(async (contact) => {
        if(contact.contactId == currentUserId) {
          let getUserContat = await UserModel.findUserById(contact.userId);
          getUserContat.updateAt = contact.updateAt;
          return getUserContat;
        }else{
          let getUserContat = await UserModel.findUserById(contact.contactId);
          getUserContat.updateAt = contact.updateAt;
          return getUserContat;
        }        
      });

      let userConversations = await Promise.all(userConversationsPromise);
      let groupConversations = await chatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
      let allConversations =  userConversations.concat(groupConversations);

      allConversations = _.sortBy(allConversations, (item) => {
        return -item.updateAt;
      });

      //get message to apply in screen chat
      let allConversationWithMessagesPromise = allConversations.map(async (conversation) => {
        let getMessages = await MessageModel.model.getMessages(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);        
        conversation = conversation.toObject();
        conversation.messages = getMessages;
        return conversation;
      });
      

      let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);
      //sort by conversation 
      allConversationWithMessages = _.sortBy(allConversationWithMessages, (item) => {
        return -item.updateAt;
      });
      

      resolve({
        allConversationWithMessages: allConversationWithMessages
      });
    } catch (error) {
      reject(error);
    }
  })
};

module.exports = {
  getAllConversationItems: getAllConversationItems
};