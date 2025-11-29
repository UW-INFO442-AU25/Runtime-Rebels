import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db1 } from "../main";

const messagesRef = collection(db1, "messages");


export async function sendMessage({ senderId, senderName, recipientId, recipientName, subject, body }) {
  return await addDoc(messagesRef, {
    senderId,
    senderName,
    recipientId,
    recipientName,
    subject,
    body,
    read: false,
    createdAt: serverTimestamp(),
  });
}


export function subscribeToInbox(userId, callback) {
  const q = query(
    messagesRef,
    where("recipientId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    }));
    callback(messages);
  });
}


export function subscribeToSent(userId, callback) {
  const q = query(
    messagesRef,
    where("senderId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    }));
    callback(messages);
  });
}


export async function markAsRead(messageId) {
  const messageDoc = doc(db1, "messages", messageId);
  return await updateDoc(messageDoc, { read: true });
}


export async function deleteMessage(messageId) {
  const messageDoc = doc(db1, "messages", messageId);
  return await deleteDoc(messageDoc);
}


export async function getMessage(messageId) {
  const messageDoc = doc(db1, "messages", messageId);
  const snapshot = await getDoc(messageDoc);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
}