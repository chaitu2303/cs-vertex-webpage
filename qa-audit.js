require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log("=========================================");
  console.log(" CS VERTEX - QA AUDIT IN PROGRESS");
  console.log("=========================================\n");

  let sessionCookie = '';
  let authCookieName = 'sb-' + new URL(supabaseUrl).hostname.split('.')[0] + '-auth-token';

  // ---------------------------------------------------------
  // TEST 1: Customer Signup & Login
  // ---------------------------------------------------------
  console.log("[TEST 1] Authentication Flow");
  const testEmail = `test.customer.${Date.now()}@gmail.com`;
  const testPass = 'SecurePassword123!';

  try {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPass,
      options: { data: { full_name: 'Test QA Customer' } }
    });

    if (signUpError) {
      console.log("❌ FAIL: Customer Signup failed:", signUpError.message);
    } else {
      console.log("✅ PASS: Customer Signup successful (Email:", testEmail, ")");
      
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPass
      });

      if (signInError) {
        console.log("❌ FAIL: Customer Login failed:", signInError.message);
      } else {
        console.log("✅ PASS: Customer Login successful");
        // Build the cookie string to send to our Next.js API endpoints
        sessionCookie = `sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token=${JSON.stringify([signInData.session.access_token, signInData.session.refresh_token])}`;
      }
    }
  } catch (err) {
    console.log("❌ FAIL: Authentication Test Exception:", err.message);
  }

  // ---------------------------------------------------------
  // TEST 2: Password Reset API
  // ---------------------------------------------------------
  console.log("\n[TEST 2] Password Reset Flow");
  try {
    const resetRes = await fetch('http://localhost:3000/api/auth/reset-password-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });
    
    if (resetRes.ok) {
      console.log("✅ PASS: Password Reset API responded successfully");
    } else {
      console.log("❌ FAIL: Password Reset API failed with status", resetRes.status);
    }
  } catch (err) {
    console.log("❌ FAIL: Password Reset API Exception:", err.message);
  }

  // ---------------------------------------------------------
  // TEST 3: Upload Security
  // ---------------------------------------------------------
  console.log("\n[TEST 3] Upload Security Constraints");
  try {
    // Attempt 1: Oversized File (> 5MB)
    const largeFormData = new FormData();
    largeFormData.append('file', new Blob([new Uint8Array(6 * 1024 * 1024)]), 'large.pdf'); // 6MB
    
    const uploadRes1 = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: largeFormData
    });
    
    if (uploadRes1.status === 400) {
      console.log("✅ PASS: Prevented >5MB file upload");
    } else {
      console.log(`❌ FAIL: Expected 400 for >5MB file, got ${uploadRes1.status}`);
    }

    // Attempt 2: Invalid Extension/MIME (.exe)
    const invalidFormData = new FormData();
    invalidFormData.append('file', new Blob(["dummy payload"], { type: 'application/x-msdownload' }), 'virus.exe');
    
    const uploadRes2 = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: invalidFormData
    });

    if (uploadRes2.status === 400) {
      console.log("✅ PASS: Prevented invalid MIME type (.exe) upload");
    } else {
      console.log(`❌ FAIL: Expected 400 for .exe file, got ${uploadRes2.status}`);
    }

  } catch (err) {
    console.log("❌ FAIL: Upload Test Exception:", err.message);
  }

  // ---------------------------------------------------------
  // TEST 4: Quote Workflow
  // ---------------------------------------------------------
  console.log("\n[TEST 4] Quote Workflow Submission");
  try {
    if (!sessionCookie) throw new Error("No session cookie from Test 1");

    const quoteRes = await fetch('http://localhost:3000/api/quote', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      },
      body: JSON.stringify({
        service: 'QA Audit Custom Software',
        budget: '$10k-$25k',
        description: 'Testing the end-to-end quote submission process.'
      })
    });

    if (quoteRes.ok) {
      console.log("✅ PASS: Quote successfully submitted via API");
    } else {
      const errTxt = await quoteRes.text();
      console.log(`❌ FAIL: Quote submission failed (${quoteRes.status}):`, errTxt);
    }
  } catch (err) {
    console.log("❌ FAIL: Quote Workflow Exception:", err.message);
  }

  // ---------------------------------------------------------
  // TEST 5: Learning Application
  // ---------------------------------------------------------
  console.log("\n[TEST 5] Learning Application Form");
  try {
    if (!sessionCookie) throw new Error("No session cookie from Test 1");

    const appFormData = new FormData();
    appFormData.append('type', 'Courses');
    appFormData.append('itemId', 'test-course-id-123');
    appFormData.append('fullName', 'QA Course Applicant');
    appFormData.append('email', testEmail);
    appFormData.append('phone', '1234567890');
    appFormData.append('college', 'QA University');
    appFormData.append('qualification', 'B.Tech');

    // We use node-fetch or native fetch in node 18+, but native fetch with FormData requires the 'Cookie' header.
    const appRes = await fetch('http://localhost:3000/api/learning/apply', {
      method: 'POST',
      headers: {
        'Cookie': sessionCookie
      },
      body: appFormData
    });

    if (appRes.ok) {
      console.log("✅ PASS: Course Application successfully submitted via API");
    } else {
      const errTxt = await appRes.text();
      console.log(`❌ FAIL: Learning application failed (${appRes.status}):`, errTxt);
    }
  } catch (err) {
    console.log("❌ FAIL: Learning Application Exception:", err.message);
  }

  console.log("\n=========================================");
  console.log(" QA AUDIT COMPLETE");
  console.log("=========================================\n");
}

runTests();
