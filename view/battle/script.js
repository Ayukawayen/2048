var BattleView = React.createClass({
	displayName: 'battle',

	getInitialState: function() {
		return {'battle':null,'board':null,'isLose':false,'isClear':false};
	},
	
	render: function() {
		if(!this.board) {
			this.board = new BattleBoard();
			this.board.addOnMovedListener(this.onMoved);
		}
		if(!this.battle) {
			this.battle = new Battle(this.board);
		}
		
		this.state.isLose = this.battle.isLose;
		
		return (
			React.createElement('div', this.props, [
				React.createElement('div', {className:'relative'}, [
					React.createElement(BattleView.FieldView, {battle:this.battle, state:this.state}),
					React.createElement(BattleView.PartyView, {battle:this.battle}),
					React.createElement(BattleBoardView, {board:this.board}),
					React.createElement(BasicComponent, {tagName:'div', props:{className:'back'}, eventListener:{'click':this.onBackClick}, children:[
						React.createElement('span', {}, '＜'),
					]}),
				])
			])
		);
		
	},
	
	statics: {
		isFullScreen: true,
	},
	
	onBackClick: function(e) {
		MainView.setContentView(StageMainView);
		
		this.battle.postLogs(true);
		
		this.board.clearData();
		this.battle.clearData();
	},
	
	onMoved: function(move) {
//Util.log('onMoved');
		this.battle.onMoved(move);
		
		this.setState({});
		
		if(this.board.isGameOver()) {
			var self = this;
			setTimeout(function(){
				self.board.reset();
				self.setState({});
			}, 4000);
		}
		if(!this.isContinue && this.battle.isClear) {
			this.setState({isClear:true});
			var self = this;
			setTimeout(function(){
				self.isContinue = true;
				self.state.isClear = false;
			}, 1000);
		}
	},
});

