var PartyListView = React.createClass({
	displayName: 'partyList',
	
	getInitialState: function() {
		return {'selectedIndex':0};
	},
	
	render: function() {
Util.log('PartyListView render');

		this.items = Party.items();

		return (
			React.createElement('div', {className: 'partyList'}, [
				//React.createElement('ul', {className: 'partyTabList'}, this.items.map(this.createItemElement)),
				React.createElement(PartyListView.PartySummaryView, {'item':this.items[this.state.selectedIndex], 'onItemClick':this.props.onMemberItemClick, 'extraItem':this.props.extraItem}),
			])
		);
		
	},

	createItemElement: function(item) {
		return React.createElement(PartyListView.PartyItemView, {'item':item, 'onClick':this.onItemClick, 'isSelected':(item.id == this.state.selectedIndex)});
	},
	
	onItemClick: function(item) {
		if(this.state.selectedIndex == item.id) {
			return;
		}
		this.setState({'selectedIndex':item.id});
		
		if(this.props.onItemClick) {
			this.props.onItemClick(item.id);
		}
	},

});

PartyListView.PartyItemView = React.createClass({
	render: function() {
Util.log('PartyItemView render');

		var cn = 'selected_' + (this.props.isSelected ? 'true' : 'false')
			+ ' opened_' + (this.props.item.isOpened ? 'true' : 'false')
		;
		return (
			React.createElement('li', {className:cn}, [
				(this.props.item.id+1),
			])
		);
	},
	
	componentDidMount: function() {
		var node = this.getDOMNode();
		node.addEventListener('click', this.onClick);
	},
	componentWillUnmount: function() {
		var node = this.getDOMNode();
		node.removeEventListener('click', this.onClick);
	},
	
	onClick: function(e) {
		if(!this.props.item.isOpened) {
			return;
		}
		this.props.onClick(this.props.item);
	},

});

PartyListView.PartySummaryView = React.createClass({
	render: function() {
		for(var i=this.props.item.memberIds.length;i<Party.SizeMember;++i) {
			this.props.item.memberIds[i] = 0;
		}
		
		return (
			React.createElement('div', {className:'partySummary'}, [
				React.createElement('ul', {className:'memberList'}, 
					this.props.item.memberIds.map(this.createMemberItemElement)
						.concat([this.props.extraItem])
				),
				React.createElement('ul', {className:'attrList'}, Chara.attrInfos.map(this.createAttrItemElement)),
			])
		);
	},
	
	createMemberItemElement: function(item) {
		return React.createElement(MemberListView.MemberItemView, {'item':Member.getItem(item), 'onClick':this.props.onItemClick});
	},
	
	createAttrItemElement: function(item) {
Util.log(this.props.item);

		var value = (this.props.item.attrs[item.key] || 0) + (this.props.extraItem ? (this.props.extraItem.attrs[item.key] || 0) : 0)
		return React.createElement('li', {}, [
			React.createElement('span', {className:'name'}, item.display),
			React.createElement('span', {className:'value'}, value),
		]);
	},

});
