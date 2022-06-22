import React, { Component } from "react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import { Card, Grid, Button } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";

class CampaignShow extends Component {
	static async getInitialProps(props) {
		const campaign = Campaign(props.query.address);
		const summary = await campaign.methods.getSummary().call();
		return {
			address: props.query.address,
			minimumContribution: summary[0],
			balance: summary[1],
			requestCount: summary[2],
			contributersCount: summary[3],
			manager: summary[4],
		};
	}

	renderCards() {
		const items = [
			{
				header: this.props.manager,
				meta: "Address of Manager",
				description:
					"The manager created this campaign and can create requests to withdraw money",
				style: { overflowWrap: "break-word" },
			},
			{
				header: this.props.minimumContribution,
				meta: "Minimum Contribution (wei)",
				description:
					"You must contribute at least this much wei to become a contributer",
			},
			{
				header: this.props.requestCount,
				meta: "Number of pending requests",
				description:
					"A request tries to withdraw money from the contract. Requests must be approved by the contributers.",
			},
			{
				header: this.props.contributersCount,
				meta: "Number of contributers",
				description:
					"Number of people who have already contributed to this campaign",
			},
			{
				header: web3.utils.fromWei(this.props.balance, "ether"),
				meta: "Campaign balance (ether)",
				description: "The money that this campaign has left to spend",
			},
		];

		return <Card.Group items={items} />;
	}

	render() {
		return (
			<Layout>
				<h3>Campaign Show</h3>
				<Grid>
					<Grid.Row>
						<Grid.Column width={10}>{this.renderCards()}</Grid.Column>

						<Grid.Column width={6}>
							<ContributeForm address={this.props.address} />
						</Grid.Column>
					</Grid.Row>

					<Grid.Row>
						<Grid.Column>
							<Link route={`/campaigns/${this.props.address}/requests`}>
								<a>
									<Button primary>View Requests</Button>
								</a>
							</Link>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Layout>
		);
	}
}

export default CampaignShow;
