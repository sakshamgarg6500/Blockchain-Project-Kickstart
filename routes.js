const routes = require("next-routes")(); //returns a function

routes
	.add("/campaigns/new", "/campaigns/new")
	.add("/campaigns/:address", "campaigns/show"); //showing view campaigns page using dynamic routing

module.exports = routes;
