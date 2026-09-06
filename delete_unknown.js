import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  projectId: "trainaitogain-50c19"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const querySnapshot = await getDocs(collection(db, "leads"));
  let deletedCount = 0;
  
  for (const docSnapshot of querySnapshot.docs) {
    const data = docSnapshot.data();
    if (!data.referred_by) {
      console.log("Deleting unknown lead:", data.firstName || "Anonymous", "Email:", data.email);
      await deleteDoc(doc(db, "leads", docSnapshot.id));
      deletedCount++;
    }
  }
  console.log(`Successfully deleted ${deletedCount} unknown leads.`);
}
run();
