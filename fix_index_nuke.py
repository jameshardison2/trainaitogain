with open('functions/index.js', 'r', encoding='utf-8') as f:
    content = f.read()

nuke_code = """
exports.nukeAndRebuild = functions.https.onRequest(async (req, res) => {
    const crypto = require('crypto');
    try {
        const jobsSnap = await db.collection('jobs').get();
        let allJobs = [];
        const batchDelete = db.batch();
        jobsSnap.forEach(doc => {
            allJobs.push(doc.data());
            batchDelete.delete(doc.ref);
        });
        await batchDelete.commit();
        
        const batchInsert = db.batch();
        const now = admin.firestore.FieldValue.serverTimestamp();
        
        for (const job of allJobs) {
            const domainStr = (job.title + ' ' + (job.description||'')).toLowerCase();
            let finalDomain = 'GENERAL';
            if (domainStr.includes('software') || domainStr.includes('engineer') || domainStr.includes('developer') || domainStr.includes('data') || domainStr.includes('cybersecurity') || domainStr.includes('react') || domainStr.includes('python') || domainStr.includes('cloud') || domainStr.includes('aws') || domainStr.includes('mcp')) {
                finalDomain = 'SOFTWARE';
            } else if (domainStr.includes('medical') || domainStr.includes('physician') || domainStr.includes('clinician') || domainStr.includes('epidemiologist') || domainStr.includes('health') || domainStr.includes('pharma') || domainStr.includes('psychiatrist') || domainStr.includes('dermatologist') || domainStr.includes('disease') || domainStr.includes('nurse')) {
                finalDomain = 'MEDICAL';
            } else if (domainStr.includes('legal') || domainStr.includes('lawyer') || domainStr.includes('counsel') || domainStr.includes('attorney') || domainStr.includes('defender')) {
                finalDomain = 'LEGAL';
            } else if (domainStr.includes('finance') || domainStr.includes('financial') || domainStr.includes('equity') || domainStr.includes('investment') || domainStr.includes('revenue') || domainStr.includes('tax') || domainStr.includes('quant') || domainStr.includes('account')) {
                finalDomain = 'FINANCE';
            } else if (domainStr.includes('sales') || domainStr.includes('marketing') || domainStr.includes('growth') || domainStr.includes('b2b')) {
                finalDomain = 'SALES';
            } else if (domainStr.includes('language') || domainStr.includes('transcription') || domainStr.includes('voice') || domainStr.includes('audiobook') || domainStr.includes('spanish') || domainStr.includes('french') || domainStr.includes('german') || domainStr.includes('english') || domainStr.includes('marathi') || domainStr.includes('tamil') || domainStr.includes('kannada') || domainStr.includes('swedish') || domainStr.includes('italian') || domainStr.includes('urdu') || domainStr.includes('norwegian')) {
                finalDomain = 'LANGUAGE';
            }

            const platformStr = job.platform || 'Mercor';
            const newId = crypto.createHash('md5').update(job.title + platformStr).digest('hex');
            
            const roleRef = db.collection('jobs').doc(newId);
            batchInsert.set(roleRef, {
                title: job.title,
                domain: finalDomain,
                pay: job.pay || '',
                description: job.description || '',
                status: job.status || 'ACTIVE',
                tags: job.tags || ['Remote'],
                linkTarget: job.linkTarget || 'https://t.mercor.com/wbPMF',
                platform: platformStr,
                lastUpdated: now,
                ingestSource: 'nuke_migration'
            }, { merge: true });
        }
        await batchInsert.commit();
        res.status(200).send(`Nuked and rebuilt ${allJobs.length} jobs.`);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});
"""

content = content + "\n" + nuke_code

# Also fix the hash logic in directIngestJobs!
old_hash = r"const roleRef = db\.collection\('jobs'\)\.doc\(crypto\.createHash\('md5'\)\.update\(job\.title \+ finalDomain\)\.digest\('hex'\)\);"
new_hash = "const roleRef = db.collection('jobs').doc(crypto.createHash('md5').update(job.title + (job.platform || 'Mercor')).digest('hex'));"
import re
content = re.sub(old_hash, new_hash, content)

with open('functions/index.js', 'w', encoding='utf-8') as f:
    f.write(content)
