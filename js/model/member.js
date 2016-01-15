Member = function() {
};
SerializableMap.init(Member);

Member.template = {
	type:'object',
	itemTemplate:[
		{name:'id', type:'int'},
		{name:'charaId', type:'int'},
		{name:'lv', type:'int'},
		{name:'exp', type:'int'},
		{name:'skLvs', type:'list', itemTemplate:{type:'int'}},
		{name:'skPoss', type:'list', itemTemplate:{type:'int'}},
		{name:'passiveLv', type:'int'},
	],
};

Member.posPairs = [0,3,6,1,4,7,2,5,8];

Member.prototype.onCreated = function() {
	var chara = Chara.getItem(this.charaId);
//Util.log(chara);
	if(!chara) {
		return;
	}
	
	this.chara = chara;
	
	this.name = chara.name;
	this.img = chara.img;
	this.attrs = {};
	for(var i=0;i<Chara.attrInfos.length;++i) {
		var info = Chara.attrInfos[i];
		this.attrs[info.key] = (chara.attrs[i]||0) * this.lv;
	}
	
	this.passive = chara.passive.clone();
	this.passive.lv = this.passiveLv;
	
	this.skills = [];

	for(var i=0;i<chara.skills.length;++i) {
		this.skills[i] = chara.skills[i].clone();
		this.skills[i].lv = this.skLvs[i];
		this.skills[i].ele = chara.skEles[i];
	}

	this.skSelections = [];
	for(var i=0;i<this.skPoss.length;++i) {
		var p = this.skPoss[i];
		if(p < 0) {
			continue;
		}
		this.skSelections[p] = this.skills[i];
		this.skSelections[Member.posPairs[p]] = this.skills[i];
	}
};



Member.initData = [
	[110,1,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1],
	[120,2,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1],
	[130,3,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1],
	[140,4,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1],
	[150,5,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1],
	[160,6,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1],
	[170,7,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1],
	[180,8,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1],
	[190,9,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1],
	/*
	[210,11,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1],
	[220,12,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1],
	[230,13,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1],
	[240,14,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1],
	[250,15,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1],
	[260,16,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1],
	*/
];

Member.loadData = function() {
	var data = localStorage.getItem('members');
	data = data ? JSON.parse(data) : Member.initData;
	Member.postItems(data);
};
Member.storeData = function() {
	var data = Serializer.serialize(this.items(), {type:'list', itemTemplate:Member.template});
	localStorage.setItem('members', data);
};

Member.loadData();
