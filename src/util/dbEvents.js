import { db1 } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

export function subscribeSavedEvents(uid, cb) {
  if (!uid) {
    cb([]);
    return () => {};
  }

  const colRef = collection(db, "users", uid, "savedEvents");
  const unsub = onSnapshot(colRef, (snap) => {
    const list = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    cb(list);
  });

  return unsub;
}

export async function addSavedEvent(uid, evt) {
  const ref = doc(db, "users", uid, "savedEvents", String(evt.id));

  const payload = {
    title: evt.title,
    city: evt.city || "",
    img: evt.img || "",
    startsAt: evt.startsAt,
    endsAt: evt.endsAt,
    createdAt: Date.now(),
  };

  await setDoc(ref, payload, { merge: true });
}

export async function removeSavedEvent(uid, eventId) {
  const ref = doc(db, "users", uid, "savedEvents", String(eventId));
  await deleteDoc(ref);
}
