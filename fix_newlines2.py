with open('outreach-tool.html', 'r') as f:
    content = f.read()

content = content.replace("let lines = text.split('\n');", "let lines = text.split('\\n');")
content = content.replace("text = lines.slice(headerIdx).join('\n');", "text = lines.slice(headerIdx).join('\\n');")
content = content.replace("contact.notes += \"\n\n[PAST MESSAGE]: \" + msgContent;", "contact.notes += \"\\n\\n[PAST MESSAGE]: \" + msgContent;")

with open('outreach-tool.html', 'w') as f:
    f.write(content)
