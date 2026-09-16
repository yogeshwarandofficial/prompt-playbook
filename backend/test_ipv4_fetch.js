// Test IPv4-forced fetch against Neon HTTP API
const https = require('https');
const dns = require('dns');
const { URL } = require('url');

require('dotenv').config();
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('ERROR: DATABASE_URL not set in environment.');
  process.exit(1);
}

// Parse connection string to get host
const connUrl = new URL(connectionString.replace('postgresql://', 'https://'));
const hostname = connUrl.hostname;

console.log('Resolving hostname:', hostname);

dns.lookup(hostname, { family: 4 }, (err, address) => {
  if (err) { console.error('DNS lookup failed:', err); return; }
  console.log('Resolved to IPv4:', address);

  // Try an HTTPS connection to the resolved IPv4 address
  const req = https.request({
    method: 'POST',
    hostname: address,
    port: 443,
    path: '/sql/v1',
    headers: {
      'Host': hostname,
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(`${connUrl.username}:${decodeURIComponent(connUrl.password)}`).toString('base64')}`,
      'Neon-Connection-String': connectionString,
    },
    timeout: 10000,
  }, (res) => {
    let body = '';
    res.on('data', d => body += d.toString());
    res.on('end', () => {
      console.log('STATUS:', res.statusCode);
      console.log('BODY:', body.substring(0, 300));
    });
  });

  req.on('error', e => console.error('Request ERROR:', e.code, e.message));
  req.on('timeout', () => { console.error('Request TIMED OUT'); req.destroy(); });
  req.write(JSON.stringify({ query: 'SELECT 1 as test', params: [] }));
  req.end();
});
