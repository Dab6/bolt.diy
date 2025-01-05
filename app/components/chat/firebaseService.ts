import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, QuerySnapshot } from "firebase/firestore";
import { firebaseConfig, chatHistoryCollection } from "./firebaseConfig";
import type { Message } from 'ai';

interface ChatHistoryItem {
  id: string;
  urlId?: string;
  description?: string;
  messages: Message[];
  timestamp: string;
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function addChatToFirebase(id: string, messages: Message[], urlId: string, description: string, timestamp: string): Promise<string> {
  try {
    const chatData = {
      id,
      messages,
      urlId,
      description,
      timestamp: timestamp ? new Date(timestamp).toISOString() : new Date().toISOString()
    };
    const docRef = await addDoc(chatHistoryCollection, chatData);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e; // Re-throw the error to be handled by the caller
  }
}

export async function getChatsFromFirebase(): Promise<ChatHistoryItem[]> {
  try {
    const querySnapshot = await getDocs(chatHistoryCollection);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      if (data.messages && data.timestamp) {
        return { id: doc.id, ...data };
      } else {
        console.warn(`Incomplete chat data for document ID ${doc.id}, skipping.`);
        return null;
      }
    }).filter(item => item !== null) as ChatHistoryItem[];
  } catch (e) {
    console.error("Error fetching documents: ", e);
    throw e; // Re-throw the error to be handled by the caller
  }
}

export async function getChatFromFirebase(id: string): Promise<ChatHistoryItem | null> {
  const docRef = doc(chatHistoryCollection, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    if (data.messages && data.timestamp) {
      return { id: docSnap.id, ...data };
    } else {
      console.warn(`Incomplete chat data for document ID ${docSnap.id}, skipping.`);
      return null;
    }
  } else {
    console.log("No such document!");
    return null;
  }
}