BattleView.FieldView = React.createClass({
	render: function() {
		var battle = this.props.battle;

		var cn = 'field'
			+ (battle.cntMove%2 ? ' odd' : ' even')
			+ (this.props.state.isLose ? ' lose' : '')
			+ (this.props.state.isClear ? ' clear' : '')
		;
		var isMaskShow = this.props.state.isLose || this.props.state.isClear;
		
		var allys = battle ? battle.ally.imgs : [];
		var enemys = battle ? battle.enemys : [];
		
		return (
			React.createElement('div', {className:cn}, [
				React.createElement('div', {className:'relative'}, [
					React.createElement('div', {className:'allyList'}, allys.map(this.createAllyElement)),
					React.createElement('div', {className:'enemyList'}, enemys.map(this.createEnemyElement)),
					React.createElement('div', {className:`combo v_${battle.combo}`}, [
						React.createElement('span', {className:'value'}, battle.combo),
						React.createElement('span', {className:'text'}, 'Combo'),
					]),
					React.createElement('div', {className:`hit v_${battle.chain}`}, [
						React.createElement('span', {className:'value'}, battle.chain),
						React.createElement('span', {className:'text'}, (battle.chain<=1 ? 'Hit' : 'Hits')),
					]),
					React.createElement('div', {className:'sk'}, [
						React.createElement('img', {className:'member'}),
						React.createElement('span', {className:'element'}),
						React.createElement('span', {className:'element'}),
						React.createElement('span', {className:'name'}),
					]),
					React.createElement('div', {className:'stat'}, [
						React.createElement('div', {className:'relative'}, [
							React.createElement('div', {className:'floor'}, (battle.floor+1)+' F'),
							React.createElement('div', {className:'score'}, battle.score.toLocaleString()),
						]),
					]),
					React.createElement('img', {className:'displayNone', src:Chara.imgPath+(battle.nextEnemyImg || Chara.imgEmpty)}),
					React.createElement('div', {className:'mask'+(isMaskShow ? ' show' : '')}),
				])
			])
		);
	},
	
	componentDidMount: function() {
		this.cntSkTicked = 0;
		this.skActivateds = {t:-1, items:[]};
		//this.timerSk = setInterval(this.onSkTick, 1250);
	},
	componentWillUnmount: function() {
		if(this.timerSk) {
			clearInterval(this.timerSk);
		}
	},
	
	createAllyElement: function(item) {
		return (
			React.createElement('div', {className:'ally'}, [
				React.createElement('img', {className:'img', src:Chara.imgPath+item}),
			])
		);
	},
	createEnemyElement: function(item) {
		var width = Math.round(item.hpMax==0 ? 0 : (item.hp/item.hpMax*100));
		width = Math.max(0, Math.min(100, width));
		
		var cn = 'enemy' + ' cnt_'+item.cnt + (item.isAlive()?'':' alive_false');
		
		return (
			React.createElement('div', {className:cn}, [
				React.createElement('img', {className:'img', src:Chara.imgPath+(item ? item.img : Chara.imgEmpty)}),
				React.createElement('div', {className:'hp bar'}, [
					React.createElement('div', {className:'barValue', style:{'width':width+'%'}})
				]),
			])
		);
	},
	
	onSkTick: function() {
		var battle = this.props.battle;
		
		if((this.skActivateds.t != battle.skActivateds.t) && (battle.skActivateds.items.length > 0)) {
			this.skActivateds.t = battle.skActivateds.t;
			this.skActivateds.items = [];
			var sks = battle.skActivateds.items;
			for(var i=0;i<sks.length;++i) {
				this.skActivateds.items.push(sks[(i+this.cntSkTicked)%sks.length]);
			}
		}
		
		if(this.skActivateds.items.length <= 0) {
			return;
		}
		
		++this.cntSkTicked;
		
		var node = this.getDOMNode().querySelector('.sk');
		var sk = this.skActivateds.items.shift();
		
		document.querySelector('.view_battle .sk .member').setAttribute('src', Chara.imgPath+sk.memberImg);
		document.querySelectorAll('.view_battle .sk .element')[0].setAttribute('ele', sk.eles[0]);
		document.querySelectorAll('.view_battle .sk .element')[1].setAttribute('ele', sk.eles[1]);
		document.querySelector('.view_battle .sk .name').textContent = sk.name;
		
		document.querySelector('.view_battle .sk').setAttribute('n', this.cntSkTicked%2 ? 'odd' : 'even');
	},
});


BattleView.PartyView = React.createClass({
	render: function() {
		var item = this.props.battle.ally;

		var width = Math.round(item.hpMax==0 ? 0 : (item.hp/item.hpMax*100));
		width = Math.max(0, Math.min(100, width));
		
		var status = [];
		for(var key in item.status) {
			var statu = item.status[key];
			if(statu.duration <= 0) {
				continue;
			}
			status.push(statu);
		}
		status.sort(BattleView.PartyView.compStatu);
		
		return (
			React.createElement('div', {className:'party'}, [
				React.createElement('div', {className:'relative'}, [
					React.createElement('ul', {className:'partyStatuList'}, status.map(BattleView.PartyView.createStatuElement)),
					React.createElement('div', {className:'partyHp'}, [
						React.createElement('div', {className:'hp bar'}, [
							React.createElement('div', {className:'barValue', style:{'width':width+'%'}}),
							React.createElement('div', {className:'barText'}, item.hp+'/'+item.hpMax),
						]),
					]),
				])
			])
		);
	},
	
	statics: {
		compStatu: function(a, b) {
			return a.id<b.id ? -1 : 1;
		},
		
		createStatuElement: function(item) {
			return (
				React.createElement('li', {className:'type_'+item.type}, [
					React.createElement('span', {className:'name'}, item.id),
					React.createElement('span', {className:'intensity'}, item.intensity),
					React.createElement('span', {className:'duration'}, item.duration),
				])
			);
		},
	},
});
