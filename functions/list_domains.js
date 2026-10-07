const admin = require('firebase-admin');
if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();
(async () => {
  const qs = await db.collection('jobs').get();
  const domains = {};
  qs.forEach(doc => {
    const data = doc.data();
    if (!domains[data.domain]) domains[data.domain] = { count: 0, titles: [] };
    domains[data.domain].count++;
    if (domains[data.domain].titles.length < 5) domains[data.domain].titles.push(data.title);
  });
  console.log(JSON.stringify(domains, null, 2));
})();
