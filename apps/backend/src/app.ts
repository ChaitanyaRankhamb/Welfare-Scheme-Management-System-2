import express, { Request, Response } from "express";
import connectDB from "./config/mongodb.connection";
import "./config/passport.connection"; // Initialize passport configuration
import { errorHandler } from "./middlewares/errorHandling.middleware";
import { globalRateLimiter } from "./middlewares/global-rate-limiter.middleware";
import userRouter from "./modules/user/user.routes";
import verifyRouter from "./modules/verify/verify.route";
import checkUsernameRouter from "./modules/checkUsername/checkUsername.route";
import applicationsRouter from "./modules/applications/applications.routes";
import aiRouter from "./modules/ai/ai.routes";
import adminRouter from "./modules/admin/admin.routes";
import adminDashboardRouter from "./modules/adminDashboardData/adminDashboard.routes";
import citizenDashboardRouter from "./modules/citizenDashboardData/citizen.route";
import locationRouter from "./modules/location/location.routes";
import schemesRouter from "./modules/schemes/schemes.routes";
import speechRouter from "./modules/speech/speech.routes";
import profileRouter from "./modules/profile/profile.routes";
import notificationRouter from "./modules/notifications/notification.routes";
import { redisConnection } from "./config/redis.connection";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import { initializeMinio } from "./config/minio";
import { initializeNovu } from "./config/novu.config";

// Create a new express application instance
const app = express();

// Trust reverse proxy headers (e.g. Nginx, Cloudflare, AWS ALB) for accurate rate limiting by client IP
app.set("trust proxy", 1);

// connect the frontend with backend using cors middleware
const corsOptions = {
  origin: ["http://localhost:3001", "http://127.0.0.1:3001"], // allow frontend
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true, // allow cookies/auth headers
};

app.use(cors(corsOptions)); // connect with cors

// Apply the token-bucket limit to every route.
app.use(globalRateLimiter);

// Cookie Parser Middleware
app.use(cookieParser());

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize()); // initialize the passport middleware

// added all the routes here
app.use("/auth", userRouter);
app.use("/verify", verifyRouter);
app.use("/check-username", checkUsernameRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/ai", aiRouter);
app.use("/api/admin", adminRouter);
app.use("/api/admin", adminDashboardRouter);
app.use("/api/citizen", citizenDashboardRouter);
app.use("/api/location", locationRouter);
app.use("/api/schemes", schemesRouter);
app.use("/api/speech", speechRouter);
app.use("/api/profile", profileRouter);
app.use("/api/notifications", notificationRouter);

// Set the network port
const port = process.env.PORT || 6001;

// Define the root path with a greeting message
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Walefare Schemes Management System!" });
});

// use the error handling middleware
app.use(errorHandler);

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Connect to Redis
    await redisConnection();

    // Initialize Minio & Novu
    await initializeMinio();
    initializeNovu();

    // Start listening only after critical services connect
    app.listen(port, () => {
      console.log(`The server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server due to connection error:", error);
    process.exit(1);
  }
};

startServer();
