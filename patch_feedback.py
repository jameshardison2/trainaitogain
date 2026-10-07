import re

with open('outreach-tool.html', 'r') as f:
    content = f.read()

# Add processing toast
content = content.replace("function parseFile(file) {\n      const reader = new FileReader();", "function parseFile(file) {\n      showToast(\"Processing \" + file.name + \"...\", \"warning\");\n      const reader = new FileReader();")

# Replace Messages success toast
old_msg_success = 'showToast("Successfully attached " + matchedCount + " past messages to your CRM contacts!", "success");'
new_msg_success = """if (matchedCount > 0) {
                      showToast("Successfully attached " + matchedCount + " past messages to your CRM contacts!", "success");
                  } else {
                      showToast("Processed messages, but found 0 matches for your current contacts.", "warning");
                  }"""
content = content.replace(old_msg_success, new_msg_success)

# Replace LinkedIn success toast
old_li_success = 'showToast("Successfully added " + added + " new LinkedIn contacts to your pipeline! (Duplicates skipped)", "success");'
new_li_success = """if (added > 0) {
                      showToast("Successfully added " + added + " new contacts to your pipeline! (Duplicates skipped)", "success");
                  } else {
                      showToast("File processed. 0 new contacts added (all duplicates skipped).", "warning");
                  }"""
content = content.replace(old_li_success, new_li_success)

# Replace Apollo success toast
old_apollo_success = 'showToast("Successfully added " + added + " new Apollo contacts to your pipeline! (Duplicates skipped)", "success");'
new_apollo_success = """if (added > 0) {
                      showToast("Successfully added " + added + " new contacts to your pipeline! (Duplicates skipped)", "success");
                  } else {
                      showToast("File processed. 0 new contacts added (all duplicates skipped).", "warning");
                  }"""
content = content.replace(old_apollo_success, new_apollo_success)

# Replace standard success toast
old_std_success = 'showToast("Successfully added " + added + " new standard contacts to your pipeline! (Duplicates skipped)", "success");'
new_std_success = """if (added > 0) {
                      showToast("Successfully added " + added + " new standard contacts to your pipeline! (Duplicates skipped)", "success");
                  } else {
                      showToast("File processed. 0 new contacts added (all duplicates skipped).", "warning");
                  }"""
content = content.replace(old_std_success, new_std_success)

# Remove "Apollo/LinkedIn" from the first warning
content = content.replace('showToast("Please upload your Contacts (Apollo/LinkedIn) FIRST', 'showToast("Please upload your Contacts (LinkedIn Connections) FIRST')

with open('outreach-tool.html', 'w') as f:
    f.write(content)
print("Feedback toasts updated")
