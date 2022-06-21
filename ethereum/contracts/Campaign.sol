pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender); //creating a new contract through a contract
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns(address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {

    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalsCount;
        mapping(address => bool) approvers;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public contributers;
    uint public contributersCount; //number of contributers in this contract

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        contributers[msg.sender] = true;
        contributersCount++;
    }

    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request ({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalsCount: 0
            //we only have to initialize value types not reference
        });
        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        require(contributers[msg.sender]); //if this person is a contributer
        require(!requests[index].approvers[msg.sender]); //if this person has voted already for this request

        requests[index].approvers[msg.sender] = true;
        requests[index].approvalsCount++;
    }

    function finalizeRequest(uint index) public restricted {
        require(!requests[index].complete); //to check if request is not completed
        require(requests[index].approvalsCount > (contributersCount / 2)); //50% of contributers have approved this request
        requests[index].recipient.transfer(requests[index].value); //transfer the money to the recipient
        requests[index].complete = true;
    }

    function getSummary() public view returns(uint, uint, uint, uint,address) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            contributersCount,
            manager
        );
    }

    function getRequestsCount() public view returns(uint) {
        return requests.length;
    }
}

//npm install ganache-cli mocha solc@0.4.17 fs-extra web3 @truffle/hdwallet-provider
//npm install ext react react-dom
//npm install semantic-ui-react semantic-ui-css
//npm install next-routes --legacy-peer-deps (for dynamic routimng in next.js)