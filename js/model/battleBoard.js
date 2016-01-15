BattleBoard = function(seed) {
	this.seed = seed||Date.now();
	this.random = new Random(this.seed);
	
	this.tiles = [];
	for(var i=0;i<BattleBoard.countCell;++i) {
		this.tiles[i] = new BattleBoard.Tile(0, this.random);
	}
	this.countEmpty = BattleBoard.countCell;
	this.cntMove = 0;
	
	this.onMovedListeners = [];
	
	if(!this.loadData()) {
		this.reset();
	}
	
	this.isEnabled = true;
}

BattleBoard.countRow = 4;
BattleBoard.countCol = 4;
BattleBoard.countCell = BattleBoard.countRow*BattleBoard.countCol;

BattleBoard.prototype.reset = function() {
	this.cntMove = 0;
	for(var i=0;i<BattleBoard.countCell;++i) {
		this.putTile(i, new BattleBoard.Tile(0, this.random));
	}
	for(var i=0;i<2;++i) {
		this.createTile();
	}
	
	this.storeData();
	
};
BattleBoard.prototype.test = function() {
	for(var i=0;i<BattleBoard.countCell;++i) {
		this.putTile(i, new BattleBoard.Tile(0, this.random));
	}
	for(var i=0;i<=11;++i) {
		this.putTile(i, new BattleBoard.Tile(i, this.random));
	}
	for(var i=0;i<this.tiles.length;++i) {
		this.tiles[i].attrs.ele = -1;
	}
};

BattleBoard.prototype.setEnable = function(value) {
	this.isEnabled = !!value;
};

BattleBoard.prototype.putTile = function(i, tile, dir) {
	if(this.tiles[i].rank > 0) {
		this.countEmpty++;
	}
	if(tile.rank > 0) {
		this.countEmpty--;
	}
	
	this.tiles[i] = tile;
	
	tile.attrs.v = tile.getValue();
	tile.attrs.ele = tile.ele;
	tile.attrs.dir = (dir==null ? 'n' : dir);
	tile.attrs.move = (this.cntMove%2>0 ? 'odd' : 'even');
};

BattleBoard.prototype.isGameOver = function() {
	if(this.countEmpty > 0) {
		return false;
	}
	
	for(var r=0;r<BattleBoard.countRow;++r) {
		for(var c=1;c<BattleBoard.countCol;++c) {
			if(this.tiles[r*BattleBoard.countCol+c].rank == this.tiles[r*BattleBoard.countCol+(c-1)].rank) {
				return false;
			}
		}
	}
	for(var c=0;c<BattleBoard.countCol;++c) {
		for(var r=1;r<BattleBoard.countRow;++r) {
			if(this.tiles[r*BattleBoard.countCol+c].rank == this.tiles[(r-1)*BattleBoard.countCol+c].rank) {
				return false;
			}
		}
	}
	
	return true;
}

BattleBoard.prototype.createTile = function() {
	if(this.countEmpty <= 0) {
		return false;
	}
	var rand = Math.floor((this.random.rand()*this.countEmpty));
	var count = 0;
	for(var i=0;i<BattleBoard.countCell;++i) {
		if(this.tiles[i].rank == 0) {
			if(count == rand) {
				this.putTile(i, new BattleBoard.Tile(1, this.random));
				return true;
			}
			++count;
		}
	}
	
	return false;
};

