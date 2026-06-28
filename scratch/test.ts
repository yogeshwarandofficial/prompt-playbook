import { Resend } from "resend";
import fs from "fs";
import path from "path";

// Read .env manually
const envPath = path.resolve(process.cwd(), ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars: Record<string, string> = {};
envContent.split("\n").forEach(line => {
  const parts = line.split("=");
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join("=").trim();
    envVars[key] = value;
  }
});

const apiKey = envVars.RESEND_API_KEY;
if (!apiKey) {
  console.error("No RESEND_API_KEY found");
  process.exit(1);
}

const resend = new Resend(apiKey);

async function runTests() {
  const testEmail = `test_edge_case_${Date.now()}@infynuxsolutions.in`;

  console.log(`\n=== TEST 1: First Subscription (Should succeed & send email) ===`);
  const res1 = await fetch("http://localhost:8081/api/newsletter/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testEmail }),
  });
  console.log("Status Code:", res1.status);
  const data1 = await res1.json();
  console.log("Response:", data1);

  console.log(`\n=== TEST 2: Second Subscription with same email (Should return early and NOT send email) ===`);
  const res2 = await fetch("http://localhost:8081/api/newsletter/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testEmail }),
  });
  console.log("Status Code:", res2.status);
  const data2 = await res2.json();
  console.log("Response:", data2);

  // Wait 2 seconds for Resend API to register any sent emails
  console.log("\nWaiting for Resend API logs to update...");
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log(`\n=== TEST 3: Check Resend Logs (Should only see 1 welcome email sent to ${testEmail}) ===`);
  const resList = await resend.emails.list();
  if (resList.error) {
    console.error("Failed to list emails:", resList.error);
    return;
  }
  
  const list = (resList.data as any).data || resList.data;
  if (Array.isArray(list)) {
    const matched = list.filter((email: any) => email.to.includes(testEmail));
    console.log(`Found ${matched.length} email(s) sent to ${testEmail}:`);
    matched.forEach((email: any, i: number) => {
      console.log(`  - [${i+1}] Subject: "${email.subject}" | Created: ${email.created_at} | Status: ${email.last_event}`);
    });
  } else {
    console.log("Unexpected data shape:", JSON.stringify(resList.data, null, 2));
  }
}

runTests();
