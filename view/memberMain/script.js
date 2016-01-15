var MemberMainView = React.createClass({
	displayName: 'memberMain',
	
	render: function() {
		return (
			React.createElement('div', this.props, [
				React.createElement(MemberListView, {}),
			])
		);
	},
	
});


