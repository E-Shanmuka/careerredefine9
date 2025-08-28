// Load environment variables from config.env
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import hpp from 'hpp';
import helmet from 'helmet';
import session from 'express-session';
import MongoStore from 'connect-mongo';
// Inline routing: controllers and auth middleware
import * as courseController from './controllers/courseController.js';
import * as jobController from './controllers/jobController.js';
import * as articleController from './controllers/articleController.js';
import * as reviewController from './controllers/reviewController.js';
import * as queryController from './controllers/queryController.js';
import * as adminController from './controllers/adminController.js';
import { protect, restrictTo } from './middleware/auth.js';
import * as awardController from './controllers/awardController.js';
import * as bookingController from './controllers/bookingController.js';
import * as authController from './controllers/authController.js';
import * as aiController from './controllers/aiController.js';
import * as questionController from './controllers/questionController.js';
import Article from './models/Article.js';
import * as resumeController from './controllers/resumeController.js';
import {
  uploadUserPhoto,
  resizeUserPhoto,
  getUser,
  getMyEnrolledCourses,
  getMyReviews,
  getMyBookings,
  getAllUsers as getAllUsersController,
  updateUser as updateUserController,
  deleteUser as deleteUserController,
  getUserStats,
} from './controllers/userController.js';

// dotenv already loaded above via import 'dotenv/config'

// Import cleanup function
import cleanupUnverifiedAccounts from './utils/cleanupUnverifiedAccounts.js';

// Initialize cleanup of unverified accounts
cleanupUnverifiedAccounts();

// Import models
import User from './models/User.js';
import Review from './models/Review.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

// Function to ensure admin user exists
const ensureAdminUser = async () => {
  try {
    const adminEmail = 'shannu@admin.com';
    const adminPassword = '667700';
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (!adminExists) {
      // Create admin user
      const admin = await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: adminPassword,
        passwordConfirm: adminPassword,
        role: 'admin',
        isVerified: true,
        phone: '+1234567890',
        active: true
      });
      
      console.log('✅ Admin user created successfully');
    } else {
      // Ensure admin has correct permissions
      await User.updateOne(
        { email: adminEmail },
        {
          $set: {
            role: 'admin',
            isVerified: true,
            active: true
          }
        }
      );
      console.log('✅ Admin user verified');
    }
  } catch (error) {
    console.error('❌ Error ensuring admin user:', error.message);
  }
};

// Ensure Review indexes: drop legacy unique index that doesn't handle course: null and sync model indexes
const ensureReviewIndexes = async () => {
  try {
    const collection = mongoose.connection.collection('reviews');
    const indexes = await collection.indexes();
    const dupIndex = indexes.find((idx) => idx.name === 'user_1_course_1');
    if (dupIndex) {
      // Drop legacy index; model defines a partial unique index instead
      await collection.dropIndex('user_1_course_1');
      console.log('🔧 Dropped legacy reviews index user_1_course_1');
    }
    // Sync model-defined indexes (creates partial unique index)
    await Review.syncIndexes();
    console.log('✅ Review indexes synchronized');
  } catch (err) {
    console.error('❌ Error ensuring review indexes:', err.message);
  }
};

// Ensure Article indexes: drop legacy slug_1 if present and sync model indexes
const ensureArticleIndexes = async () => {
  try {
    const collection = mongoose.connection.collection('articles');
    const indexes = await collection.indexes();
    const slugIdx = indexes.find((idx) => idx.name === 'slug_1');
    // If legacy unique index on slug exists (often created without sparse), keep it but ensure model indexes match
    // If needed, drop and let Mongoose recreate based on schema
    if (slugIdx && !slugIdx.sparse) {
      await collection.dropIndex('slug_1');
      console.log('🔧 Dropped legacy articles index slug_1');
    }
    await Article.syncIndexes();
    console.log('✅ Article indexes synchronized');
  } catch (err) {
    console.error('❌ Error ensuring article indexes:', err.message);
  }
};

