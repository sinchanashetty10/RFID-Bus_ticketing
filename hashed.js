// hashPassword.js

const bcrypt = require('bcryptjs');

const password = '1234'; // Replace with the password you want to hash

bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('Hashed password:', hashedPassword);
});
