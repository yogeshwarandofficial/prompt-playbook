const bcrypt = require('bcrypt');
async function test() {
  const hash = "$2b$10$XrRBnfe9bHLL5ZKlXmoIyOCcEGMR1hDxv6.KAwuw8zgV97udc15tu";
  const valid = await bcrypt.compare('admin123', hash);
  console.log("Is valid?", valid);
}
test();
