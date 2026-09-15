import http from 'node:http';

const originalCreateServer = http.createServer;
http.createServer = function(...args) {
  console.log('Intercepted http.createServer!');
  const server = originalCreateServer.apply(this, args);
  
  const originalListen = server.listen;
  server.listen = function(...listenArgs) {
    console.log('Intercepted server.listen! args:', listenArgs);
    
    server.on('error', (err) => {
      console.error('SERVER LISTEN FATAL ERROR:', err);
    });

    return originalListen.apply(this, listenArgs);
  };
  return server;
};

console.log('Starting with HOST=', process.env.HOST, ' PORT=', process.env.PORT);

import('./.output/server/index.mjs').then(() => {
  console.log('Server imported successfully.');
  setInterval(() => { console.log('Ping to keep alive...'); }, 10000);
}).catch(err => {
  console.error('Failed to start server:', err);
  setInterval(() => {}, 10000);
});