// Removed router mounts; endpoints are inlined below

// Import Vite for development
import { createServer as createViteServer } from 'vite';

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Initialize express
const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set security HTTP headers with Vite HMR compatibility
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP as it can interfere with Vite's HMR
  crossOriginEmbedderPolicy: false
}));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 14 * 24 * 60 * 60, // 14 days
    autoRemove: 'native',
    crypto: {
      secret: process.env.SESSION_ENCRYPTION_KEY || 'your-encryption-key'
    }
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    sameSite: 'lax',
    path: '/'
  },
  name: 'sessionId'
};

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  exposedHeaders: ['set-cookie']
};

// Enable CORS for all routes
app.use(cors(corsOptions));

// Session middleware must come before routes but after CORS
app.use(session(sessionConfig));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Rate limiting (relaxed in development)
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === 'production' ? 100 : 0, // 0 means disabled when skip isn't used
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => req.user?.id ?? ipKeyGenerator(req, res),
  skip: () => process.env.NODE_ENV !== 'production'
});
app.use('/api', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: [
    'duration',
    'ratingsQuantity',
    'ratingsAverage',
    'maxGroupSize',
    'difficulty',
    'price'
  ]
}));

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// API Routes - Inline under /api/v1

// ----- Auth -----
app.post('/api/v1/auth/signup', authController.signup);
app.post('/api/v1/auth/send-otp', authController.sendOTP);
app.post('/api/v1/auth/verify-otp', authController.verifyOTP);
app.post('/api/v1/auth/resend-otp', authController.resendOTP);
app.post('/api/v1/auth/login', authController.login);
app.post('/api/v1/auth/google-auth', authController.googleAuth);
app.post('/api/v1/auth/forgot-password', authController.forgotPassword);
app.patch('/api/v1/auth/reset-password/:token', authController.resetPassword);
app.post('/api/v1/auth/refresh-token', authController.refreshToken);
app.post('/api/v1/auth/logout', authController.logout);
// Protected auth routes
app.get('/api/v1/auth/me', protect, authController.getMe);
app.patch('/api/v1/auth/update-me', protect, uploadUserPhoto, resizeUserPhoto, authController.updateMe);
app.delete('/api/v1/auth/delete-me', protect, authController.deleteMe);
app.patch('/api/v1/auth/update-password', protect, authController.updatePassword);
// Compatibility GET logout
app.get('/api/v1/auth/logout', authController.logout);

// ----- Courses -----
app.get('/api/v1/courses', courseController.getAllCourses);
app.get('/api/v1/courses/search', courseController.searchCourses);
app.get('/api/v1/courses/popular', courseController.getPopularCourses);
app.get('/api/v1/courses/:id', courseController.getCourse);
app.post(
  '/api/v1/courses',
  protect,
  restrictTo('instructor', 'admin'),
  courseController.uploadCourseImage,
  courseController.resizeCourseImage,
  courseController.uploadSyllabus,
  courseController.processSyllabus,
  courseController.createCourse
);
app.patch(
  '/api/v1/courses/:id',
  protect,
  restrictTo('instructor', 'admin'),
  courseController.uploadCourseImage,
  courseController.resizeCourseImage,
  courseController.uploadSyllabus,
  courseController.processSyllabus,
  courseController.updateCourse
);
app.delete(
  '/api/v1/courses/:id',
  protect,
  restrictTo('instructor', 'admin'),
  courseController.deleteCourse
);

