var PopupView = React.createClass({
	displayName: 'popup',
	getInitialState: function() {
		return {'isShow':false, 'buttons':[]};
	},
	
	render: function() {
		if(!this.state.isShow) {
			return null;
		}
		
		return (React.createElement('div', {className: 'popup'}, [
			React.createElement('div', {className: 'content'}, this.state.content),
			React.createElement('div', {className: 'buttonList size_'+this.state.buttons.length}, this.state.buttons.map(this.createButtonElement)),
		]));
	},
	
	createButtonElement: function(item) {
		return (
			React.createElement(PopupView.ButtonView, {'item':item, 'onClick':this.state.onButtonClick})
		);
	},
});

PopupView.ButtonView = React.createClass({
	render: function() {
		var item = this.props.item;
		
		return (
			React.createElement('button', {className: item.type}, item.text)
		);
	},
	
	componentDidMount: function() {
		this.getDOMNode().addEventListener('click', this.onClick);
	},
	componentWillUnmount: function() {
		this.getDOMNode().removeEventListener('click', this.onClick);
	},
	
	onClick: function(e) {
		if(this.props.onClick) {
			this.props.onClick(this.props.item);
			return;
		}
		
		PopupView.ButtonView.defaultOnClick(this.props.item);
	},

});

PopupView.ButtonView.defaultOnClick = function(item) {
	MainView.setPopupView({
		isShow:false,
		content:'',
		buttons:[
		],
	});
};
