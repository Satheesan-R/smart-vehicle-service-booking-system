const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
	const header = req.headers.authorization || "";
	const [scheme, token] = header.split(" ");

	if (scheme !== "Bearer" || !token) {
		return res.status(401).json({ message: "Authentication token is required" });
	}

	try {
		req.user = jwt.verify(token, JWT_SECRET);
		next();
	} catch {
		return res.status(401).json({ message: "Invalid or expired authentication token" });
	}
}

function authorize(...roles) {
	return (req, res, next) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.status(403).json({ message: "You are not authorized to access this resource" });
		}
		next();
	};
}

module.exports = { verifyToken, authorize };
