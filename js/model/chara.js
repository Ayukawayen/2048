﻿Chara = function() {
};
SerializableMap.init(Chara);

Chara.template = {
	type:'object',
	itemTemplate:[
		{name:'id', type:'int'},
		{name:'name', type:'string'},
		{name:'img', type:'string'},
		{name:'attrs', type:'list', itemTemplate:{type:'int'}},
		{name:'skIds', type:'list', itemTemplate:{type:'string'}},
		{name:'skEles', type:'list', itemTemplate:{type:'int'}},
		{name:'passiveId', type:'string'},
	],
};

Chara.prototype.onCreated = function() {
//Util.log(this);
	this.skills = [];
	for(var i=0;i<this.skIds.length;++i) {
		this.skills[i] = Skill.getItem(this.skIds[i]);
	}
	
	this.passive = Passive.getItem(this.passiveId);
};

Chara.attrInfos = [
	{'key':'hp',  'display':'生命力'},
	{'key':'atk', 'display':'攻擊力'},
	{'key':'def', 'display':'防禦力'},
	{'key':'hel', 'display':'回復力'},
];
Chara.attrDisplays = {};
Chara.attrInfos.forEach(function(item){Chara.attrDisplays[item.key] = item.display;});

Chara.imgPath = 'image/face/';
Chara.imgLPath = 'image/face_256/';
Chara.imgEmpty = 'empty.png';

Chara.postItems([
	[1,'紅色冒險者',	 '1r.png',[50,58,168,21],['回復強化．四','防禦強化．三','攻擊強化．二','防回強化．三','攻防強化．四','回攻強化．二',],[0,1,2,0,1,2,],'攻擊態勢'],
	[2,'綠色冒險者',	 '1g.png',[50,46,264,21],['回復強化．三','防禦強化．二','攻擊強化．四','防回強化．四','攻防強化．二','回攻強化．三',],[0,1,2,0,1,2,],'防禦態勢'],
	[3,'藍色冒險者',	 '1b.png',[50,46,168,33],['回復強化．二','防禦強化．四','攻擊強化．三','防回強化．二','攻防強化．三','回攻強化．四',],[0,1,2,0,1,2,],'回復態勢'],
	[4,'法師',			  '4.png',[50,60,136,23],['回復強化．四','防禦強化．三','攻擊強化．二','全體攻擊．三','全體攻擊．四','全體攻擊．二',],[0,1,2,0,1,2,],'攻擊連鎖．四'],
	[5,'戰士',			  '5.png',[50,48,280,17],['回復強化．三','防禦強化．二','攻擊強化．四','單體攻擊．四','單體攻擊．二','單體攻擊．三',],[0,1,2,0,1,2,],'防禦連鎖．二'],
	[6,'牧師',			  '6.png',[50,42,184,35],['回復強化．二','防禦強化．四','攻擊強化．三','累積回復．二','累積回復．三','累積回復．四',],[0,1,2,0,1,2,],'回復連鎖．三'],
	[7,'刺客',			  '7.png',[50,60,184,17],['冰霜之刺'  ,'毒蔓之刺'  ,'熾燄之刺'  ,'防回強化．三','攻防強化．四','回攻強化．二',],[0,1,2,0,1,2,],'夾擊態勢．二'],
	[8,'護衛',			  '8.png',[50,42,280,23],['漩渦護盾'  ,'樹木護盾'  ,'火炎護盾'  ,'防回強化．四','攻防強化．二','回攻強化．三',],[0,1,2,0,1,2,],'警戒態勢．零'],
	[9,'神官',			  '9.png',[50,48,136,35],['流水之加持','疾風之加持','爆炎之加持','防回強化．二','攻防強化．三','回攻強化．四',],[0,1,2,0,1,2,],'休養態勢．二'],
	
	[11,'黃之魔導士',	'11y.png',[50,54,232,17],['累積回復．三','單體攻擊．三','全體攻擊．三','蒼木之靈藥','火炎護盾'  ,'蒼炎之靈藥',],[0,1,2,1,2,2,],'夾擊態勢．二'],
	[12,'青之魔導士',	'11c.png',[50,42,232,29],['累積回復．三','單體攻擊．三','全體攻擊．三','毒蔓之刺'  ,'緋木之風暴','緋冰之風暴',],[0,1,2,1,1,0,],'警戒態勢．零'],
	[13,'紫之魔導士',	'11m.png',[50,54,136,29],['累積回復．三','單體攻擊．三','全體攻擊．三','碧冰之魔矢','碧炎之魔矢','流水之加持',],[0,1,2,0,2,0,],'休養態勢．二'],
	
	[14,'紅之魔導士',	'11r.png',[50,66,136,17],['回復強化．三','防禦強化．三','爆炎之加持'  ,'防回強化．三','碧炎之風暴'  ,'蒼炎之風暴'  ,],[0,1,2,0,2,2,],'攻擊連鎖．四'],
	[15,'綠之魔導士',	'11g.png',[50,42,328,17],['回復強化．三','樹木護盾'    ,'攻擊強化．三','蒼木之魔矢'  ,'緋木之魔矢'  ,'回攻強化．三',],[0,1,2,1,1,2,],'防禦連鎖．二'],
	[16,'藍之魔導士',	'11b.png',[50,42,136,41],['冰霜之刺'    ,'防禦強化．三','攻擊強化．三','碧冰之靈藥'  ,'攻防強化．三','緋冰之靈藥'  ,],[0,1,2,0,1,0,],'回復連鎖．三'],

	[21,'紅之領主',		'21r.png',[50,66,136,17],['回復強化．三','防禦強化．三','爆炎之加持'  ,'防回強化．三','火炎護盾'    ,'熾燄之刺'    ,],[0,1,2,0,2,2,],'紅之力'],
	[22,'綠之領主',		'21g.png',[50,42,328,17],['回復強化．三','樹木護盾'    ,'攻擊強化．三','毒蔓之刺'    ,'疾風之加持'  ,'回攻強化．三',],[0,1,2,1,1,2,],'綠之力'],
	[23,'藍之領主',		'21b.png',[50,42,136,41],['冰霜之刺'    ,'防禦強化．三','攻擊強化．三','漩渦護盾'    ,'攻防強化．三','流水之加持'  ,],[0,1,2,0,1,0,],'藍之力'],
	
	[31,'前鋒',			 '31.png',[50,66,136,17],['累積回復．三','單體攻擊．三','全體攻擊．三','防回強化．三','攻防強化．三','回攻強化．三',],[0,1,2,0,1,2,],'攻擊態勢．上'],
	[32,'後衛',			 '32.png',[50,42,232,29],['累積回復．三','單體攻擊．三','全體攻擊．三','防回強化．三','攻防強化．三','回攻強化．三',],[0,1,2,0,1,2,],'防禦態勢．下'],
	[33,'左鋒',			 '31.png',[50,48,136,35],['累積回復．三','單體攻擊．三','全體攻擊．三','防回強化．三','攻防強化．三','回攻強化．三',],[0,1,2,0,1,2,],'攻擊態勢．左'],
	[34,'右衛',			 '32.png',[50,48,280,17],['累積回復．三','單體攻擊．三','全體攻擊．三','防回強化．三','攻防強化．三','回攻強化．三',],[0,1,2,0,1,2,],'防禦態勢．右'],
]);
