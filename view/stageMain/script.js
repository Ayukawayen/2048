var StageMainView = React.createClass({
	displayName: 'stageMain',
	
	render: function() {
		return (
			React.createElement('div', this.props, [
				React.createElement(StageListView, {onItemClick:this.onItemClick})
			])
		);
		
	},

	onItemClick: function(item) {
Util.log(item);
		MainView.setContentView(StagePartySelectView);
	},

});