// ----- Jobs -----
app.get('/api/v1/jobs', jobController.getAllJobs);
app.get('/api/v1/jobs/featured', jobController.getFeaturedJobs);
app.get('/api/v1/jobs/employer/:employerId', jobController.getJobsByEmployer);
app.get('/api/v1/jobs/:id', jobController.getJob);
app.post(
  '/api/v1/jobs',
  protect,
  restrictTo('employer', 'admin'),
  jobController.uploadJobLogo,
  jobController.resizeJobLogo,
  jobController.createJob
);
app.patch(
  '/api/v1/jobs/:id',
  protect,
  restrictTo('employer', 'admin'),
  jobController.uploadJobLogo,
  jobController.resizeJobLogo,
  jobController.updateJob
);
app.delete(
  '/api/v1/jobs/:id',
  protect,
  restrictTo('employer', 'admin'),
  jobController.deleteJob
);

// ----- Articles -----
app.get('/api/v1/articles', articleController.getAllArticles);
app.get('/api/v1/articles/featured', articleController.getFeaturedArticles);
app.get('/api/v1/articles/tag/:tag', articleController.getArticlesByTag);
app.get('/api/v1/articles/search', articleController.searchArticles);
app.get('/api/v1/articles/:id', articleController.getArticle);
app.post(
  '/api/v1/articles',
  protect,
  restrictTo('author', 'admin'),
  articleController.uploadArticleImage,
  articleController.resizeArticleImage,
  articleController.createArticle
);
app.patch(
  '/api/v1/articles/:id',
  protect,
  restrictTo('author', 'admin'),
  articleController.uploadArticleImage,
  articleController.resizeArticleImage,
  articleController.updateArticle
);
app.delete(
  '/api/v1/articles/:id',
  protect,
  restrictTo('author', 'admin'),
  articleController.deleteArticle
);

// ----- Reviews -----
app.get('/api/v1/reviews', reviewController.getAllReviews);
app.get('/api/v1/reviews/course/:courseId', reviewController.getCourseReviews);
app.get('/api/v1/reviews/user/:userId', reviewController.getUserReviews);
app.get('/api/v1/reviews/:id', reviewController.getReview);
app.post(
  '/api/v1/reviews',
  protect,
  reviewController.uploadReviewImages,
  reviewController.processReviewImages,
  reviewController.createReview
);
app.patch(
  '/api/v1/reviews/:id',
  protect,
  reviewController.uploadReviewImages,
  reviewController.processReviewImages,
  reviewController.updateReview
);
app.delete('/api/v1/reviews/:id', protect, reviewController.deleteReview);
// Admin-only list all
app.get('/api/v1/reviews/admin/all', protect, restrictTo('admin'), reviewController.getAllReviews);

