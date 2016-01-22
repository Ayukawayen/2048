var MemberListView = React.createClass({
	displayName: 'memberList',
	
	render: function() {
		var members = Member.items();
//Util.log(members);
		return (
			React.createElement('ul', {className: 'memberList'}, members.map(this.createItemElement))
		);
		
	},

	createItemElement: function(arg) {
		return React.createElement(MemberListView.MemberItemView, {'item':arg, 'onClick':this.props.onItemClick});
	},
});

MemberListView.MemberItemView = React.createClass({
	pressTimeout: 1000,

	render: function() {
		//this.refresh();
		
		var item = this.props.item;
		
		return (
			React.createElement('li', {className:this.props.className||''}, [
				React.createElement('img', {className:'img', src: Chara.imgPath+(item ? item.img : Chara.imgEmpty)}),
//				React.createElement('span', {className:'name'}, this.props.item.name),
			])
		);
	},
	
	componentDidMount: function() {
		var node = this.getDOMNode();
		
		node.addEventListener('click', this.onClick);
		
		//node.addEventListener('dblclick', this.onLongPress);
		
		node.addEventListener('mousedown', this.onPressStart);
		node.addEventListener('mouseup', this.onPressCancel);
		node.addEventListener('mouseout', this.onPressCancel);
		
		node.addEventListener('touchstart', this.onPressStart);
		node.addEventListener('touchend', this.onTouchEnd);
		node.addEventListener('touchmove', this.onTouchMove);
	},
	componentWillUnmount: function() {
		var node = this.getDOMNode();
		
		node.removeEventListener('click', this.onClick);
		
		node.removeEventListener('dblclick', this.onLongPress);
		
		node.removeEventListener('mousedown', this.onPressStart);
		node.removeEventListener('mouseup', this.onPressCancel);
		node.removeEventListener('mouseout', this.onPressCancel);
		
		node.removeEventListener('touchstart', this.onPressStart);
		node.removeEventListener('touchend', this.onTouchEnd);
		node.removeEventListener('touchmove', this.onTouchMove);
	},

	refresh: function() {
		if(!this.isMounted()) {
			return;
		}
		var node = this.getDOMNode();
		//node.style.backgroundImage = "url('"+Chara.imgPath+(this.props.item ? this.props.item.img : Chara.imgEmpty)+"')";
	},
	
	
	onClick: function(e) {
		if(this.props.onClick) {
			this.props.onClick(this.props.item);
			return;
		}
	},
	
	onPressStart: function(e) {
		e.preventDefault();
		
		this.onLongPress.e = {x:e.clientX, y:e.clientY};
		this.pressTimer = setTimeout(this.onLongPress, this.pressTimeout);
	},
	onPressCancel: function(e) {
		e.preventDefault();

		if(this.pressTimer) {
			clearTimeout(this.pressTimer);
			this.pressTimer = null;
		}
	},
	onTouchEnd: function(e) {
		if(!this.pressTimer) {
			return;
		}
		this.onPressCancel(e);
		this.onClick(e);
	},
	onTouchMove: function(e) {
		if(!this.pressTimer) {
			return;
		}
		
		var touch = e.touches[0];
		if(!touch) {
			return;
		}
		
		if( false
			|| touch.clientX < touch.target.offsetLeft || touch.clientX > touch.target.offsetLeft+touch.target.offsetWidth
			|| touch.clientY < touch.target.offsetTop || touch.clientY > touch.target.offsetTop+touch.target.offsetHeight
		) {
			clearTimeout(this.pressTimer);
			this.pressTimer = null;
			e.preventDefault();
			return;
		}
		
	},

	onLongPress: function(e) {
		if(!this.props.item) {
			return;
		}
		MainView.setContentView(MemberDetailView, {'item':this.props.item});
	},
});


