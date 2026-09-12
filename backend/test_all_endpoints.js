// Comprehensive API tests with correct routes - checking for P2023 errors
async function main() {
  // 1. Login
  const loginResp = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId: 'infynuxadmin', password: 'admin123' })
  });
  
  console.log('Login status:', loginResp.status);
  
  const setCookieHeader = loginResp.headers.get('set-cookie');
  const match = setCookieHeader?.match(/Authentication=([^;]+)/);
  if (!match) {
    console.error('No auth cookie!');
    return;
  }
  const authCookie = match[1];
  const cookieHeader = `Authentication=${authCookie}`;
  console.log('Login SUCCESS\n');
  
  async function testEndpoint(method, path, body) {
    try {
      const opts = {
        method: method || 'GET',
        headers: { 'Cookie': cookieHeader, 'Content-Type': 'application/json' }
      };
      if (body) opts.body = JSON.stringify(body);
      
      const resp = await fetch(`http://localhost:3001${path}`, opts);
      let bodyText = '';
      try { bodyText = await resp.text(); } catch(e) {}
      
      let summary = bodyText.substring(0, 100);
      if (resp.ok) {
        try {
          const parsed = JSON.parse(bodyText);
          summary = Array.isArray(parsed) ? `${parsed.length} items` : JSON.stringify(parsed).substring(0, 100);
        } catch(e) {}
        console.log(`✅ ${method || 'GET'} ${path}: ${resp.status} - ${summary}`);
        return { ok: true, data: bodyText };
      } else {
        console.log(`❌ ${method || 'GET'} ${path}: ${resp.status} - ${bodyText.substring(0, 200)}`);
        return { ok: false, data: bodyText };
      }
    } catch(e) {
      console.log(`💥 ${method || 'GET'} ${path}: ${e.message}`);
      return { ok: false, error: e.message };
    }
  }
  
  // Test all critical endpoints
  await testEndpoint('GET', '/api/health');
  await testEndpoint('GET', '/api/auth/me');
  await testEndpoint('GET', '/api/admin/students');
  await testEndpoint('GET', '/api/admin/courses');
  await testEndpoint('GET', '/api/admin/dashboard/stats');
  await testEndpoint('GET', '/api/admin/projects');
  await testEndpoint('GET', '/api/admin/assignments');
  await testEndpoint('GET', '/api/admin/submissions');
  await testEndpoint('GET', '/api/admin/applications');
  await testEndpoint('GET', '/api/admin/interviews');
  await testEndpoint('GET', '/api/admin/certificates');
  await testEndpoint('GET', '/api/admin/certificates/eligible');
  await testEndpoint('GET', '/api/admin/domains');
  await testEndpoint('GET', '/api/admin/specializations');
  await testEndpoint('GET', '/api/admin/batches');
  await testEndpoint('GET', '/api/admin/curriculum');
  await testEndpoint('GET', '/api/events');
  await testEndpoint('GET', '/api/courses');
  
  // Also test student routes
  await testEndpoint('GET', '/api/student/courses');
  await testEndpoint('GET', '/api/student/projects');
  await testEndpoint('GET', '/api/student/curriculum');
  
  console.log('\n=== TEST COMPLETE ===');
}
main().catch(console.error);
