const fs = require('fs');

async function run() {
    const res = await fetch('https://us-central1-trainaitogain-50c19.cloudfunctions.net/getJobsData?v=3');
    const data = await res.json();
    const jobs = data.roles;

    console.log(`Fetched ${jobs.length} jobs.`);

    let updatedJobs = [];
    for (let job of jobs) {
        const titleLower = job.title.toLowerCase();
        
        let newDomain = "GENERAL";

        if (titleLower.includes('software') || titleLower.includes('engineer') || titleLower.includes('developer') || 
            titleLower.includes('data') || titleLower.includes('cybersecurity') || titleLower.includes('react') || 
            titleLower.includes('python') || titleLower.includes('cloud') || titleLower.includes('aws') || titleLower.includes('mcp')) {
            newDomain = 'SOFTWARE';
        } else if (titleLower.includes('medical') || titleLower.includes('physician') || titleLower.includes('clinician') || 
            titleLower.includes('epidemiologist') || titleLower.includes('health') || titleLower.includes('pharma') || 
            titleLower.includes('psychiatrist') || titleLower.includes('dermatologist') || titleLower.includes('disease') || titleLower.includes('nurse')) {
            newDomain = 'MEDICAL';
        } else if (titleLower.includes('legal') || titleLower.includes('lawyer') || titleLower.includes('counsel') || titleLower.includes('attorney') || titleLower.includes('defender')) {
            newDomain = 'LEGAL';
        } else if (titleLower.includes('finance') || titleLower.includes('financial') || titleLower.includes('equity') || 
            titleLower.includes('investment') || titleLower.includes('revenue') || titleLower.includes('tax') || titleLower.includes('quant') || titleLower.includes('account')) {
            newDomain = 'FINANCE';
        } else if (titleLower.includes('sales') || titleLower.includes('marketing') || titleLower.includes('growth') || titleLower.includes('b2b')) {
            newDomain = 'SALES';
        } else if (titleLower.includes('language') || titleLower.includes('transcription') || titleLower.includes('voice') || titleLower.includes('audiobook') || 
                   titleLower.includes('spanish') || titleLower.includes('french') || titleLower.includes('german') || titleLower.includes('english') || titleLower.includes('marathi') || titleLower.includes('tamil') || titleLower.includes('kannada') || titleLower.includes('swedish') || titleLower.includes('italian') || titleLower.includes('urdu') || titleLower.includes('norwegian')) {
            newDomain = 'LANGUAGE';
        }

        updatedJobs.push({
            ...job,
            domain: newDomain
        });
    }

    const counts = {};
    updatedJobs.forEach(x => { counts[x.domain] = (counts[x.domain] || 0) + 1; });
    console.log("New Domain Distribution:", counts);

    // Now POST back to Cloud Function
    const postRes = await fetch('https://us-central1-trainaitogain-50c19.cloudfunctions.net/directIngestJobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobs: updatedJobs, token: 'TRAINAITOGAIN_SYNC_SECURE_2026' })
    });

    if (postRes.ok) {
        console.log("✅ Reclassified successfully!");
    } else {
        console.error("❌ Failed to reclassify:", await postRes.text());
    }
}
run();
