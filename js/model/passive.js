Passive = function() {
};
SerializableMap.init(Passive);

Passive.template = {
	type:'object',
	itemTemplate:[
		{name:'id', type:'string'},
		{name:'conds', type:'list', itemTemplate:{
			type:'list', itemTemplate:{
				type:'object', itemTemplate:[
					{name:'type', type:'string'},
					{name:'args', type:''},
				],
			}
		}},
		{name:'effects', type:'list', itemTemplate:Effect.template},
		{name:'desc', type:'string'},
	],
};

Passive.Cond = {
	always: function(args){ for(var k in args) {this[k] = args[k];} },
	combo: function(args){ for(var k in args) {this[k] = args[k];} },
	chain: function(args){ for(var k in args) {this[k] = args[k];} },
	ele: function(args){ for(var k in args) {this[k] = args[k];} },
};


Passive.prototype.onCreated = function() {
	for(var i=0;i<this.effects.length;++i) {
		this.effects[i] = new Effect(this.effects[i]);
	}
	for(var i=0;i<this.conds.length;++i) {
console.log(this.conds[i]);
		for(var si=0;si<this.conds[i].length;++si) {
			var cond = this.conds[i][si];
			var cls = Passive.Cond[cond.type];
			this.conds[i][si] = new cls(Serializer.unwrap(cond.args, cls.template));
		}
	}
};

Passive.prototype.clone = function() {
	var item = new Passive();
	var templates = Passive.template.itemTemplate;
	for(var i=0;i<templates.length;++i) {
		item[templates[i].name] = this[templates[i].name];
	}
	return item;
};

Passive.prototype.validate = function(battle) {
	for(var i=0;i<this.conds.length;++i) {
		if(this.validateSub(this.conds[i], battle)) {
			return true;
		}
	}
	return false;
};
Passive.prototype.validateSub = function(conds, battle) {
	for(var i=0;i<conds.length;++i) {
		if(!conds[i].validate(battle)) {
			return false;
		}
	}
	return true;
};

Passive.Cond.always.template = {
	type:'object',
	itemTemplate:[
	],
};

Passive.Cond.always.prototype.validate = function(battle) {
	return true;
};


Passive.Cond.combo.template = {
	type:'object',
	itemTemplate:[
		{name:'op', type:'string'},
		{name:'value', type:'int'},
	],
};

Passive.Cond.combo.prototype.validate = function(battle) {
	if(this.op == '==') { return battle.move.mergeds.length == this.value; }
	if(this.op == '>=') { return battle.move.mergeds.length >= this.value; }
	if(this.op == '<=') { return battle.move.mergeds.length <= this.value; }
	if(this.op == '!=') { return battle.move.mergeds.length != this.value; }
	if(this.op == '>')  { return battle.move.mergeds.length >  this.value; }
	if(this.op == '<')  { return battle.move.mergeds.length <  this.value; }
};

Passive.Cond.chain.template = {
	type:'object',
	itemTemplate:[
		{name:'op', type:'string'},
		{name:'value', type:'int'},
	],
};

Passive.Cond.chain.prototype.validate = function(battle) {
	if(this.op == '==') { return battle.chain == this.value; }
	if(this.op == '>=') { return battle.chain >= this.value; }
	if(this.op == '<=') { return battle.chain <= this.value; }
	if(this.op == '!=') { return battle.chain != this.value; }
	if(this.op == '>')  { return battle.chain >  this.value; }
	if(this.op == '<')  { return battle.chain <  this.value; }
};


Passive.Cond.ele.template = {
	type:'object',
	itemTemplate:[
		{name:'patterns', type:'list', itemTemplate:'string'},
	],
};

Passive.Cond.ele.prototype.validate = function(battle) {
	var mgs = battle.move.mergeds;
	for(var i=0;i<mgs.length;++i) {
		for(var pi=0;pi<this.patterns.length;++pi) {
			var eles = this.patterns[pi].split('');
			
			if(eles[0]!='*' && eles[0]!=mgs[i].tiles[0].ele) { continue; }
			if(eles[1]!='*' && eles[1]!=mgs[i].tiles[1].ele) { continue; }
			
			return true;
		}
	}
	
	return false;
};


