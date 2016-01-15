Supporter = function() {
};
SerializableMap.init(Supporter);

Supporter.template = {
	type:'object',
	itemTemplate:[
		{name:'id', type:'int'},
		{name:'uid', type:'int'},
		{name:'memberArgs', type:'object', itemTemplate:Member.template.itemTemplate},
	],
};

Supporter.prototype.onCreated = function() {
	this.member = new Member();
	for(var k in this.memberArgs) {
		this.member[k] = this.memberArgs[k];
	}
	
	this.member.onCreated();
};

Supporter.postItems([
	[ 210,0,[ 210,21,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1]],
	[ 220,0,[ 220,22,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1]],
	[ 230,0,[ 230,23,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1]],
	[1140,0,[1140,14,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1]],
	[1150,0,[1150,15,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1]],
	[1160,0,[1160,16,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1]],
	[1110,0,[1110,11,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1]],
	[1120,0,[1120,12,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1]],
	[1130,0,[1130,13,1,0,[1,1,1,1,1,1],[0,4,8,1,5,6],1]],
]);
