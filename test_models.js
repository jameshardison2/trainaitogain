fetch("https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_KEY")
  .then(res => res.json())
  .then(console.log);
