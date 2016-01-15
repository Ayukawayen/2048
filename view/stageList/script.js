var StageListView = React.createClass({
	displayName: 'stageList',
	
	render: function() {
		var items = Stage.items('id', true);

		return (
			React.createElement('ul', {className: 'stageList'}, items.map(this.createItemElement))
		);
		
	},

	createItemElement: function(item) {
		return React.createElement(StageListView.ItemView, {'onClick':this.props.onItemClick, 'item':item});
	},

});

StageListView.ItemView = React.createClass({
	render: function() {
		var item = this.props.item;
		return (
			React.createElement('li', {}, [
				React.createElement('div', {className:'name'}, item.name),
				React.createElement('dl', {className:'meta lv'}, [
					React.createElement('dt', {}, '等級'),
					React.createElement('dd', {}, item.lv),
				]),
				React.createElement('dl', {className:'meta floor'}, [
					React.createElement('dt', {}, '層數'),
					React.createElement('dd', {}, item.cntFloor),
				]),
			])
		);
	},
	
	componentDidMount: function() {
		this.getDOMNode().addEventListener('click', this.onClick);
	},
	componentWillUnmount: function() {
		this.getDOMNode().removeEventListener('click', this.onClick);
	},
	
	onClick: function(e) {
		Battle.putStgId(this.props.item.id);
		this.props.onClick(this.props.item);
	},

});


