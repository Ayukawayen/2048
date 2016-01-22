var PartyMainView = React.createClass({
	displayName: 'partyMain',

	selectedIndex:0,
	memberIds:null,
	
	render: function() {
Util.log(this.props);
		if(this.memberIds === null) {
			this.putSelectedIndex(0);
		}
		
		return (
			React.createElement('div', this.props, [
				React.createElement(PartyListView, {
					onItemClick:this.onItemClick,
					onMemberItemClick:this.onMemberItemClick,
				}),
				React.createElement(PartyMainView.MemberListView, {partyId:this.selectedIndex, onItemClick:this.onMemberItemClick}),
			])
		);
	},
	componentDidMount: function() {
		Hint.show('隊員長按');
	},
	
	onItemClick: function(item) {
		this.putSelectedIndex(item);
	},
	
	onEditClick: function() {
		this.setState({'isEditing':!this.state.isEditing});
	},
	
	onMemberItemClick: function(item) {
Util.log(item);

		var memberId = item.id;
Util.log(this);
		var party = Party.getItem(this.selectedIndex);
		var mi = this.memberIds.indexOf(memberId);
		if(mi < 0) {
			for(var i=0;i<Party.SizeMember;++i) {
				if(!this.memberIds[i]) {
					party.putMember(i, memberId);
					break;
				}
			}
		}
		else {
			party.putMember(mi, null);
		}
		
		this.setState({});
	},
	
	putSelectedIndex: function(index) {
		this.selectedIndex = index;
		this.memberIds = Party.getItem(this.selectedIndex).memberIds;
	},
	
});

PartyMainView.EditItemView = React.createClass({
	render: function() {
		return (
			React.createElement('li', {className: 'extra'}, (this.props.isEditing ? 'OK' : '編'))
		);
	},
	
	componentDidMount: function() {
		var node = this.getDOMNode();
		node.addEventListener('click', this.props.onClick);
	},
	componentWillUnmount: function() {
		var node = this.getDOMNode();
		node.removeEventListener('click', this.props.onClick);
	},
});

PartyMainView.MemberListView = React.createClass({
	displayName: 'memberList',
	
	render: function() {
		var members = Member.items();
		
		return (
			React.createElement('ul', {className: 'memberList'}, members.map(this.createItemElement))
		);
		
	},

	createItemElement: function(arg) {
		var memberIds = Party.getItem(this.props.partyId).memberIds;
		
		var cn = 'selected_'+(memberIds.indexOf(arg.id));
		return React.createElement(MemberListView.MemberItemView, {className:cn, 'item':arg, 'onClick':this.onItemClick});
	},
	
	onItemClick: function(item) {
		if(this.props.onItemClick) {
			this.props.onItemClick(item);
		}
	},
});