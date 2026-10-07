with open('sync_micro1_direct_all.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_push = """    formattedJobs.push({
        title: title,
        pay: payStr,
        description: cleanDesc.substring(0, 350) + "...",
        tags: tags,
    });"""

new_push = """    let defaultUrl = "https://refer.micro1.ai/referral/jobs?referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe&utm_source=referral&utm_medium=share&utm_campaign=job_referral";
    let linkTarget = apiJob.apply_url ? apiJob.apply_url : defaultUrl;
    linkTarget = linkTarget.replace("?ref=", "&ref=");
    
    formattedJobs.push({
        title: title,
        pay: payStr,
        description: cleanDesc.substring(0, 350) + "...",
        tags: tags,
        platform: 'Micro1',
        linkTarget: linkTarget
    });"""

content = content.replace(old_push, new_push)

with open('sync_micro1_direct_all.js', 'w', encoding='utf-8') as f:
    f.write(content)
