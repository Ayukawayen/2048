var SupListView = React.createClass({
	displayName: 'supList',
	
	render: function() {
		var items = [{id:0,uid:0,member:null,}].concat(Supporter.items());
		
Util.log(items);
		return (
			React.createElement('ul', {className: 'supList'}, items.map(this.createItemElement))
		);
		
	},

	createItemElement: function(arg) {
		return React.createElement(MemberListView.MemberItemView, {'ref':'item_'+arg.id, 'item':arg.member, 'onClick':this.props.onItemClick});
	},
});
