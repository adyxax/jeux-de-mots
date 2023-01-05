export function logout_get(req, res) {
	if (req.session.user !== undefined) {
		res.clearCookie('JDMSessionId');
		req.session.destroy();
	}
	return res.redirect(302, '/');
}
