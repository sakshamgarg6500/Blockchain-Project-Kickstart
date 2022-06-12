const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts; //accounts provided by ganache
let factory; //deployed instance of Factory
let campaignAddress;
let campaign;

beforeEach(async () => {
	accounts = await web3.eth.getAccounts();

	factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
		.deploy({ data: compiledFactory.bytecode })
		.send({ from: accounts[0], gas: 1000000 });

	await factory.methods
		.createCampaign("100")
		.send({ from: accounts[0], gas: 1000000 }); //campaign manager is set from here

	[campaignAddress] = await factory.methods.getDeployedCampaigns().call(); //get the first campaign

	//now we have a deployed campaign contract at 'campaignAddress'
	//we have to use web3 to tell about its existence
	//so we pass interface of the contract and its address
	campaign = await new web3.eth.Contract(
		JSON.parse(compiledCampaign.interface),
		campaignAddress
	);
});

describe("Testing Campaigns", () => {
	it("Deploys factory and campaign", () => {
		assert.ok(factory.options.address);
		assert.ok(campaign.options.address);
	});

	it("Marks the caller as the campaign manager", async () => {
		const manager = await campaign.methods.manager().call();
		assert.equal(accounts[0], manager);
	});

	it("Checks if person is becoming a contributer", async () => {
		await campaign.methods
			.contribute()
			.send({ from: accounts[1], value: "200" });
		const contributer = await campaign.methods.contributers(accounts[1]).call();
		assert(contributer);
	});

	it("Has some minimum contribution", async () => {
		try {
			await campaign.methods
				.contribute()
				.send({ from: accounts[1], value: "50" });
			assert(false);
		} catch (err) {
			assert(err);
		}
	});

	it("Make a request", async () => {
		await campaign.methods
			.createRequest("Buy Batteries", "300", accounts[2])
			.send({ from: accounts[0], gas: 1000000 });
		const request = await campaign.methods.requests(0).call();
		assert.equal("Buy Batteries", request.description);
	});

	it("End to End test", async () => {
		//get initial balance of recipient account
		const initialBalance = await web3.eth.getBalance(accounts[2]);

		//contribute to a campaign
		await campaign.methods
			.contribute()
			.send({ from: accounts[1], value: "200" });

		//create a request
		await campaign.methods
			.createRequest("Buy Batteries", "150", accounts[2])
			.send({ from: accounts[0], gas: 1000000 });

		//approve a request
		await campaign.methods
			.approveRequest(0)
			.send({ from: accounts[1], gas: 1000000 });

		//finalise a request
		await campaign.methods
			.finalizeRequest(0)
			.send({ from: accounts[0], gas: 1000000 });

		//check if recipient account gets credited
		const finalBalance = await web3.eth.getBalance(accounts[2]);
		assert(finalBalance > initialBalance);
	});
});
