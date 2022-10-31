function makeController(req) {
	return {
		title: "Connexion",
		user: req.session.user,
		data: {
			username: "",
			password: "",
		},
		errors: {},
	};
}

export default makeController;