BattleBoard.prototype.move = function(dir) {
	if(!this.isEnabled) {
		return false;
	}
	
	var d = 0;
	var axisMain = 'x';
	switch(dir) {
		case 'l':
			d = -1;
			axisMain = 'x';
			break;
		case 'r':
			d = 1;
			axisMain = 'x';
			break;
		case 'u':
			d = -1;
			axisMain = 'y';
			break;
		case 'd':
			d = 1;
			axisMain = 'y';
			break;
		default:
			return false;
	}
	var axisSub = (axisMain=='x' ? 'y' : 'x');

	if(!this.move.axisInfos) {
		this.move.axisInfos = {
			'x':{
				'count':BattleBoard.countCol,
				'weight':1,
			},
			'y':{
				'count':BattleBoard.countRow,
				'weight':BattleBoard.countCol,
			},
		};
	}
	var axisInfos = {
		'main':this.move.axisInfos[axisMain],
		'sub':this.move.axisInfos[axisSub],
	};
	
	var isMoved = false;
	var mergeds = [];
	
	for(var sub=0;sub<axisInfos.sub.count;++sub) {
		for(var ci=0;ci<axisInfos.main.count;++ci) {
			var cMain = d<0 ? ci : axisInfos.main.count-1-ci;
			var cIndex = cMain*axisInfos.main.weight + sub*axisInfos.sub.weight;
			
			for(var ti=ci+1;ti<axisInfos.main.count;++ti) {
				var tMain = d<0 ? ti : axisInfos.main.count-1-ti;
				var tIndex = tMain*axisInfos.main.weight + sub*axisInfos.sub.weight;
				
				if(this.tiles[tIndex].rank == 0) {
					continue;
				}
				
				if(this.tiles[cIndex].rank==0) {
					this.putTile(cIndex, this.tiles[tIndex], dir);
					this.putTile(tIndex, new BattleBoard.Tile(0, this.random), dir);
				
					isMoved = true;
				}
				else if(this.tiles[cIndex].rank==this.tiles[tIndex].rank) {
					var merged = {
						'pos':{},
						'tiles':[Util.clone(this.tiles[tIndex]), Util.clone(this.tiles[cIndex])],
					}
					merged.pos[axisMain] = cMain;
					merged.pos[axisSub] = sub;
					
					this.tiles[tIndex].rank++;
					
					merged.rank = this.tiles[tIndex].rank;
					merged.value = this.tiles[tIndex].getValue();

					if(this.tiles[tIndex].rank >= Battle.maxRank) {
						//this.putTile(tIndex, new BattleBoard.Tile(0, this.random));
					}
					this.putTile(cIndex, this.tiles[tIndex], dir);
					this.putTile(tIndex, new BattleBoard.Tile(0, this.random), dir);
					
					mergeds.push(merged);
					
					isMoved = true;
					
					break;
				}
				else {
					break;
				}
			}
		}
	}

	if(!isMoved) {
		return false;
	}
	this.createTile();
	
	for(var i=0;i<this.onMovedListeners.length;++i) {
		this.onMovedListeners[i]({
			'dir':dir,
			'mergeds':mergeds,
		});
	}
	
	++this.cntMove;
	
	this.storeData();
	
//Util.log(this.serialize());
	return true;
};

BattleBoard.prototype.transElement = function(from, to) {
	for(var i=0;i<this.tiles.length;++i) {
		var tile = this.tiles[i];
		if(tile.ele != from) {
			continue;
		}
		tile.attrs.ele = tile.ele = to;
	}
}


BattleBoard.prototype.addOnMovedListener = function(l) {
	this.onMovedListeners.push(l);
}


BattleBoard.prototype.storeData = function() {
	localStorage.setItem('battleBoard', this.serialize());
};
BattleBoard.prototype.clearData = function() {
	localStorage.removeItem('battleBoard');
};
BattleBoard.prototype.loadData = function() {
	var data = localStorage.getItem('battleBoard');
	
	if(!data) {
		return false;
	}
	
	this.deserialize(data);
	if(this.isGameOver()) {
		this.reset();
		return;
	}
	return true;
};


BattleBoard.Tile = function(rank, random, ele) {
	this.rank = rank;
	
	this.ele = ele;
	if(this.ele == null) {
		random = random || new Random();
		this.ele = Math.floor((random.rand()*Skill.cntEleType));
	}
	
	this.attrs = {};
}

BattleBoard.Tile.prototype.clone = function() {
	var tile = new BattleBoard.Tile(this.rank, null, this.ele);
	return tile;
}


BattleBoard.Tile.prototype.getValue = function() {
	return 1 << this.rank;
}



BattleBoard.Tile.template = {
	type:'object',
	itemTemplate:[
		{name:'rank', type:'int'},
		{name:'ele', type:'int'},
	],
};

BattleBoard.template = {
	type:'object',
	itemTemplate:[
		{name:'seed', type:'float'},
		{name:'currentSeed', type:'float'},
		{name:'cntMove', type:'int'},
		{name:'tiles', type:'list', itemTemplate:BattleBoard.Tile.template},
	],
};

BattleBoard.prototype.serialize = function() {
	this.currentSeed = this.random.seed;
	return Serializer.serialize(this, BattleBoard.template);
};

BattleBoard.prototype.deserialize = function(data) {
	var args = Serializer.deserialize(data, BattleBoard.template);

	for(var i=0;i<args.tiles.length;++i) {
		this.putTile(i, new BattleBoard.Tile(args.tiles[i].rank, null, args.tiles[i].ele));
	}
	delete args.tiles;
	
	for(var k in args) {
		this[k] = args[k];
	}
	
	this.random.seed = this.currentSeed;
};
