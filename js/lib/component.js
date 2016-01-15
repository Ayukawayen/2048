var BasicComponent = React.createClass({
	render: function() {
		return (
			React.createElement(this.props.tagName, this.props.props||{}, this.props.children||'')
		);
	},
	
	componentDidMount: function() {
		var node = this.getDOMNode();
		for(var key in this.props.eventListener) {
			node.addEventListener(key, this.props.eventListener[key]);
		}
	},
	componentWillUnmount: function() {
		var node = this.getDOMNode();
		for(var key in this.props.eventListener) {
			node.removeEventListener(key, this.props.eventListener[key]);
		}
	},
});