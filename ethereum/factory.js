import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

//STEP 2: Tell web3 that a deployed instance of CampaignFactory already exists
const instance = new web3.eth.Contract(
	JSON.parse(CampaignFactory.interface),
	"0xc749355FFC0491c82d23De0E8AD09c0e356dBfe1"
);

export default instance;
