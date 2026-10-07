from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto('https://work.mercor.com/jobs')
    page.wait_for_timeout(5000)
    links = page.locator('a').all()
    count = 0
    for link in links:
        href = link.get_attribute('href')
        if href and ('offer' in href or 'jobs' in href):
            count += 1
            print(href)
    print("Found links:", count)
    print("Page content snippet:", page.content()[:1000])
    browser.close()
