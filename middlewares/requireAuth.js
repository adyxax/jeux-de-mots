function requireAuth(req, res, next) {
	if (req.session.user !== undefined) {
		return next();
	}
	return res.redirect(302, '/login');
}

export default requireAuth;
