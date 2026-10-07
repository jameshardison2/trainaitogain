const admin = require('firebase-admin');
admin.initializeApp({ projectId: "trainaitogain-50c19" });
const db = admin.firestore();

async function clean() {
    const snapshot = await db.collection('jobs').get();
    let count = 0;
    const batch = db.batch();
    snapshot.forEach(doc => {
        const data = doc.data();
        if (data.pay && data.pay.includes('000')) {
            // Fix $50000-$60000/hr
            let newPay = data.pay.replace(/\$([0-9]{3,})-\$([0-9]{3,})\/hr/, (m, p1, p2) => `$${Math.floor(p1/1000)}-$${Math.floor(p2/1000)}/hr`);
            newPay = newPay.replace(/\$([0-9]{3,})\/hr/, (m, p1) => `$${Math.floor(p1/1000)}/hr`);
            // Handle comma version $50,000
            newPay = newPay.replace(/\$([0-9]+),000/g, '$$$1');
            
            if (newPay !== data.pay) {
                batch.update(doc.ref, { pay: newPay });
                count++;
            }
        }
    });
    if (count > 0) {
        await batch.commit();
        console.log(`Cleaned ${count} jobs`);
    } else {
        console.log("No jobs needed cleaning");
    }
}
clean();
