import { chatHistoryRef } from './firebaseConfig';
import { push, onValue, ref, set, getDatabase } from "firebase/database";

export const saveMessage = async (userId: string, message: string, sender: 'user' | 'assistant') => {
  try {
    await push(chatHistoryRef, {
      userId: userId,
      message: message,
      sender: sender,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error saving message to Firebase:", error);
  }
};

export const saveChatHistory = async (chatId: string, messages: any[]) => {
  try {
    const db = getDatabase();
    const chatRef = ref(db, `chatHistory/${chatId}`);
    await set(chatRef, { messages });
  } catch (error) {
    console.error("Error saving chat history to Firebase:", error);
  }
};

export const getChatHistory = (userId: string, callback: (data: any) => void) => {
  onValue(chatHistoryRef, (snapshot) => {
    const history: any = [];
    snapshot.forEach((childSnapshot) => {
      const chat = childSnapshot.val();
      if (chat.userId === userId) {
        history.push(chat);
      }
    });
    callback(history);
  });
};
