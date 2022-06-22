import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";
import { Link } from "../routes";

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

	renderCampaigns() {
		const items = this.props.campaign.map((address) => {
			return {
				header: address,
				description: (
					<Link route={`/campaigns/${address}`}>
						<a>View Campaign</a>
					</Link>
				),
				fluid: true,
			};
		});

		return <Card.Group items={items} />;
	}

	render() {
		return (
			<Layout>
				<div>
					<h3>Open Campaigns</h3>
					<Link route="/campaigns/new">
						<a>
							<Button
								floated="right"
								content="Create Campaign"
								icon="add"
								primary
							/>
						</a>
					</Link>
					{this.renderCampaigns()}
				</div>
			</Layout>
		);
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
