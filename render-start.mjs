import('./.output/server/index.mjs').then(() => {
  console.log('Server imported successfully.');
}).catch(err => {
  console.error('Failed to start server:', err);
  // Keep process alive so we can see logs
  setInterval(() => {}, 10000);
});
