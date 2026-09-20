import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix the overwritten onvoiceschanged
find_overwrite = """  if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => synth.getVoices();
  }"""
replace_overwrite = ""
html = html.replace(find_overwrite, replace_overwrite)

# Ensure populateVoiceList ALSO populates when availableVoices is empty but getVoices has items
# Safari sometimes needs a small timeout to fetch voices if onvoiceschanged doesn't fire
find_populate = """  populateVoiceList();
  if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoiceList;
  }"""
replace_populate = """  populateVoiceList();
  if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoiceList;
  }
  // Fallback for Safari
  setTimeout(populateVoiceList, 100);
  setTimeout(populateVoiceList, 500);
  setTimeout(populateVoiceList, 1500);"""
html = html.replace(find_populate, replace_populate)

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fixed onvoiceschanged overwrite")
