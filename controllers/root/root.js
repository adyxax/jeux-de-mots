export function root_get(req, res) {
	if (req.session.user !== undefined) {
		return res.redirect(302, "/games");
	}
	return res.redirect(302, "/login");
}
