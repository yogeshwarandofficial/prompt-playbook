import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateSubmissionDto } from './src/submissions/dto/create-submission.dto';

async function testValidation(url: string, shouldPass: boolean) {
  const dto = plainToInstance(CreateSubmissionDto, {
    content: 'My submission',
    repoUrl: url,
    liveUrl: url,
  });

  const errors = await validate(dto);
  const passed = errors.length === 0;

  if (passed === shouldPass) {
    console.log(`✅ [PASS] URL: ${url} (Expected: ${shouldPass})`);
  } else {
    console.error(`❌ [FAIL] URL: ${url} (Expected: ${shouldPass}, Got: ${passed})`);
    if (errors.length > 0) {
      console.error(errors[0].constraints);
    }
  }
}

async function runTests() {
  console.log('--- Testing VALID examples ---');
  await testValidation('https://github.com/example/project', true);
  await testValidation('https://example.com', true);
  await testValidation('http://example.com', true);

  console.log('\n--- Testing MALICIOUS examples ---');
  await testValidation('javascript:alert(1)', false);
  await testValidation('data:text/html,<html>', false);
  await testValidation('vbscript:msgbox("hello")', false);
  await testValidation('file:///etc/passwd', false);
  await testValidation('ftp://example.com', false);
}

runTests();
