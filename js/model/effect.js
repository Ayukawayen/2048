Effect = function(args) {
	for(var k in args) {
		this[k] = args[k];
	}
	
	var subArgs = Serializer.unwrap(args.args, Effect.subTemplates[args.type]);

	for(var k in subArgs) {
		this[k] = subArgs[k];
	}
};

Effect.template = {
	type:'object',
	itemTemplate:[
		{name:'type', type:'string'},
		{name:'args', type:''},
	],
};

Effect.descTargets = {
	0:'隊伍',
	0x110:'敵單體',
	0x120:'敵全體',
};
Effect.xaInfos = {
	'單攻':{a:'單體攻擊', i:'強度'},
	'全攻':{a:'全體攻擊', i:'強度'},
	'單回':{a:'單體回復', i:'強度'},
	'HpGain':{a:'生命值上升', i:'值'},
	'HpLose':{a:'生命值下降', i:'值'},
};

Effect.prototype.getDesc = function(lv) {
	var content=''
	var details=[];
	if(this.type == 'st') {
		var statu = Statu.getItem(this.stId);

		content += Effect.descTargets[this.target] + '得到';
		
		var intensity = statu.defaultIntensity / this.durationWeight;
		intensity *= this.init.i + this.lv.i*lv;
		intensity = Math.round(intensity);
		var duration = statu.defaultDuration * this.durationWeight;
		duration *= this.init.d + this.lv.d*lv;
		duration = Math.round(duration);
		
		content += `<dfn class='statu'><span class='name'>${statu.id}</span><span class='intensity'>${intensity}</span><span class='duration'>${duration}</span></dfn>`;
		content += '。';
		
		details.push(statu.getDesc());
	}
	if(this.type == 'md') {
		content += Effect.descTargets[this.target] + '的';
		content += this.key;
		var v = Math.round(this.init.v + this.lv.v*lv);
		if(v >= 0) {
			content += '上升' + v + '%';
		}
		else {
			content += '下降' + Math.round(v*-1) + '%';
		}
	}
	if(this.type == 'xa') {
		var intensity = Math.round(this.init.i + this.lv.i*lv);
		var count = Math.round(this.init.c + this.lv.c*lv);
		var ref = Chara.attrDisplays[this.ref];
		
		var v = ref ? `${ref}×${intensity}%`: Math.round(intensity/100);
		var info = Effect.xaInfos[this.xaId] || {a:'????', i:'強度'};
		content += `進行${count}次${info.a}，${info.i}等於${v}。`;
	}
	if(this.type == 'tr') {
		content += `<span class='element ele_${this.from}'></span>轉<span class='element ele_${this.to}'></span>。`;
	}
	return {'content':content, 'details':details};
};


Effect.subTemplates = {};

Effect.subTemplates.md = {
	type:'object',
	itemTemplate:[
		{name:'target', type:'int'},
		{name:'key', type:'string'},
		{name:'init', type:'object', itemTemplate:[
			{name:'v', type:'float'},
		]},
		{name:'lv', type:'object', itemTemplate:[
			{name:'v', type:'float'},
		]},
	],
};

Effect.subTemplates.xa = {
	type:'object',
	itemTemplate:[
		{name:'xaId', type:'string'},
		{name:'ref', type:'string'},
		{name:'init', type:'object', itemTemplate:[
			{name:'i', type:'float'},
			{name:'c', type:'int'},
		]},
		{name:'lv', type:'object', itemTemplate:[
			{name:'i', type:'float'},
			{name:'c', type:'int'},
		]},
	],
};

Effect.subTemplates.st = {
	type:'object',
	itemTemplate:[
		{name:'stId', type:'string'},
		{name:'target', type:'int'},
		{name:'durationWeight', type:'float'},
		{name:'init', type:'object', itemTemplate:[
			{name:'i', type:'float'},
			{name:'d', type:'int'},
		]},
		{name:'lv', type:'object', itemTemplate:[
			{name:'i', type:'float'},
			{name:'d', type:'int'},
		]},
	],
};

Effect.subTemplates.tr = {
	type:'object',
	itemTemplate:[
		{name:'from', type:'int'},
		{name:'to', type:'int'},
	],
};
