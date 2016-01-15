Statu = function() {
};
SerializableMap.init(Statu);

Statu.template = {
	type:'object',
	itemTemplate:[
		{name:'id', type:'string'},
		{name:'type', type:'string'},
		{name:'defaultIntensity', type:'int'},
		{name:'defaultDuration', type:'int'},
		{name:'effects', type:'list', itemTemplate:Effect.template},
		{name:'desc', type:'object', itemTemplate:[
			{name:'title', type:'string'},
			{name:'value', type:'string'},
		]},
	],
};

Statu.prototype.onCreated = function() {
	for(var i=0;i<this.effects.length;++i) {
		this.effects[i] = new Effect(this.effects[i]);
	}
};

Statu.prototype.getDesc = function() {
	return this.desc;
};


Statu.postItems([
	['強回','buff',144,1,[['md',[0,'hel%',[0],[1]]]],['強回 N:T','T回合內，回復倍率上升N%。']],
	['強防','buff',144,1,[['md',[0,'def%',[0],[1]]]],['強防 N:T','T回合內，防禦倍率上升N%。']],
	['強攻','buff', 72,1,[['md',[0,'atk%',[0],[1]]]],['強攻 N:T','T回合內，攻擊倍率上升N%。']],

	['回復','buff', 24,1,[['xa',['HpGain','hel',[0,1],[100,0]]]],['回復 N:T','T回合內，每回合生命值回復(回復力×N)']],
	
	['吮命','buff',100,1,[['md',[0,'drain%',[0],[1]]]],['吮命 N:T','T回合內，普通攻擊造成傷害時生命值回復(傷害值×N%)。']],
	['連擊','buff',  1,1,[['md',[0,'atkCnt',[0],[1]]]],['連擊 N:T','T回合內，普通攻擊次數增加N次。']],
	['擴散','buff',  1,1,[['md',[0,'atkRange',[0],[1]]]],['擴散 N:T','T回合內，普通攻擊變成全體攻擊。']],
	
	['輕減','buff',150,1,[['md',[0,'輕減%',[0],[1]]]],['輕減 N:T','T回合內，受到普通攻擊時傷害值減少N%。']],
	['障壁','buff', 75,1,[['md',[0,'障壁%',[0],[1]]]],['障壁 N:T','T回合內，受到普通攻擊時對方的攻擊倍率下降N%。']],
	['反射','buff', 75,1,[['md',[0,'反射%',[0],[1]]]],['反射 N:T','T回合內，受到普通攻擊時對方的生命值減少(其攻擊力×N%)。']],
	
	['遲緩','debuff',300,1,[['md',[0,'spd%',[0],[-1]]]],['遲緩 N:T','T回合內，行動頻率下降N%。']],
	['中毒','debuff', 24,1,[['xa',['HpLose','hp',[0,1],[1,0]]]],['中毒 N:T','T回合內，每回合生命值減少(生命上限×N%)']],
	['破甲','debuff',300,1,[['md',[0,'def%',[0],[-1]]]],['破甲 N:T','T回合內，防禦倍率下降N%。']],
]);
