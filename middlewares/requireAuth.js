function requireAuth(req, res, next) {
	if (req.session.userId) {
		next();
	}
	res.redirect(302, "/login");
}

export default requireAuth;