// Test database connection and collections
app.get('/api/v1/test/db', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Check if required collections exist
    const requiredCollections = ['users', 'bookings', 'courses', 'jobs', 'articles', 'queries', 'questions', 'reviews'];
    const missingCollections = requiredCollections.filter(c => !collectionNames.includes(c));
    
    // Test queries collection
    let queriesTest = { success: false };
    try {
      const testQuery = await mongoose.connection.db.collection('queries').findOne({});
      queriesTest = { 
        success: true, 
        count: await mongoose.connection.db.collection('queries').countDocuments() 
      };
    } catch (e) {
      queriesTest = { success: false, error: e.message };
    }
    
    // Test bookings collection
    let bookingsTest = { success: false };
    try {
      const testBooking = await mongoose.connection.db.collection('bookings').findOne({});
      bookingsTest = { 
        success: true, 
        count: await mongoose.connection.db.collection('bookings').countDocuments() 
      };
    } catch (e) {
      bookingsTest = { success: false, error: e.message };
    }
    
    res.status(200).json({
      status: 'success',
      connected: mongoose.connection.readyState === 1,
      collections: collectionNames,
      missingCollections: missingCollections,
      tests: {
        queries: queriesTest,
        bookings: bookingsTest
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ----- Compatibility routes for legacy/static forms -----
// This section handles form submissions from static HTML pages like datascience.html

// Public: generic enquiry used by static HTML pages for queries (e.g., 'Request a Call Back')
app.post('/api/enquiry', (req, res, next) => {
  try {
    const { name, email, phone, message, qualification, subject, page, form_type } = req.body || {};
    // Build a sensible subject if missing
    const derivedSubject = subject || `${page || 'General'} ${form_type === 'interview' ? 'Interview ' : ''}Enquiry`.trim();
    // If no message provided, compose one including qualification
    const composedMessage = message || `User enquiry submitted.${qualification ? ` Qualification: ${qualification}.` : ''}`;

    // Normalize body to what queryController expects
    req.body = {
      name,
      email,
      phone,
      subject: derivedSubject,
      message: composedMessage,
    };

    return queryController.createQuery(req, res, next);
  } catch (e) {
    return res.status(400).json({ status: 'fail', message: e.message });
  }
});

// Mirror path for the above enquiry form, without the /api prefix, for proxy compatibility.
app.post('/enquiry', (req, res, next) => {
  try {
    const { name, email, phone, message, qualification, subject, page, form_type } = req.body || {};
    const derivedSubject = subject || `${page || 'General'} ${form_type === 'interview' ? 'Interview ' : ''}Enquiry`.trim();
    const composedMessage = message || `User enquiry submitted.${qualification ? ` Qualification: ${qualification}.` : ''}`;
    req.body = { name, email, phone, subject: derivedSubject, message: composedMessage };
    return queryController.createQuery(req, res, next);
  } catch (e) {
    return res.status(400).json({ status: 'fail', message: e.message });
  }
});

// Public: interview booking used by static HTML pages for appointments (e.g., 'Book a Free Live Class')
app.post('/api/book-interview', (req, res, next) => {
  try {
    const { name, email, phone, message, interview_date, interview_time, date, time, timeSlot } = req.body || {};

    // Allow both interview_* fields and generic date/time inputs
    const normalizedDate = interview_date || date;
    const normalizedTime = interview_time || time || timeSlot;

    // Normalize body to what bookingController expects
    req.body = {
      name,
      email,
      phone,
      message,
      date: normalizedDate,
      timeSlot: normalizedTime,
      type: 'consultation'
    };

    return bookingController.createBooking(req, res, next);
  } catch (e) {
    return res.status(400).json({ status: 'fail', message: e.message });
  }
});


// Mirror path for the above interview booking form, without the /api prefix, for proxy compatibility.
app.post('/book-interview', (req, res, next) => {
  try {
    const { name, email, phone, message, interview_date, interview_time, date, time, timeSlot } = req.body || {};
    const normalizedDate = interview_date || date;
    const normalizedTime = interview_time || time || timeSlot;
    req.body = { name, email, phone, message, date: normalizedDate, timeSlot: normalizedTime, type: 'consultation' };
    return bookingController.createBooking(req, res, next);
  } catch (e) {
    return res.status(400).json({ status: 'fail', message: e.message });
  }
});

// ----- Queries -----
// Public submit
app.post('/api/v1/queries', queryController.createQuery);
// User protected
app.get('/api/v1/queries/my-queries', protect, queryController.getMyQueries);
app.get('/api/v1/queries/:id', protect, queryController.getQuery);
// Admin
app.get('/api/v1/queries', protect, restrictTo('admin'), queryController.getAllQueries); // Corrected route for admin
app.get('/api/v1/queries/admin/all', protect, restrictTo('admin'), queryController.getAllQueries);
app.get('/api/v1/queries/stats/query-stats', protect, restrictTo('admin'), queryController.getQueryStats);
app.patch('/api/v1/queries/:id/status', protect, restrictTo('admin'), queryController.updateQueryStatus);
app.post('/api/v1/queries/:id/reply', protect, restrictTo('admin'), queryController.replyToQuery);


// ----- Questions -----
// Public submit
app.post('/api/v1/questions', questionController.createQuestion);
// Admin
app.get('/api/v1/questions', protect, restrictTo('admin'), questionController.getAllQuestions);
app.get('/api/v1/questions/:id', protect, restrictTo('admin'), questionController.getQuestion);
app.delete('/api/v1/questions/:id', protect, restrictTo('admin'), questionController.deleteQuestion);
// ----- Admin (Users + Dashboard) -----
app.get('/api/v1/admin/dashboard/stats', protect, restrictTo('admin'), adminController.getDashboardStats);
app.get('/api/v1/admin/users', protect, restrictTo('admin'), adminController.getAllUsers);
app.get('/api/v1/admin/users/:id', protect, restrictTo('admin'), adminController.getUser);
app.patch('/api/v1/admin/users/:id', protect, restrictTo('admin'), adminController.updateUser);
app.delete('/api/v1/admin/users/:id', protect, restrictTo('admin'), adminController.deleteUser);
app.patch('/api/v1/admin/users/bulk-update', protect, restrictTo('admin'), adminController.bulkUpdateUsers);
app.delete('/api/v1/admin/users/bulk-delete', protect, restrictTo('admin'), adminController.bulkDeleteUsers);

// ----- Users (profile and admin) -----
// All user routes require auth
app.get('/api/v1/users/me', protect, authController.getMe, getUser);
app.patch('/api/v1/users/update-me', protect, uploadUserPhoto, resizeUserPhoto, authController.updateMe);
app.patch('/api/v1/users/update-password', protect, authController.updatePassword);
app.delete('/api/v1/users/delete-me', protect, authController.deleteMe);

// User data
app.get('/api/v1/users/my-courses', protect, getMyEnrolledCourses);
app.get('/api/v1/users/my-reviews', protect, getMyReviews);
app.get('/api/v1/users/my-bookings', protect, getMyBookings);

// Admin-only user management
app.get('/api/v1/users', protect, restrictTo('admin'), getAllUsersController);
app.get('/api/v1/users/stats/users', protect, restrictTo('admin'), getUserStats);
app.get('/api/v1/users/:id', protect, restrictTo('admin'), getUser);
app.patch('/api/v1/users/:id', protect, restrictTo('admin'), updateUserController);
app.delete('/api/v1/users/:id', protect, restrictTo('admin'), deleteUserController);

// ----- Awards -----
// Public
app.get('/api/v1/awards', awardController.getAllAwards);
app.get('/api/v1/awards/featured', awardController.getFeaturedAwards);
app.get('/api/v1/awards/category/:category', awardController.getAwardsByCategory);
app.get('/api/v1/awards/:id', awardController.getAward);
// Admin
app.post(
  '/api/v1/awards',
  protect,
  restrictTo('admin'),
  awardController.uploadAwardImage,
  awardController.resizeAwardImage,
  awardController.createAward
);
app.patch(
  '/api/v1/awards/:id',
  protect,
  restrictTo('admin'),
  awardController.uploadAwardImage,
  awardController.resizeAwardImage,
  awardController.updateAward
);
app.delete('/api/v1/awards/:id', protect, restrictTo('admin'), awardController.deleteAward);

// ----- Bookings -----
// Protected for all
app.get('/api/v1/bookings/my-bookings', protect, bookingController.getMyBookings);
app.get('/api/v1/bookings/available-slots', protect, bookingController.getAvailableSlots);
app.post('/api/v1/bookings', protect, bookingController.createBooking);
app.get('/api/v1/bookings/:id', protect, bookingController.getBooking);
app.patch('/api/v1/bookings/:id', protect, bookingController.updateBookingStatus);
app.delete('/api/v1/bookings/:id', protect, bookingController.cancelBooking);
// Admin
app.get('/api/v1/bookings', protect, restrictTo('admin'), bookingController.getAllBookings);
app.post('/api/v1/bookings/:id/notes', protect, restrictTo('admin'), bookingController.addAdminNote);
app.get('/api/v1/bookings/status/:status', protect, restrictTo('admin'), bookingController.getAllBookings);
app.get('/api/v1/bookings/date-range', protect, restrictTo('admin'), bookingController.getAllBookings);

// ----- AI -----
app.get('/api/v1/ai/health', aiController.health);
// Auth required for AI endpoints
app.post('/api/v1/ai/chat', protect, aiController.chat);
app.post('/api/v1/ai/code', protect, aiController.generateCode);
app.post('/api/v1/ai/document', protect, aiController.analyzeDocument);
app.post('/api/v1/ai/image', protect, aiController.generateImage);
app.post('/api/v1/ai/music', protect, aiController.generateMusic);
app.post('/api/v1/ai/video', protect, aiController.generateVideo);

// ----- Resume (Upload + Analysis) -----
app.post(
  '/api/v1/resume/analyze',
  protect,
  resumeController.uploadResume,
  resumeController.analyzeResume
);

// In production, serve static files from the Vite build
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the Vite build
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // Handle SPA routing, return all requests to the app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // In development, redirect non-API GET requests to Vite dev server
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next(); // Skip API requests
    }
    res.redirect('http://localhost:5173' + req.originalUrl);
  });
}

