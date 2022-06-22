import React, { Component } from "react";
import { Link } from "../../../routes";
import Layout from "../../../components/Layout";
import { Button } from "semantic-ui-react";

class RequestIndex extends Component {
	static async getInitialProps(props) {
		const address = props.query.address;
		return { address };
	}

	render() {
		return (
			<Layout>
				<h3>Request List</h3>
				<Link route={`/campaigns/${this.props.address}/requests/new`}>
					<a>
						<Button primary>Create Requests</Button>
					</a>
				</Link>
			</Layout>
		);
	}
}

export default RequestIndex;
