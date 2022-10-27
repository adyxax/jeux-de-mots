function makeLoginController() {
	return {
		title: "Connection",
		data: {
			username: "",
			password: "",
		},
		errors: {},
	};
}

export default makeLoginController;
