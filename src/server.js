const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const Joi = require('joi');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// In-memory database (for demo purposes)
let users = [
  { id: 1, name: "John Doe", email: "john@example.com", age: 30, role: "admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", age: 25, role: "user" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", age: 35, role: "user" }
];

let nextId = 4;

// Validation schemas
const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(18).max(100).optional(),
  role: Joi.string().valid('admin', 'user').default('user')
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  age: Joi.number().integer().min(18).max(100).optional(),
  role: Joi.string().valid('admin', 'user').optional()
});

// Helper functions
const findUserById = (id) => users.find(user => user.id === parseInt(id));
const removeUserById = (id) => {
  const index = users.findIndex(user => user.id === parseInt(id));
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
  return null;
};

// Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// GET /users - Get all users
app.get('/users', (req, res) => {
  const { page = 1, limit = 10, role } = req.query;
  
  let filteredUsers = users;
  
  // Filter by role if specified
  if (role) {
    filteredUsers = users.filter(user => user.role === role);
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
  res.json({
    users: paginatedUsers,
    total: filteredUsers.length,
    page: parseInt(page),
    totalPages: Math.ceil(filteredUsers.length / limit),
    hasNext: endIndex < filteredUsers.length,
    hasPrev: startIndex > 0
  });
});

// POST /users - Create a new user
app.post('/users', (req, res) => {
  const { error, value } = userSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(detail => detail.message)
    });
  }
  
  // Check if email already exists
  const existingUser = users.find(user => user.email === value.email);
  if (existingUser) {
    return res.status(409).json({
      error: 'Email already exists'
    });
  }
  
  const newUser = {
    id: nextId++,
    ...value,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  res.status(201).json(newUser);
});

// GET /users/:id - Get user by ID
app.get('/users/:id', (req, res) => {
  const user = findUserById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      error: 'User not found'
    });
  }
  
  res.json(user);
});

// PUT /users/:id - Update user by ID
app.put('/users/:id', (req, res) => {
  const user = findUserById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      error: 'User not found'
    });
  }
  
  const { error, value } = updateUserSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(detail => detail.message)
    });
  }
  
  // Check if email is being updated and already exists
  if (value.email && value.email !== user.email) {
    const existingUser = users.find(u => u.email === value.email);
    if (existingUser) {
      return res.status(409).json({
        error: 'Email already exists'
      });
    }
  }
  
  // Update user
  Object.assign(user, value, { updatedAt: new Date().toISOString() });
  
  res.json(user);
});

// DELETE /users/:id - Delete user by ID
app.delete('/users/:id', (req, res) => {
  const user = removeUserById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      error: 'User not found'
    });
  }
  
  res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
  console.log(`📍 Health check available at http://localhost:${PORT}/health`);
  console.log(`📚 Users endpoint available at http://localhost:${PORT}/users`);
});

module.exports = app;