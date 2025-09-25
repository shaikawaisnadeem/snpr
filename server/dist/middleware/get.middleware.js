import jwt from "jsonwebtoken";
const JWT_SECRET = "jwt#secret";
export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        // verify JWT
        const decoded = jwt.verify(token, JWT_SECRET);
        // attach user data to request (you can pass email, id, etc.)
        req.user = decoded;
        next(); // go to the next handler
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
//# sourceMappingURL=get.middleware.js.map