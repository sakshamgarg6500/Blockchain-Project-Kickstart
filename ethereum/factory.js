import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

//STEP 2: Tell web3 that a deployed instance of CampaignFactory already exists
const instance = new web3.eth.Contract(
	JSON.parse(CampaignFactory.interface),
	"0x846C1c9dD81cA47e14534729862e47BB5B6F4F98"
);

export default instance;
