var StagePartySelectView = React.createClass({
	displayName: 'stagePartySelect',
	
	selectedIndex:0,
	sup:null,
	
	render: function() {
		var exItem = React.createElement(MemberListView.MemberItemView, {item:this.sup});
		exItem.attrs = this.sup ? this.sup.attrs : {};

		return (
			React.createElement('div', this.props, [
				React.createElement(PartyListView, {onItemClick:this.onPartyItemClick, extraItem:exItem,}),
				React.createElement(SupListView, {onItemClick:this.onSupItemClick}),
				React.createElement(BasicComponent, {tagName:'div', props:{className:'submit'}, eventListener:{'click':this.onSubmitClick}, children:['GO!']}),
			])
		);
	},
	componentDidMount: function() {
		Hint.show('隊員長按');
	},

	onPartyItemClick: function(item) {
Util.log(item);
		this.selectedIndex = item;
		Battle.partyId = item;
	},
	onSupItemClick: function(item) {
Util.log(item);
		this.sup = item;
		Battle.supId = item ? item.id : null;
		this.setState({});
	},

	onSubmitClick: function(e) {
Util.log('Go!');
Util.log(this.selectedIndex);
		MainView.setContentView(BattleView);
	},
});
