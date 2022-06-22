import React, { Component } from "react";
import Layout from "../../../components/Layout";
import { Form, Button, Message, Input } from "semantic-ui-react";
import web3 from "../../../ethereum/web3";
import Campaign from "../../../ethereum/campaign";
import { Link, Router } from "../../../routes";

class NewRequest extends Component {
	state = {
		value: "",
		description: "",
		recipient: "",
		loading: false,
		errorMessage: "",
	};

	static async getInitialProps(props) {
		const { address } = props.query;
		return { address };
	}

	onSubmit = async (event) => {
		event.preventDefault();
		const campaign = Campaign(this.props.address);
		this.setState({ loading: true, errorMessage: "" });

		try {
			const accounts = await web3.eth.getAccounts();
			await campaign.methods
				.createRequest(
					this.state.description,
					web3.utils.toWei(this.state.value, "ether"),
					this.state.recipient
				)
				.send({ from: accounts[0] });
			Router.pushRoute(`/campaigns/${this.props.address}/requests`);
		} catch (err) {
			this.setState({ errorMessage: err.message });
		}
		this.setState({ loading: false });
	};

	render() {
		return (
			<Layout>
				<Link route={`/campaigns/${this.props.address}/requests`}>
					<a>Back</a>
				</Link>
				<h3>New Request</h3>
				<Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
					<Form.Field>
						<label>Description</label>
						<Form.Input
							value={this.state.description}
							onChange={(event) =>
								this.setState({ description: event.target.value })
							}
						></Form.Input>
					</Form.Field>

					<Form.Field>
						<label>Value in Ether</label>
						<Form.Input
							value={this.state.value}
							onChange={(event) => this.setState({ value: event.target.value })}
						></Form.Input>
					</Form.Field>

					<Form.Field>
						<label>Recipient</label>
						<Form.Input
							value={this.state.recipient}
							onChange={(event) =>
								this.setState({ recipient: event.target.value })
							}
						></Form.Input>
					</Form.Field>
					<Message error header="Oops!" content={this.state.errorMessage} />
					<Button primary loading={this.state.loading}>
						Create
					</Button>
				</Form>
			</Layout>
		);
	}
}

export default NewRequest;
