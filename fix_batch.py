with open('functions/index.js', 'r', encoding='utf-8') as f:
    content = f.read()

import re
old_nuke = r"""exports\.nukeAndRebuild = functions\.https\.onRequest.*?res\.status\(500\)\.send\(err\.message\);\n    \}\n\}\);"""

new_nuke = """exports.nukeAndRebuild = functions.https.onRequest(async (req, res) => {
    const crypto = require('crypto');
    try {
        const jobsSnap = await db.collection('jobs').get();
        let allJobs = [];
        
        let batch = db.batch();
        let count = 0;
        for (const doc of jobsSnap.docs) {
            allJobs.push(doc.data());
            batch.delete(doc.ref);
            count++;
            if (count % 400 === 0) {
                await batch.commit();
                batch = db.batch();
            }
        }
        if (count % 400 !== 0) await batch.commit();
        
        // Remove exact duplicates from memory
        const uniqueJobsMap = new Map();
        for (const job of allJobs) {
            uniqueJobsMap.set(job.title + (job.platform||'Mercor'), job);
        }
        const uniqueJobs = Array.from(uniqueJobsMap.values());
        
        batch = db.batch();
        count = 0;
        const now = admin.firestore.FieldValue.serverTimestamp();
        
        for (const job of uniqueJobs) {
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
            batch.set(roleRef, {
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
            });
            count++;
            if (count % 400 === 0) {
                await batch.commit();
                batch = db.batch();
            }
        }
        if (count % 400 !== 0) await batch.commit();
        
        res.status(200).send(`Nuked ${allJobs.length} docs. Rebuilt ${uniqueJobs.length} unique jobs.`);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});"""

content = re.sub(old_nuke, new_nuke, content, flags=re.DOTALL)
with open('functions/index.js', 'w', encoding='utf-8') as f:
    f.write(content)
