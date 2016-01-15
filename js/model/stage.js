Stage = function() {
};
SerializableMap.init(Stage);

Stage.template = {
	type:'object',
	itemTemplate:[
		{name:'id', type:'int'},
		{name:'name', type:'string'},
		{name:'lv', type:'float'},
		{name:'cntFloor', type:'int'},
		{name:'cntEnemy', type:'object', itemTemplate:[
			{name:'init', type:'int'},
			{name:'inc', type:'int'},
		]},
	],
};

Stage.prototype.onCreated = function() {
};

Stage.postItems([
	[1,'訓練場'  ,5,4,[1,2]],
	[2,'第一洞窟',10,16,[2,2]],
	[3,'第二洞窟',12,32,[3,2]],
]);
