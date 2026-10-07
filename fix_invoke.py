with open('apply.html', 'r') as f:
    content = f.read()

bad_invoke1 = "onclick=\"if(window.saveRole) window.saveRole('${safeTitle}', '${safeDomain}', '${safePay}', this, '${safeUrl}');"
good_invoke1 = "onclick=\"if(window.saveRole) window.saveRole('${safeTitle}', '${safeDomain}', '${safePay}', '${safeUrl}');"

bad_invoke2 = "saveBtn.onclick = () => saveRole(title, domain, pay);"
good_invoke2 = "saveBtn.onclick = () => saveRole(title, domain, pay, applyUrl);"

content = content.replace(bad_invoke1, good_invoke1)
content = content.replace(bad_invoke2, good_invoke2)

with open('apply.html', 'w') as f:
    f.write(content)
print("apply invocations patched")
