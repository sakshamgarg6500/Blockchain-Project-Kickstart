import React, { Component } from "react";
import { Link } from "../../../routes";
import Layout from "../../../components/Layout";
import { Button, Table } from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

class RequestIndex extends Component {
	static async getInitialProps(props) {
		const address = props.query.address;
		const campaign = Campaign(address);
		const requestCount = await campaign.methods.getRequestsCount().call();
		const contributersCount = await campaign.methods.contributersCount().call();

		//solidity does not allow us to return array of structs
		//so we need to come up with a looping solution to get all the requests
		//STEP 1: Get the number of requests
		//STEP 2: Create an array of size = requestCount and map each element with separate call
		const requests = await Promise.all(
			Array(parseInt(requestCount))
				.fill()
				.map((element, index) => {
					return campaign.methods.requests(index).call();
				})
		);

		return { address, requests, requestCount, contributersCount };
	}

	renderrow() {
		return this.props.requests.map((request, index) => {
			return (
				<RequestRow
					key={index}
					id={index}
					request={request}
					address={this.props.address}
					contributersCount={this.props.contributersCount}
				/>
			);
		});
	}

	render() {
		const { Header, Row, HeaderCell, Body } = Table; //destructuring

		return (
			<Layout>
				<h3>Request List</h3>
				<Link route={`/campaigns/${this.props.address}/requests/new`}>
					<a>
						<Button primary floated="right" style={{ marginBottom: 10 }}>
							Create Requests
						</Button>
					</a>
				</Link>

				<Table>
					<Header>
						<Row>
							<HeaderCell>ID</HeaderCell>
							<HeaderCell>Description</HeaderCell>
							<HeaderCell>Amount</HeaderCell>
							<HeaderCell>Recipient</HeaderCell>
							<HeaderCell>Approval Count</HeaderCell>
							<HeaderCell>Approve</HeaderCell>
							<HeaderCell>Finalize</HeaderCell>
						</Row>
					</Header>
					<Body>{this.renderrow()}</Body>
				</Table>
				<div>Found {this.props.requestCount} requests</div>
			</Layout>
		);
	}
}

export default RequestIndex;
