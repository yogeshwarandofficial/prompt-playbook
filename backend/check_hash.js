const bcrypt = require('bcrypt');
async function test() {
  const hash = '$2b$10$r/mEP1qFCZsk0lAadUMQCenwF8k5fQE//jj5UNgHyoWs8CwKb1.IC';
  const valid = await bcrypt.compare('admin123', hash);
  console.log("Is valid?", valid);
}
test();
