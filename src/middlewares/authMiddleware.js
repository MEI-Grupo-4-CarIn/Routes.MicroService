const jwt = require("jsonwebtoken");

function authMiddleware(allowedRoles) {
  return function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const PUB_KEY = process.env.JWT_PUBLIC_KEY.replace(/\\n/g, "\n");
      jwt.verify(token, PUB_KEY, { algorithms: ["RS256"] }, (err, user) => {
        if (err) {
          return res.status(403).send({ message: "Invalid token." });
        }
        // Check if the user's role is allowed
        if (allowedRoles.includes(user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"])) {
          req.user = user;
          next();
        } else {
          res.status(403).send({
            message: "You do not have the required role to access this resource.",
          });
        }
      });
    } else {
      res.status(401).send({ message: "Authorization header not found." });
    }
  };
}

module.exports = authMiddleware;
