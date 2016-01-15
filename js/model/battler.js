Battler = function(battle, args) {
	this.battle = battle;
	
	args = args||{};
	
	this.hp = args.hp||0;
	this.hpMax = args.hp||0;
	this.atk = args.atk||0;
	this.def = args.def||0;
	this.hel = args.hel||0;
	
	this.passives = [];
	this.skSelections = [];
	
	this.status = {};
	this.modifiers = {};
	this.xActions = {};
};

Battler.Statu = function(){};
Battler.Statu.template = {
	type:'object',
	itemTemplate:[
		{name:'id', type:'string'},
		{name:'type', type:'string'},
		{name:'intensity', type:'int'},
		{name:'duration', type:'int'},
	],
};

Enemy = function(battle, args) {
	var battler = new Battler(battle, args);
	battler.img = args.img;
	battler.cnt = 1;
	battler.ap = 0;
	
	return battler;
};

Enemy.template = {
	type:'object',
	itemTemplate:[
		{name:'img', type:'string'},
		{name:'cnt', type:'int'},
		{name:'hp', type:'int'},
		{name:'hpMax', type:'int'},
		{name:'atk', type:'int'},
		{name:'def', type:'int'},
		{name:'hel', type:'int'},
		{name:'ap', type:'int'},
		{name:'status', type:'map', itemTemplate:Battler.Statu.template},
	],
};

Enemy.unwrap = function(battle, args) {
	var item = new Enemy(battle, {});
	
	for(var k in args) {
		item[k] = args[k];
	}
	
	return item;
};


Ally = function(battle, memberIds, supId) {
	var battler = new Battler(battle);
	battler.getModifiedAtk = Ally.prototype.getModifiedAtk;
	
	battler.imgs = [];
	battler.atks = [];
	
	battler.memberIds = memberIds;
	battler.supId = supId;
	
	var members = [];
	for(var i=0;i<memberIds.length;++i) {
		members.push(Member.getItem(memberIds[i]));
	}
	var sup = Supporter.getItem(supId);
	members.push(sup ? sup.member : null);
	
	for(var i=0;i<members.length;++i) {
		var member = members[i];
//Util.log(member);
		if(!member) {
			battler.imgs[i] = Chara.imgEmpty;
			continue;
		}

		battler.imgs[i] = member.img;
		
		for(var k in member.attrs) {
			battler[k] += member.attrs[k];
		}
		battler.atks.push(member.attrs.atk);
		
		battler.passives.push(member.passive);
		
		for(var si=0;si<member.skSelections.length;++si) {
			battler.skSelections[si] = battler.skSelections[si] || [];
			battler.skSelections[si].push(member.skSelections[si]);
		}
	}
	
	battler.hp *= 2048;
	battler.hpMax = battler.hp;
	
	return battler;
};


Ally.template = {
	type:'object',
	itemTemplate:[
		{name:'memberIds', type:'list', itemTemplate:'int'},
		{name:'supId', type:'int'},
		{name:'hp', type:'int'},
		{name:'status', type:'map', itemTemplate:Battler.Statu.template},
	],
};

Ally.unwrap = function(battle, args) {
	var item = new Ally(battle, args.memberIds, args.supId);
	
	for(var k in args) {
		item[k] = args[k];
	}
	
	return item;
};

Battler.prototype.isAlive = function() {
	return this.hp > 0;
};

Battler.prototype.getModifier = function(key) {
	return this.modifiers[key]||0;
}

Battler.prototype.getModifiedAtk = function() {
	var value = this.atk + this.getModifier('atk');
	value *= 1+(this.getModifier('atk%')/100);
	return value;
};
Ally.prototype.getModifiedAtk = function(i) {
	var value = this.atks[i] + this.getModifier('atk');
	value *= 1+(this.getModifier('atk%')/100);
	return value;
};

Battler.prototype.getModifiedDef = function() {
	var value = this.def + this.getModifier('def');
	value *= 1+(this.getModifier('def%')/100);
	return value;
};
Battler.prototype.getModifiedHel = function() {
	var value = this.hel + this.getModifier('hel');
	value *= 1+(this.getModifier('hel%')/100);
	return value;
};

Battler.prototype.postHp = function(value) {
	if(!this.isAlive()) {
		return;
	}
	
	this.hp += Math.round(value);
	this.hp = Math.max(0, Math.min(this.hpMax, this.hp));
};

Battler.prototype.onHeal = function(value) {
Util.log('onHeal '+value);
	value = Math.max(0, Math.round(value));
	this.postHp(value);
	return value;
};
Battler.prototype.onAttack = function(value) {
Util.log('onAttack '+value+' vs '+this.getModifiedDef());
	value -= this.getModifiedDef();
	value *= 1 - this.getModifier('障壁%')/100;
	value = Math.max(1, value);
	value *= 1 - this.getModifier('輕減%')/100;
	this.postHp(value * -1);
	return value;
};

Battler.prototype.onStatuStep = function() {
	for(var k in this.status) {
		if(this.status[k].duration <= 0) {
			continue;
		}
		this.status[k].duration -= 1;
		
		var effects = Statu.getItem(k).effects;
		for(var ei=0;ei<effects.length;++ei) {
			this.postEffect(effects[ei], this.status[k].intensity);
		}
	}
};

Battler.prototype.onCleanStep = function() {
	this.modifiers = {};
	this.xActions = {};
};

Battler.prototype.postEffect = function(effect, lv) {
	if(effect.type == 'st') { this.postStEffect(effect, lv); }
	if(effect.type == 'md') { this.postMdEffect(effect, lv); }
	if(effect.type == 'xa') { this.postXaEffect(effect, lv); }
	if(effect.type == 'tr') { this.postTrEffect(effect, lv); }
};

Battler.prototype.postStEffect = function(effect, lv) {
	var id = effect.stId;
	var statu = Statu.getItem(id);
	var intensity = statu.defaultIntensity / effect.durationWeight;
	intensity *= effect.init.i + effect.lv.i * lv;
	var duration = statu.defaultDuration * effect.durationWeight;
	duration *= effect.init.d + effect.lv.d * lv;

	var battlers = this.battle.getTargetBattlers(effect.target, this);

	for(var bi=0;bi<battlers.length;++bi) {
		var battler = battlers[bi];
		battler.status[id] = battler.status[id] || {'id':id, 'type':statu.type, 'intensity':0, 'duration':0};
		battler.status[id].intensity = Math.max(battler.status[id].intensity, intensity);
		battler.status[id].duration = Math.max(battler.status[id].duration, duration);
	}
};

Battler.prototype.postMdEffect = function(effect, lv) {
	var key = effect.key;
	var value = effect.init.v + effect.lv.v * lv;
	
	var battlers = this.battle.getTargetBattlers(effect.target, this);
	for(var bi=0;bi<battlers.length;++bi) {
		var battler = battlers[bi];
		battler.modifiers[key] = battler.modifiers[key] || 0;
		battler.modifiers[key] += value;
	}
};

Battler.prototype.postXaEffect = function(effect, lv) {
//Util.log(effect);
	var id = effect.xaId;
	this.xActions[id] = this.xActions[id] || [];
	var value = effect.ref==1 ? 1 : (this[effect.ref]||0)/100;
	value *= (effect.init.i + effect.lv.i * lv);
	this.xActions[id].push({
		'value':value,
		'count':effect.init.c + effect.lv.c * lv,
	});
};

Battler.prototype.postTrEffect = function(effect, lv) {
	this.battle.board.transElement(effect.from, effect.to);
};
