with open('functions/index.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_batch_set = """            batch.set(roleRef, {
                title: job.title,
                domain: finalDomain,
                pay: pay,
                description: job.description || '',
                status: 'ACTIVE',
                tags: job.tags || ['Remote'],
                lastUpdated: now,
                ingestSource: 'bookmarklet'
            }, { merge: true });"""

new_batch_set = """            batch.set(roleRef, {
                title: job.title,
                domain: finalDomain,
                pay: pay,
                description: job.description || '',
                status: 'ACTIVE',
                tags: job.tags || ['Remote'],
                linkTarget: job.linkTarget || 'https://t.mercor.com/wbPMF',
                platform: job.platform || 'Mercor',
                lastUpdated: now,
                ingestSource: 'bookmarklet'
            }, { merge: true });"""

content = content.replace(old_batch_set, new_batch_set)

with open('functions/index.js', 'w', encoding='utf-8') as f:
    f.write(content)
