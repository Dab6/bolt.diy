import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const saveMessage = async (message: any) => {
  try {
    await addDoc(collection(db, "messages"), message);
  } catch (error) {
    console.error("Error saving message to Firebase:", error);
  }
};

export const saveChatHistory = async (chatId: string, messages: any[]) => {
  try {
    await addDoc(collection(db, "chatHistory"), { chatId, messages });
  } catch (error) {
    console.error("Error saving chat history to Firebase:", error);
  }
};