// Handle 404
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });});

// Error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// MongoDB Connection
let dbConnection;
const connectDB = async () => {
  try {
    if (dbConnection) {
      return dbConnection;
    }
    
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds timeout
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Ensure admin user exists after successful connection
    await ensureAdminUser();
    // Ensure review indexes are correct for optional course reviews
    await ensureReviewIndexes();
    // Ensure article indexes (handle legacy slug index)
    await ensureArticleIndexes();
    
    dbConnection = conn;
    
    // Add event listeners for connection issues
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Reconnecting...');
      connectDB(); // Attempt to reconnect
    });
    
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Full error details:', error);
    // Don't exit in development to allow for auto-restart
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    throw error;
  }
};

// Debug middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Serve static files from the Vite dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA fallback - return index.html for any non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    return res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
  res.status(404).json({ message: 'Not Found' });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      if (process.env.NODE_ENV !== 'production' && process.env.EMBED_VITE === 'true') {
        console.log(`🔧 Vite dev server running at http://localhost:5173`);
      }
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.log('UNHANDLED REJECTION! 💥 Shutting down...');
      console.log(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle SIGTERM for graceful shutdown
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
      server.close(() => {
        console.log('💥 Process terminated!');
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Function to start the Vite dev server in development
async function startViteDevServer() {
  if (process.env.NODE_ENV !== 'production' && process.env.EMBED_VITE === 'true') {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: {
          clientPort: 5173
        }
      },
      appType: 'spa',
      base: '/'
    });
    
    // Use vite's connect instance as middleware
    app.use(vite.middlewares);
    
    // Serve Vite dev server for all non-API routes in development
    app.use('*', async (req, res, next) => {
      // Skip API routes
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      
      try {
        const url = req.originalUrl;
        const template = await vite.transformIndexHtml(url, `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <link rel="icon" type="image/x-icon" href="/favicon.ico">
              <title>AI Kannada Platform</title>
            </head>
            <body>
              <div id="root"></div>
              <script type="module" src="/src/main.tsx"></script>
            </body>
          </html>
        `);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  }
}

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Start Vite dev server in development
if (process.env.NODE_ENV !== 'production' && process.env.EMBED_VITE === 'true') {
  startViteDevServer().catch(err => {
    console.error('Error starting Vite dev server:', err);
    process.exit(1);
  });
  
  // In development, proxy all non-API and non-asset requests to Vite dev server
  app.use((req, res, next) => {
    const isApiRequest = req.path.startsWith('/api/');
    const isAssetRequest = /\.(js|css|png|jpg|jpeg|gif|ico|svg|json|map)$/.test(req.path);
    
    if (isApiRequest || isAssetRequest) {
      return next();
    }
    
    // For all other requests in development, redirect to Vite dev server
    res.redirect(`http://localhost:5173${req.originalUrl}`);
  });
}

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});

export default app;
