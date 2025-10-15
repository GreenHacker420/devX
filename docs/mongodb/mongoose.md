# Mongoose ODM

## Installation
```bash
npm install mongoose
```

## Basic Setup
```javascript
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Get the default connection
const db = mongoose.connection;

// Event listeners
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
```

## Defining a Schema
```javascript
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false // Don't return password by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  profile: {
    firstName: String,
    lastName: String,
    bio: String,
    avatar: String
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,  // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true },  // Include virtuals when converting to JSON
  toObject: { virtuals: true }  // Include virtuals when converting to objects
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.profile?.firstName || ''} ${this.profile?.lastName || ''}`.trim();
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ 'profile.firstName': 'text', 'profile.lastName': 'text' });

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

// Query helper
userSchema.query.byName = function(name) {
  return this.where({ name: new RegExp(name, 'i') });
};

const User = mongoose.model('User', userSchema);
module.exports = User;
```

## CRUD Operations

### Create
```javascript
// Create and save
const user = new User({
  username: 'johndoe',
  email: 'john@example.com',
  password: 'securepassword123',
  role: 'user'
});

await user.save();

// Create in one step
const newUser = await User.create({
  username: 'janedoe',
  email: 'jane@example.com',
  password: 'securepassword456'
});
```

### Read
```javascript
// Find all users
const users = await User.find({});

// Find one user
const user = await User.findOne({ email: 'john@example.com' });

// Find by ID
const user = await User.findById('507f1f77bcf86cd799439011');

// Find with conditions
const activeAdmins = await User.find({
  role: 'admin',
  isActive: true
}).sort({ createdAt: -1 });

// Using query builder
const users = await User
  .find({ role: 'user' })
  .where('createdAt').gt(oneYearAgo)
  .sort('-createdAt')
  .limit(10)
  .select('username email createdAt')
  .lean();
```

### Update
```javascript
// Update by ID
const user = await User.findByIdAndUpdate(
  '507f1f77bcf86cd799439011',
  { $set: { isActive: false } },
  { new: true, runValidators: true }
);

// Update one
await User.updateOne(
  { email: 'john@example.com' },
  { $inc: { loginCount: 1 } }
);

// Update many
await User.updateMany(
  { role: 'user' },
  { $set: { lastNotified: new Date() } }
);
```

### Delete
```javascript
// Delete one
await User.deleteOne({ email: 'john@example.com' });

// Delete by ID
await User.findByIdAndDelete('507f1f77bcf86cd799439011');

// Delete many
await User.deleteMany({ isActive: false });
```

## Middleware (Hooks)

### Document Middleware
```javascript
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

userSchema.post('save', function(doc, next) {
  console.log(`User ${doc._id} was saved`);
  next();
});
```

### Query Middleware
```javascript
userSchema.pre('find', function() {
  this.start = Date.now();
});

userSchema.post('find', function(docs) {
  console.log(`Query took ${Date.now() - this.start} ms`);
});
```

### Aggregation Middleware
```javascript
userSchema.pre('aggregate', function() {
  this.pipeline().unshift({ $match: { isActive: true } });
});
```

## Population (Joins)

### Basic Population
```javascript
const postSchema = new Schema({
  title: String,
  content: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

const Post = mongoose.model('Post', postSchema);

// Populate author
const post = await Post.findById(postId).populate('author');

// Populate multiple fields
const post = await Post.findById(postId)
  .populate('author')
  .populate('comments');

// Populate with selected fields
const post = await Post.findById(postId).populate({
  path: 'author',
  select: 'username email profile.firstName profile.lastName'
});

// Populate with conditions
const post = await Post.findById(postId).populate({
  path: 'comments',
  match: { isApproved: true },
  options: { sort: { createdAt: -1 }, limit: 10 },
  select: 'content createdAt',
  populate: {
    path: 'author',
    select: 'username'
  }
});
```

## Aggregation

### Basic Aggregation
```javascript
const stats = await User.aggregate([
  { $match: { isActive: true } },
  {
    $group: {
      _id: '$role',
      count: { $sum: 1 },
      averageAge: { $avg: '$age' }
    }
  },
  { $sort: { count: -1 } }
]);
```

### Text Search
```javascript
const results = await User.find(
  { $text: { $search: 'john' } },
  { score: { $meta: 'textScore' } }
).sort({ score: { $meta: 'textScore' } });
```

## Transactions

### Basic Transaction
```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  const user = await User.create([{
    username: 'newuser',
    email: 'new@example.com',
    password: 'password123'
  }], { session });

  await Profile.create([{
    userId: user[0]._id,
    firstName: 'New',
    lastName: 'User'
  }], { session });

  await session.commitTransaction();
  console.log('Transaction completed');
} catch (error) {
  await session.abortTransaction();
  console.error('Transaction aborted:', error);
} finally {
  session.endSession();
}
```

## Plugins

### Creating a Plugin
```javascript
// plugins/timestamps.js
module.exports = function timestampsPlugin(schema) {
  schema.add({
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  schema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
  });
};

// Using the plugin
const timestamps = require('./plugins/timestamps');
userSchema.plugin(timestamps);
```

## Validation

### Custom Validators
```javascript
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  age: {
    type: Number,
    min: [18, 'Must be at least 18, got {VALUE}'],
    max: 120
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: '{VALUE} is not a valid role'
    }
  }
});

