import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET ?? 'dev_secret_change_me';
export function requireAuth(req, res, next) {
    const header = req.headers['authorization'];
    if (!header || typeof header !== 'string')
        return res.status(401).json({ error: 'Missing Authorization' });
    const [, token] = header.split(' ');
    if (!token)
        return res.status(401).json({ error: 'Missing token' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.sub, role: decoded.role, tier: decoded.tier };
        next();
    }
    catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}
