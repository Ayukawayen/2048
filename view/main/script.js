var MainView = React.createClass({
	displayName: 'MainView',
	instance: null,
	
	render: function() {
Util.log('MainView render');

		MainView.instance = this;
		
		return (React.createElement('div', {id:'main', className: 'relative'}, [
			React.createElement('ul', {className: 'menu'}, [
				React.createElement(MainView.MenuItemView, {content:'出戰', target:StageMainView,}),
				React.createElement(MainView.MenuItemView, {content:'隊伍', target:PartyMainView, }),
				React.createElement(MainView.MenuItemView, {content:'隊員', target:MemberMainView,}),
				/*
				React.createElement(MainView.MenuItemView, {content:'招募', target:MemberMainView,}),
				React.createElement(MainView.MenuItemView, {content:'戰友', target:MemberMainView,}),
				React.createElement(MainView.MenuItemView, {content:'其他', target:MemberMainView,}),
				*/
			]),
			React.createElement(MainView.ContentView, {ref:'contentView'}),
		]));
	},
	
	statics: {
		historys: [],
		setContentView: function(target, props) {
			var self = this.instance;
			
			if(self.isMounted()) {
				var node = self.getDOMNode();
				node.setAttribute('fullscreen', target.isFullScreen?'true':'false');
			}
			self.refs.contentView.setState({'view':target, 'props':props});
			MainView.historys.push(target);
		},
		goBack: function() {
Util.log('goBakc()');
Util.log(MainView.historys);
			if(MainView.historys.length <= 1) {
				return;
			}
			MainView.historys.pop();
			var target = MainView.historys[MainView.historys.length-1];
			
			var self = this.instance;
			
			self.refs.contentView.setState({'view':target, 'props':{}});
		},
		
	},
});

MainView.ContentView = React.createClass({
	getInitialState: function() {
		return {'view':null, 'props':{}};
	},
	
	render: function() {
Util.log('Content render');
		
		if(!this.state.view) {
			return React.createElement('div', {className: 'content'});
		}
		
		var props = {className: 'content view_'+this.state.view.displayName};
		for(var k in this.state.props) {
			props[k] = this.state.props[k];
		}
		
		return React.createElement(this.state.view, props, [
		]);
	},
});

MainView.MenuItemView = React.createClass({
	render: function() {
		return (React.createElement('li', {}, [
			this.props.content,
		]));
	},
	
	componentDidMount: function() {
		this.getDOMNode().addEventListener('click', this.onClick);
	},
	componentWillUnmount: function() {
		this.getDOMNode().removeEventListener('click', this.onClick);
	},
	
	onClick: function(e) {
		MainView.setContentView(this.props.target);
	},
	
});