function requireAuth(req, res, next) {
	if (req.session.user !== undefined) {
		next();
	}
	res.redirect(302, "/login");
}

export default requireAuth;
