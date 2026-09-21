"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const mongodb_connection_1 = __importDefault(require("./config/mongodb.connection"));
require("./config/passport.connection"); // Initialize passport configuration
const errorHandling_middleware_1 = require("./middlewares/errorHandling.middleware");
const user_routes_1 = __importDefault(require("./modules/user/user.routes"));
const verify_route_1 = __importDefault(require("./modules/verify/verify.route"));
const checkUsername_route_1 = __importDefault(require("./modules/checkUsername/checkUsername.route"));
const profile_routes_1 = __importDefault(require("./modules/profile/profile.routes"));
const schemes_routes_1 = __importDefault(require("./modules/schemes/schemes.routes"));
const applications_routes_1 = __importDefault(require("./modules/applications/applications.routes"));
const ai_routes_1 = __importDefault(require("./modules/ai/ai.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const adminDashboard_routes_1 = __importDefault(require("./modules/adminDashboardData/adminDashboard.routes"));
const location_routes_1 = __importDefault(require("./modules/location/location.routes"));
const citizen_route_1 = __importDefault(require("./modules/citizenDashboardData/citizen.route"));
const speech_routes_1 = __importDefault(require("./modules/speech/speech.routes"));
const redis_connection_1 = require("./config/redis.connection");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
// Create a new express application instance
const app = (0, express_1.default)();
// connect the mongoDB database
(0, mongodb_connection_1.default)();
// connect the redis client here
(0, redis_connection_1.redisConnection)();
// added the helmet middleware to add security headers
app.use((0, helmet_1.default)());
// connect the frontend with backend using cors middleware
const corsOptions = {
    origin: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ], // allow frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true, // allow cookies/auth headers
};
app.use((0, cors_1.default)(corsOptions)); // connect with cors
// Cookie Parser Middleware
app.use((0, cookie_parser_1.default)());
// Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(passport_1.default.initialize()); // initialize the passport middleware
// Routes
app.use("/auth", user_routes_1.default);
app.use("/verify", verify_route_1.default);
app.use("/check-username", checkUsername_route_1.default);
// Core API endpoints
app.use("/api/profile", profile_routes_1.default);
app.use("/api/schemes", schemes_routes_1.default);
app.use("/api/applications", applications_routes_1.default);
app.use("/api/ai", ai_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api/admin", adminDashboard_routes_1.default);
app.use("/api/location", location_routes_1.default);
app.use("/api/citizen", citizen_route_1.default);
app.use("/api/speech", speech_routes_1.default);
// Set the network port
const port = process.env.PORT || 6001;
// Define the root path with a greeting message
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Walefare Schemes Management System!" });
});
// use the error handling middleware
app.use(errorHandling_middleware_1.errorHandler);
// Start the Express server
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});
