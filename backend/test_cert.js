const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { CertificatesService } = require('./dist/certificates/certificates.service');

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const service = app.get(CertificatesService);

  try {
    const buffer = await service.generateEventCertificate(
      'Test Student', 
      'Test Event', 
      'Description', 
      'Content', 
      'Date', 
      'EVT-001', 
      'https://infynuxsolutions.in'
    );
    console.log('Success!', buffer.length);
  } catch (e) {
    console.error('ERROR:', e);
  }
  await app.close();
}
bootstrap();
