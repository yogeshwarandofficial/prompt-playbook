const bcrypt = require('bcrypt');
async function test() {
  const hash = "$2b$10$NiSr/zqLqbxqWZUYPr9b2eSeViGIbnXCWkh.04aYUIpXLXBA4EQ7.";
  const valid = await bcrypt.compare('yo123456', hash);
  console.log("Is valid?", valid);
}
test();
