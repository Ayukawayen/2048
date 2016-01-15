SerializableMap = function() {
};

SerializableMap.init = function(cls) {
	cls.items = SerializableMap.items;
	cls.getItem = SerializableMap.getItem;
	cls.listItems = SerializableMap.listItems;
	cls.postItems = SerializableMap.postItems;
	cls.putItem = SerializableMap.putItem;
}

SerializableMap.getItem = function(key) {
	this.itemCache = this.itemCache || {};
	
	var cache = this.itemCache;
	
	if(cache[key]) {
		return cache[key];
	}
	
	var wrapped = this.wrappeds[key];
	if(!wrapped) {
		return null;
	}
	
	var args = Serializer.unwrap(wrapped, this.template);

	var item = new this();
	for(var k in args) {
		item[k] = args[k];
	}
	if(item.onCreated) {
		item.onCreated();
	}
	
	cache[key] = item;
	
	return cache[key];
};

SerializableMap.items = function(sortBy, isDesc) {
	sortBy = sortBy || 'id';
	isDesc = (isDesc == true);
	
	this.itemsCaches = this.itemsCaches || {};
	
	var cache = this.itemsCaches[sortBy] || {};
	this.itemsCaches[sortBy] = cache;
	
	if(cache[isDesc]) {
		return cache[isDesc];
	}
	if(cache[!isDesc]) {
		cache[isDesc] = cache[!isDesc].slice(0);
		cache[isDesc].reverse();
		return cache[isDesc];
	}
	
	var items = this.listItems();
	
	cache[isDesc] = [];
	for(var k in items) {
		cache[isDesc].push(items[k]);
	}
	
	cache[isDesc].sort(function(a,b) {
		var keys = sortBy.split('.');
		var vs = [a, b];
		for(var i=0;i<keys.length;++i) {
			vs[0] = vs[0][keys[i]] || 0;
			vs[1] = vs[1][keys[i]] || 0;
		}
		return (vs[0]>vs[1] ? 1 : -1) * (isDesc ? -1 : 1);
	});
	
	return cache[isDesc];
};

SerializableMap.listItems = function() {
	if(this.itemListCache) {
		return this.itemListCache;
	}
	
	this.itemListCache = {};
	
	for(var k in this.wrappeds) {
		this.itemListCache[k] = this.getItem(k);
	}
	
	return this.itemListCache;
};


SerializableMap.postItems = function(items, keyIndex) {
	keyIndex = keyIndex||0;

	this.wrappeds = this.wrappeds||{};
	
	for(var i=0;i<items.length;++i) {
		this.putItem(items[i][keyIndex], items[i]);
	}
};

SerializableMap.putItem = function(key, item) {
	this.wrappeds[key] = item;
};
