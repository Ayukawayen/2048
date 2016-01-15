Party = function() {
};
SerializableMap.init(Party);

Party.template = {
	type:'object',
	itemTemplate:[
		{name:'id', type:'int'},
		{name:'memberIds', type:'list', itemTemplate:{type:'int'}},
		{name:'isOpened', type:'boolean'},
	],
};

Party.SizeMember = 3;


Party.prototype.onCreated = function() {
	this.members = [];
	this.attrs = {};
	
	for(var i=0;i<this.memberIds.length;++i) {
		var member = Member.getItem(this.memberIds[i]);
		if(!member) {
			continue;
		}
		
		this.members[i] = member;
		for(var k in member.attrs) {
			this.attrs[k] = (this.attrs[k]||0) + member.attrs[k];
		}
	}
};

Party.prototype.putMember = function(i, memberId) {
	var memberIds = this.memberIds;
	memberIds[i] = memberId;
	this.putMembers(memberIds);
};
Party.prototype.putMembers = function(memberIds) {
	this.memberIds = memberIds;
	this.onCreated();
	Party.putItem(this.id, Serializer.wrap(this, Party.template));
	Party.storeData();
};


Party.initData = [
	[0,[120,110,130],1],
];

Party.loadData = function() {
	var data = localStorage.getItem('partys');
	data = data ? JSON.parse(data) : Party.initData;
	Party.postItems(data);
};
Party.storeData = function() {
	var data = Serializer.serialize(this.items(), {type:'list', itemTemplate:Party.template});
	localStorage.setItem('partys', data);
};

Party.loadData();
