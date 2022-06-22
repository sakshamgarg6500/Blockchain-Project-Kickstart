import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Link, Router } from "../../routes";
// link tag is a react component which helps us render anchor tags and navigate around the application
//router allows us to redirect from one page to another page

class CampaignNew extends Component {
	state = {
		minimumContribution: "",
		errorMessage: "",
		loading: false,
	};

	onSubmit = async (event) => {
		event.preventDefault();
		this.setState({ loading: true, errorMessage: "" });

		const accounts = await web3.eth.getAccounts();
		try {
			await factory.methods
				.createCampaign(this.state.minimumContribution)
				.send({ from: accounts[0] }); //metamsk will calculate gas on its own so we need not specify that

			Router.pushRoute("/"); //redirect
		} catch (err) {
			this.setState({ errorMessage: err.message });
		}
		this.setState({ loading: false });
	};

	render() {
		return (
			<Layout>
				<h3>Create a new Campaign</h3>
				<Form error={!!this.state.errorMessage}>
					{/* when component first loads up, error will be an empty string and hence will not be shown */}
					{/* two '!' marks as 'error' expects a boolean value so we flip its value twice */}
					<Form.Field>
						<label>Minimum Contribution</label>
						<Input
							label="wei"
							labelPosition="right"
							value={this.state.minimumContribution}
							onChange={(event) =>
								this.setState({ minimumContribution: event.target.value })
							}
						/>
					</Form.Field>
					<Message content={this.state.errorMessage} error header="Oops!" />
					<Button
						content="Create"
						primary
						loading={this.state.loading}
						onClick={this.onSubmit}
					/>
				</Form>
				<h1>New Campaign</h1>
			</Layout>
		);
	}
}

export default CampaignNew;
