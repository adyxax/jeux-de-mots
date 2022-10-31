function makeController(req, cwdata) {
	return {
		title: "Jouer",
		user: req.session.user,
		CWDATA: cwdata,
	};
}

export default makeController;
