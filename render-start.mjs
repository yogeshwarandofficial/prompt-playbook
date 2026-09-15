process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
});

console.log('Starting with HOST=', process.env.HOST, ' PORT=', process.env.PORT);

import('./.output/server/index.mjs').then(() => {
  console.log('Server imported successfully.');
  setInterval(() => { console.log('Ping to keep alive...'); }, 10000);
}).catch(err => {
  console.error('Failed to start server:', err);
  setInterval(() => {}, 10000);
});
