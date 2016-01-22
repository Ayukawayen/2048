var Util = {
	toString: function(n, radix, cntDigit) {
		var s = n.toString(radix||10);
		if(!cntDigit) {
			return s;
		}
		
		while(s.length < cntDigit) {
			s = '0'+s;
		}
		
		return s;
	},
	
	clone: function(object) {
		return JSON.parse(JSON.stringify(object));
	},
	
	log: function(object) {
		if(!location.host || location.host==='localhost') {
			console.log(object);
		}
	},
};

var Random = function(seed) {
	this.seed = seed || Date.now();
	this.rand = function() {
		this.seed = Math.round(this.seed * 0x7fffffff);
		this.seed = (this.seed * 1103515245 + 12345) % 0x7fffffff;
		this.seed /= 0x7fffffff;
		return this.seed;
	};
	this.seed = this.rand();
};


var Serializer = function() {
};

Serializer.serialize = function(object, template) {
	return JSON.stringify(Serializer.wrap(object, template));
};
Serializer.deserialize = function(serialized, template) {
	return Serializer.unwrap(JSON.parse(serialized), template);
};

Serializer.wrap = function(object, template) {
//console.log(template);
	if(template.type == 'string') {
		return object.toString();
	}
	if(template.type == 'int') {
		return parseInt(object);
	}
	if(template.type == 'float') {
		return parseFloat(object);
	}
	if(template.type == 'boolean') {
		return object ? 1 : 0;
	}
	
	if(template.type == 'object') {
		var data = [];
		for(var i=0;i<template.itemTemplate.length;++i) {
			var prop = template.itemTemplate[i];
			data[i] = Serializer.wrap(object[prop.name], prop);
		}
		return data;
	}
	if(template.type == 'list') {
		var data = [];
		for(var i=0;i<object.length;++i) {
			data[i] = Serializer.wrap(object[i], template.itemTemplate);
		}
		return data;
	}
	if(template.type == 'map') {
		var keys = [];
		var data = [];
		for(var k in object) {
			keys.push(k);
		}
		for(var i=0;i<keys.length;++i) {
			data[i] = Serializer.wrap(object[keys[i]], template.itemTemplate);
		}
		return [keys, data];
	}
	return object;
};
Serializer.unwrap = function(data, template) {
	if(data === null) {
		return data;
	}
	
	if(template.type == 'string') {
		return data;
	}
	if(template.type == 'int') {
		return data;
	}
	if(template.type == 'float') {
		return data;
	}
	if(template.type == 'boolean') {
		return data != 0;
	}
	
	if(template.type == 'object') {
		var object = {};
		for(var i=0;i<template.itemTemplate.length;++i) {
			var prop = template.itemTemplate[i];
			object[prop.name] = Serializer.unwrap(data[i], prop);
		}
		return object;
	}
	if(template.type == 'list') {
		var object = [];
		for(var i=0;i<data.length;++i) {
			object[i] = Serializer.unwrap(data[i], template.itemTemplate);
		}
		return object;
	}
	if(template.type == 'map') {
		var keys = data[0];
		var object = {};
		for(var i=0;i<keys.length;++i) {
			object[keys[i]] = Serializer.unwrap(data[1][i], template.itemTemplate);
		}
		return object;
	}
	return data;
};


Serializer.toJson = function(object, template) {
	if(template.type == 'string') {
		return JSON.stringify(object.toString());
	}
	if(template.type == 'int') {
		return JSON.stringify(parseInt(object));
	}
	if(template.type == 'float') {
		return JSON.stringify(parseFloat(object));
	}
	if(template.type == 'boolean') {
		return JSON.stringify(!!object);
	}
	
	if(template.type == 'object') {
		var data = {};
		for(var i=0;i<template.itemTemplate.length;++i) {
			var prop = template.itemTemplate[i];
			data[prop.name] = object[prop.name];
		}
console.log(data);
		return JSON.stringify(data);
	}
	if(template.type == 'list') {
		return JSON.stringify(object);
	}
	if(template.type == 'map') {
		return JSON.stringify(object);
	}
	return JSON.stringify({});
};
Serializer.fromJson = function(json, template) {
	return JSON.parse(json);
};
