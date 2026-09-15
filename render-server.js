import { createServer } from 'node:http';
// We use dynamic import for the handler in case it needs to be resolved asynchronously
import('./.output/server/index.mjs')
  .then((m) => {
    const handler = m.default;
    const server = createServer(handler);

    const port = process.env.PORT || 3000;
    const host = process.env.HOST || '0.0.0.0';

    server.listen(port, host, () => {
      console.log(`Server listening on http://${host}:${port}`);
    });
    
    server.on('error', (err) => {
      console.error('SERVER LISTEN FATAL ERROR:', err);
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
