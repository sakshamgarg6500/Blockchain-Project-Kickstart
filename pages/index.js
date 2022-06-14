import React, { Component } from "react";
import factory from "../ethereum/factory";

class CampaignIndex extends Component {
	//whenever we define a class in javascript, we have to create an instance of that class
	//static is not related to instance of that class but is tied to the class itself
	//next does not want to render our component on the server as it is a computationally expensive task
	//so it directly calls the getInitialProps to get the initial data
	static async getInitialProps() {
		const campaign = await factory.methods.getDeployedCampaigns().call();
		return { campaign }; //this object is provided to our components as props
	}

	/* async componentDidMount() {
		const campaign = await factory.methods.getDeployedCampaigns().call();
		console.log(campaign);
	} */

	render() {
		return <div>{this.props.campaign[0]}</div>;
	}
}

export default CampaignIndex;

//A LITTLE ABOUT HOW NEXT.JS WORKS

//next.js does server side rendering
//it attempts to render our component on the server
//and then talke the html and send it to the browser

//although when we want to fetch data from the ethereum network on the server, next does not execute componentDidMount function
//componentDidMount function is not executed on the next server
//so fetching of data from ethereum network has to be done at some other method than componentDidMount
//this method is called getInitialProps which is only specific to next.js