// Async validator
userSchema.path('username').validate({
  isAsync: true,
  validator: async function(value) {
    const user = await this.constructor.findOne({ username: value });
    return !user || this._id.equals(user._id);
  },
  message: 'Username already exists'
});
```

## Error Handling

### Handling Validation Errors
```javascript
try {
  const user = await User.create({ email: 'invalid-email' });
} catch (error) {
  if (error.name === 'ValidationError') {
    const errors = {};
    Object.keys(error.errors).forEach(key => {
      errors[key] = error.errors[key].message;
    });
    return { errors };
  }
  throw error;
}
```

### Handling Duplicate Key Errors
```javascript
try {
  const user = await User.create({ email: 'duplicate@example.com' });
} catch (error) {
  if (error.code === 11000) {
    return { error: 'Email already exists' };
  }
  throw error;
}
```

## Performance Optimization

### Lean Queries
```javascript
// Returns plain JavaScript objects instead of Mongoose documents
const users = await User.find({}).lean();
```

### Select Only Required Fields
```javascript
// Only fetch username and email
const users = await User.find({}, 'username email');
```

### Use Indexes
```javascript
// Create index
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ 'profile.location': '2dsphere' });
```

### Caching
```javascript
// Simple in-memory cache
const cache = {};

async function getUser(id) {
  if (cache[id]) {
    return cache[id];
  }
  
  const user = await User.findById(id).cache({ key: id });
  cache[id] = user;
  return user;
}
```

## Testing

### Using Jest
```javascript
// __tests__/user.test.js
const mongoose = require('mongoose');
const User = require('../models/User');

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('User Model', () => {
  it('should create a new user', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    
    expect(user).toHaveProperty('_id');
    expect(user.email).toBe('test@example.com');
  });

  it('should not create user with duplicate email', async () => {
    await User.create({
      username: 'testuser1',
      email: 'duplicate@example.com',
      password: 'password123'
    });
    
    await expect(
      User.create({
        username: 'testuser2',
        email: 'duplicate@example.com',
        password: 'password456'
      })
    ).rejects.toThrow('duplicate key error');
  });
});
```

## Best Practices

1. **Use Schemas**: Always define schemas for your models
2. **Use Middleware**: For pre/post hooks and business logic
3. **Use Virtuals**: For computed properties
4. **Use Statics**: For model-level functions
5. **Use Methods**: For document-level functions
6. **Use Plugins**: For reusable functionality
7. **Use Lean**: When you don't need Mongoose documents
8. **Use Projections**: Only fetch the fields you need
9. **Use Indexes**: For better query performance
10. **Handle Errors**: Proper error handling and validation
11. **Use Transactions**: For multi-document operations
12. **Use Environment Variables**: For configuration
13. **Use Connection Pooling**: For better performance
14. **Monitor Performance**: Use MongoDB Atlas or similar tools
15. **Keep Documents Small**: Avoid large documents (>16MB)
16. **Use Caching**: For frequently accessed data
17. **Use Aggregation**: For complex queries
18. **Use Text Search**: For full-text search capabilities
19. **Use Geospatial Queries**: For location-based data
20. **Keep Mongoose Updated**: For security and performance improvements
