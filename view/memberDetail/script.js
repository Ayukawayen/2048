var MemberDetailView = React.createClass({
	displayName: 'memberDetail',
	getInitialState: function() {
		return {'mode':'main'};
	},
	
	render: function() {
		var item = this.props.item;

		return (
			React.createElement('div', this.props, [
				React.createElement('div', {className: 'relative mode_'+this.state.mode}, [
				
					React.createElement('div', {className: 'image modeMain'}, [
						React.createElement('img', {src: Chara.imgLPath+(item ? item.img : Chara.imgEmpty)}),
					]),
					React.createElement('ul', {className: 'attrList modeMain'}, Chara.attrInfos.map(this.createAttrItemElement)),
					React.createElement('div', {className: 'passive modeMain'}, [
						React.createElement('div', {className: 'name'}, item.passive.id),
						React.createElement('div', {className: 'desc', dangerouslySetInnerHTML:{__html:item.passive.desc} }),
					]),
					
					React.createElement('div', {className: 'skSelection modeSk'}, [
						React.createElement('div', {className: 'relative'}, [React.createElement('div', {className: 'ring'})].concat(MemberDetailView.eles.map(this.createSkCellItemElement))),
					]),
					React.createElement(MemberDetailView.SkDescView, {ref:'skDesc'}),
					
					React.createElement('div', {className: 'skIcon modeIcon modeMain'}, [
						React.createElement('div', {className: 'relative'}, MemberDetailView.eles.map(this.createSkCellItemElement)),
					]),
					React.createElement('div', {className: 'mainIcon modeIcon modeSk'}, [
						React.createElement('img', {src: Chara.imgPath+(item ? item.img : Chara.imgEmpty)}),
					]),
					React.createElement('div', {className: 'memberName modeMain modeSk'}, item.name),
					React.createElement('div', {className: 'back modeMain modeSk'}, '＜'),
				])
			])
		);
		
	},
	
	componentDidMount: function() {
		var node = this.getDOMNode();
		
		node.querySelector('.back').addEventListener('click', this.onBackClick);
		node.querySelector('.skIcon').addEventListener('click', this.onSkIconClick);
		node.querySelector('.mainIcon').addEventListener('click', this.onMainIconClick);
		
		var nodes = node.querySelectorAll('.skSelection .cell');
		for(var i=0;i<nodes.length;++i) {
			nodes[i].addEventListener('click', this.onSkCellClick);
			nodes[i].skIndex = i;
		}
	},
	componentWillUnmount: function() {
		var node = this.getDOMNode();
		
		node.querySelector('.back').removeEventListener('click', this.onBackClick);
		node.querySelector('.skIcon').removeEventListener('click', this.onSkIconClick);
		node.querySelector('.mainIcon').removeEventListener('click', this.onMainIconClick);
		
		var nodes = node.querySelectorAll('.skSelection .cell');
		for(var i=0;i<nodes.length;++i) {
			nodes[i].removeEventListener('click', this.onSkCellClick);
		}
	},
	
	createAttrItemElement: function(item) {
		return React.createElement('li', {}, [
			React.createElement('span', {className:'name'}, item.display),
			React.createElement('span', {className:'value'}, this.props.item.attrs[item.key] || 0),
		]);
	},
	
	createSkCellItemElement: function(item) {
		var cn = 'cellWrapper' + ' ele_'+item[0]+item[1] + (item[0]==item[1] ? ' corner' : '');
		
		var sel = item[0]*Skill.cntEleType + item[1];
		var sk = this.props.item.skSelections[sel];

		var innerCn = 'cell' + (sk ? ' ele_'+sk.ele : '');
		
		return (
			React.createElement('div', {className: cn}, [
				React.createElement('div', {className: innerCn}, sk.id||''),
			])
		);
	},

	
	onBackClick: function(e) {
		MainView.goBack();
	},
	onSkIconClick: function(e) {
		this.setState({'mode':'sk'});
	},
	onMainIconClick: function(e) {
		this.setState({'mode':'main'});
	},
	onSkCellClick: function(e) {
		var desc = {};
		
		var ele = MemberDetailView.eles[e.target.skIndex];
		var sel = ele[0]*Skill.cntEleType + ele[1];
		
		var sk = this.props.item.skSelections[sel];
		desc.id = sk.id;
		desc.lv = sk.lv;
		desc.exLv = (ele[0]==ele[1]?1:0);
		desc.desc = sk.getDesc(sk.lv+desc.exLv);
		
		this.refs.skDesc.setState({'item':desc});
	},
	
});

MemberDetailView.eles = [
	[0,0],[1,1],[2,2],[0,1],[1,2],[2,0],
];


MemberDetailView.SkDescView = React.createClass({
	getInitialState: function() {
		return {'item':null};
	},
	
	render: function() {
		var item = this.state.item;

		var children = [];
		
		if(item) {
Util.log(item);
			var rankCn = 'rank' + (item.exLv ? ' isEx' : '');
			var moreItems = [];
			for(var i=0;i<item.desc.details.length;++i) {
				var detail = item.desc.details[i];
				moreItems.push(React.createElement('dt', {}, detail.title||''));
				moreItems.push(React.createElement('dd', {}, detail.value||''));
			}
			
			children = [
				React.createElement('div', {className:'name'}, item.id||''),
				React.createElement('div', {className:rankCn}, item.lv||''),
				React.createElement('div', {className:'desc'}, [
					React.createElement('div', {className:'content', dangerouslySetInnerHTML:{__html:item.desc.content} }),
					React.createElement('dl', {className:'more'}, moreItems),
				]),
			];
		}
		
		return (
			React.createElement('div', {className:'skDesc modeSk'}, children)
		);
		
	},
	
	componentDidMount: function() {
		//this.refresh();
	},
	
	refresh: function() {
		if(!this.isMounted()) {
			return;
		}
		
		var item = this.state.item;
		if(!item) {
			return;
		}
		
		var node = this.getDOMNode();
		
		node.querySelector('.desc .content').innerHTML = item.desc.content;
	},
});