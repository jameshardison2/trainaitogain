import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  projectId: "trainaitogain-50c19"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  try {
    const querySnapshot = await getDocs(collection(db, "leads"));
    console.log("Success! Leads count: " + querySnapshot.size);
  } catch (err) {
    console.error("FIREBASE ERROR:", err);
  }
}
run();
