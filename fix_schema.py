with open('sync_micro1_direct_all.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('let title = apiJob.title;', 'let title = apiJob.job_name;')

pay_logic_old = """    // Pay formatting
    let payStr = "Competitive";
    if (apiJob.min_compensation && apiJob.max_compensation) {
        if (apiJob.min_compensation < 200) {
            payStr = `$${apiJob.min_compensation} - $${apiJob.max_compensation} / hour`;
        } else {
            payStr = `$${(apiJob.min_compensation/1000).toFixed(0)}k - $${(apiJob.max_compensation/1000).toFixed(0)}k / year`;
        }
    } else if (apiJob.min_compensation) {
        payStr = apiJob.min_compensation < 200 ? `$${apiJob.min_compensation} / hour` : `$${(apiJob.min_compensation/1000).toFixed(0)}k / year`;
    }"""

pay_logic_new = """    // Pay formatting
    let minPay = apiJob.ideal_hourly_rate ? apiJob.ideal_hourly_rate.min : 0;
    let maxPay = apiJob.ideal_hourly_rate ? apiJob.ideal_hourly_rate.max : 0;
    let payStr = maxPay ? `$${minPay} - $${maxPay} / hour` : "Competitive";"""

content = content.replace(pay_logic_old, pay_logic_new)

desc_logic_old = """    let rawDesc = apiJob.description || "";
    let cleanDesc = rawDesc.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();"""

desc_logic_new = """    let rawDesc = apiJob.skills ? "Skills required: " + apiJob.skills.join(", ") : "No description provided.";
    let cleanDesc = rawDesc;"""

content = content.replace(desc_logic_old, desc_logic_new)

with open('sync_micro1_direct_all.js', 'w', encoding='utf-8') as f:
    f.write(content)

