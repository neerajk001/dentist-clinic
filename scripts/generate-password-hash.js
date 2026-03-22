/**
 * Utility script to generate bcrypt password hashes
 * Usage: node scripts/generate-password-hash.js yourPassword
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('❌ Error: Please provide a password as an argument');
  console.log('Usage: node scripts/generate-password-hash.js yourPassword');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log('\n✅ Password hash generated successfully!\n');
console.log('Password:', password);
console.log('Hash:', hash);
console.log('\nUse this hash in your SQL INSERT statement:');
console.log(`INSERT INTO users (name, email, password, role) VALUES ('Your Name', 'email@example.com', '${hash}', 'doctor');`);
console.log('');
