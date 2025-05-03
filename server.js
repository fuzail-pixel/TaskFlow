const userRoutes = require('./routes/UserRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes'); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Config
dotenv.config();

// Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

// Simple route
app.get('/', (req, res) => {
  res.send('Hello World! Backend is running.');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);        
app.use('/api/projects', projectRoutes);  
app.use('/api/tasks', taskRoutes);        
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