Passive.postItems([
	['回復態勢',[[['always',[]]]],[['md',[0,'hel%',[0],[100]]]],'隊伍的回復力上升100%。'],
	['防禦態勢',[[['always',[]]]],[['md',[0,'def%',[0],[100]]]],'隊伍的防禦力上升100%。'],
	['攻擊態勢',[[['always',[]]]],[['md',[0,'atk%',[0],[ 50]]]],'隊伍的攻擊力上升50%。'],
	
	['休養態勢．一',[[['combo',['<=',1]]]],[['md',[0,'hel%',[0],[340]]]],'1Combo或以下的回合，隊伍的回復倍率上升340%。'],
	['休養態勢．二',[[['combo',['<=',2]]]],[['md',[0,'hel%',[0],[160]]]],'2Combo或以下的回合，隊伍的回復倍率上升160%。'],
	['休養態勢．三',[[['combo',['<=',3]]]],[['md',[0,'hel%',[0],[130]]]],'3Combo或以下的回合，隊伍的回復倍率上升130%。'],
	['警戒態勢．零',[[['combo',['<=',0]]]],[['md',[0,'def%',[0],[300]]]],      '0Combo的回合，隊伍的防禦倍率上升300%。'],
	['警戒態勢．一',[[['combo',['<=',1]]]],[['md',[0,'def%',[0],[140]]]],'1Combo或以下的回合，隊伍的防禦倍率上升140%。'],
	['警戒態勢．二',[[['combo',['<=',2]]]],[['md',[0,'def%',[0],[125]]]],'2Combo或以下的回合，隊伍的防禦倍率上升125%。'],
	['蓄力態勢．一',[[['combo',['<=',1]]]],[['md',[0,'atk%',[0],[170]]]],'1Combo或以下的回合，隊伍的攻擊倍率上升170%。'],
	['蓄力態勢．二',[[['combo',['<=',2]]]],[['md',[0,'atk%',[0],[ 80]]]],'2Combo或以下的回合，隊伍的攻擊倍率上升80%。'],
	['蓄力態勢．三',[[['combo',['<=',3]]]],[['md',[0,'atk%',[0],[ 65]]]],'3Combo或以下的回合，隊伍的攻擊倍率上升65%。'],
	['治療態勢．二',[[['combo',['>=',2]]]],[['md',[0,'hel%',[0],[180]]]],'2Combo或以上的回合，隊伍的回復倍率上升180%。'],
	['治療態勢．三',[[['combo',['>=',3]]]],[['md',[0,'hel%',[0],[500]]]],'3Combo或以上的回合，隊伍的回復倍率上升500%。'],
	['聯防態勢．二',[[['combo',['>=',2]]]],[['md',[0,'def%',[0],[200]]]],'2Combo或以上的回合，隊伍的防禦倍率上升200%。'],
	['聯防態勢．三',[[['combo',['>=',3]]]],[['md',[0,'def%',[0],[760]]]],'3Combo或以上的回合，隊伍的防禦倍率上升760%。'],
	['夾擊態勢．二',[[['combo',['>=',2]]]],[['md',[0,'atk%',[0],[ 90]]]],'2Combo或以上的回合，隊伍的攻擊倍率上升90%。'],
	['夾擊態勢．三',[[['combo',['>=',3]]]],[['md',[0,'atk%',[0],[250]]]],'3Combo或以上的回合，隊伍的攻擊倍率上升250%。'],
	
	['回復連鎖．三',[[['chain',['>=', 3]]]],[['md',[0,'hel%',[0],[140]]]], '3Hits或以上的回合，隊伍的回復倍率上升140%。'],
	['回復連鎖．四',[[['chain',['>=', 4]]]],[['md',[0,'hel%',[0],[170]]]], '4Hits或以上的回合，隊伍的回復倍率上升170%。'],
	['回復連鎖．五',[[['chain',['>=', 5]]]],[['md',[0,'hel%',[0],[200]]]], '5Hits或以上的回合，隊伍的回復倍率上升200%。'],
	['回復連鎖．六',[[['chain',['>=', 6]]]],[['md',[0,'hel%',[0],[240]]]], '6Hits或以上的回合，隊伍的回復倍率上升240%。'],
	['回復連鎖．七',[[['chain',['>=', 7]]]],[['md',[0,'hel%',[0],[280]]]], '7Hits或以上的回合，隊伍的回復倍率上升280%。'],
	['回復連鎖．八',[[['chain',['>=', 8]]]],[['md',[0,'hel%',[0],[320]]]], '8Hits或以上的回合，隊伍的回復倍率上升320%。'],
	['回復連鎖．九',[[['chain',['>=', 9]]]],[['md',[0,'hel%',[0],[360]]]], '9Hits或以上的回合，隊伍的回復倍率上升360%。'],
	['回復連鎖．十',[[['chain',['>=',10]]]],[['md',[0,'hel%',[0],[400]]]],'10Hits或以上的回合，隊伍的回復倍率上升400%。'],
	['防禦連鎖．二',[[['chain',['>=', 2]]]],[['md',[0,'def%',[0],[250]]]], '2Hits或以上的回合，隊伍的防禦倍率上升250%。'],
	['防禦連鎖．三',[[['chain',['>=', 3]]]],[['md',[0,'def%',[0],[400]]]], '3Hits或以上的回合，隊伍的防禦倍率上升400%。'],
	['防禦連鎖．四',[[['chain',['>=', 4]]]],[['md',[0,'def%',[0],[550]]]], '4Hits或以上的回合，隊伍的防禦倍率上升550%。'],
	['攻擊連鎖．三',[[['chain',['>=', 3]]]],[['md',[0,'atk%',[0],[ 70]]]], '3Hits或以上的回合，隊伍的攻擊倍率上升70%。'],
	['攻擊連鎖．四',[[['chain',['>=', 4]]]],[['md',[0,'atk%',[0],[ 85]]]], '4Hits或以上的回合，隊伍的攻擊倍率上升85%。'],
	['攻擊連鎖．五',[[['chain',['>=', 5]]]],[['md',[0,'atk%',[0],[100]]]], '5Hits或以上的回合，隊伍的攻擊倍率上升100%。'],
	['攻擊連鎖．六',[[['chain',['>=', 6]]]],[['md',[0,'atk%',[0],[120]]]], '6Hits或以上的回合，隊伍的攻擊倍率上升120%。'],
	['攻擊連鎖．七',[[['chain',['>=', 7]]]],[['md',[0,'atk%',[0],[140]]]], '7Hits或以上的回合，隊伍的攻擊倍率上升140%。'],
	['攻擊連鎖．八',[[['chain',['>=', 8]]]],[['md',[0,'atk%',[0],[160]]]], '8Hits或以上的回合，隊伍的攻擊倍率上升160%。'],
	['攻擊連鎖．九',[[['chain',['>=', 9]]]],[['md',[0,'atk%',[0],[180]]]], '9Hits或以上的回合，隊伍的攻擊倍率上升180%。'],
	['攻擊連鎖．十',[[['chain',['>=',10]]]],[['md',[0,'atk%',[0],[200]]]],'10Hits或以上的回合，隊伍的攻擊倍率上升200%。'],
	
	['藍之力',[[['ele',[['0*','*0']]]]],[['st',['強攻',0,6,[1,0],[0,1]]],['st',['強防',0,6,[1,0],[0,1]]],['st',['強回',0,6,[1,0],[0,1]]]],'消除<span class="element ele_0"></span>的回合，隊伍得到<dfn class="statu"><span class="name">強攻</span><span class="intensity">12</span><span class="duration">6</span></dfn><dfn class="statu"><span class="name">強防</span><span class="intensity">24</span><span class="duration">6</span></dfn><dfn class="statu"><span class="name">強回</span><span class="intensity">24</span><span class="duration">6</span></dfn>。'],
	['綠之力',[[['ele',[['1*','*1']]]]],[['st',['強攻',0,6,[1,0],[0,1]]],['st',['強防',0,6,[1,0],[0,1]]],['st',['強回',0,6,[1,0],[0,1]]]],'消除<span class="element ele_1"></span>的回合，隊伍得到<dfn class="statu"><span class="name">強攻</span><span class="intensity">12</span><span class="duration">6</span></dfn><dfn class="statu"><span class="name">強防</span><span class="intensity">24</span><span class="duration">6</span></dfn><dfn class="statu"><span class="name">強回</span><span class="intensity">24</span><span class="duration">6</span></dfn>。'],
	['紅之力',[[['ele',[['2*','*2']]]]],[['st',['強攻',0,6,[1,0],[0,1]]],['st',['強防',0,6,[1,0],[0,1]]],['st',['強回',0,6,[1,0],[0,1]]]],'消除<span class="element ele_2"></span>的回合，隊伍得到<dfn class="statu"><span class="name">強攻</span><span class="intensity">12</span><span class="duration">6</span></dfn><dfn class="statu"><span class="name">強防</span><span class="intensity">24</span><span class="duration">6</span></dfn><dfn class="statu"><span class="name">強回</span><span class="intensity">24</span><span class="duration">6</span></dfn>。'],
]);
