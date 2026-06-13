const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('express-async-errors');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const partsRouter = require('./routes/parts');
const categoriesRouter = require('./routes/categories');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://carparts-inventory-system.vercel.app',
  ],
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/parts', partsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/users', usersRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Car Parts API is running' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});