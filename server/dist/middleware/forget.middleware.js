import jwt from "jsonwebtoken";
const JWT_SECRET = "jwt#secret";
export const forgetMiddleware = async (req, res, next) => {
    try {
        const headers = req.headers.authorization;
        if (!headers || !headers.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = headers.split(" ")[1];
        // verify JWT
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
//# sourceMappingURL=forget.middleware.js.map