fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ studentId: 'infynuxadmin', password: 'admin123' })
}).then(res => res.text().then(text => console.log(res.status, text))).catch(console.error);
