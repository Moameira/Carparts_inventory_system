const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Hardcoded admin user for now (we'll move to DB later)
const ADMIN_USER = {
  id: 1,
  email: 'admin@demo.com',
  // bcrypt hash of "password123"
  password: '$2b$10$sz3yaIo486oX9CliOX0r0uaa3ejxImdQGnpOWjVf5GGqRnLfWH7ue',
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:', email, password);
  console.log('Stored hash:', ADMIN_USER.password);

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (email !== ADMIN_USER.email) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const valid = await bcrypt.compare(password, ADMIN_USER.password);
  console.log('Password valid:', valid);

  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const token = jwt.sign(
    { id: ADMIN_USER.id, email: ADMIN_USER.email },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token });
};