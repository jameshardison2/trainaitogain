import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const app = initializeApp({ projectId: "trainaitogain-50c19" });
const db = getFirestore(app);

async function run() {
  const querySnapshot = await getDocs(collection(db, "leads"));
  querySnapshot.forEach(doc => {
    const data = doc.data();
    if (data.timestamp && typeof data.timestamp.toMillis !== 'function') {
      console.log("BAD TIMESTAMP FOUND on id:", doc.id, "Value:", data.timestamp);
    }
  });
  console.log("Check complete.");
}
run();
