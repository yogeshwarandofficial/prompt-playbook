const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/src/app.module');
const { AdminService } = require('./dist/src/admin/admin.service');

async function test() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const adminService = app.get(AdminService);
  try {
    const res = await adminService.updateStudentAccess('07b77af4-2408-44bc-b09f-ab271cc69ba9', false);
    console.log('Success:', res.isActive);
  } catch (err) {
    console.error('Error:', err.message);
  }
  await app.close();
}
test();
