Battle = function(board) {
	this.bid = Date.now();
	this.board = board;
	
	this.floor = 0;
	this.score = 0;
	this.chain = 0;
	this.cntMove = 0;
	this.ally = null;
	this.enemys = [];
	this.nextEnemyImg = Chara.imgEmpty;
	
	this.logs = [];
	
	this.skActivateds = {t:0, items:[]};
	
	this.refreshFloor();
	
	if(!this.loadData()) {
		this.initAlly();
		this.createEnemys();
	}
};

Battle.partyId = 0;
Battle.supId = 0;

Battle.maxRank = 11;
Battle.dirIds = {'d':2, 'l':4, 'r':6, 'u':8};

Battle.prototype.onMoved = function(move) {
//Util.log(mgs);
	this.cntMove++;
	
	this.move = move;
	
	var sc = 0;
	var mgs = move.mergeds;
	var detailMgs = [];
	for(var i=0;i<mgs.length;++i) {
		sc += mgs[i].value;
		detailMgs.push([mgs[i].value, mgs[i].tiles[0].ele, mgs[i].tiles[1].ele]);
	}
	this.score += sc;
	this.chain = mgs.length>0 ? this.chain+1 : 0;
	this.combo = mgs.length;
	
	this.logs.push({
		'uid':gUid,
		'bid':this.bid,
		'mvCnt':this.cntMove,
		'time':Date.now(),
		'dir':Battle.dirIds[move.dir],
		'score':sc,
		'combo':this.combo,
		'chain':this.chain,
		'detail':JSON.stringify(detailMgs),
	});
//Util.log(this.logs);
	this.postLogs();
	
//Util.log('Statu Step');
	this.forEachBattler(this.onBattlerStatuStep, []);
	
//Util.log('Passive Step');
	this.forEachAlly(this.onAllyPassiveStep, []);
	
//Util.log('Action Step');
//Util.log(this.ally.modifiers);
	this.forEachAlly(this.onAllyActionStep, []);
	this.forEachEnemy(this.onEnemyActionStep, []);
	
//Util.log('XAction Step');
	this.forEachAlly(this.onAllyExtraActionStep, []);
	this.forEachEnemy(this.onEnemyExtraActionStep, []);
	
//Util.log('Skill Step');
	this.forEachAlly(this.onAllySkillStep, []);
	
//Util.log('Clean Step');
	this.forEachBattler(this.onBattlerCleanStep, []);
	
	
	if(!this.getTargetBattlers(0x110)[0].isAlive()) {
		this.nextFloor();
	}
	if(!this.ally.isAlive()) {
		this.isLose = true;
		this.board.setEnable(false);
		this.postLogs(true);
	}
	
	if(this.board.isGameOver()) {
		this.bid = Date.now();
		this.cntMove = 0;
		this.chain = 0;
	}
	
	this.storeData();
};

Battle.prototype.postLogs = function(isForce) {
	/*
	if(!isForce && this.logs.length < 5) {
		return;
	}
	
	//var url = 'http://localhost/2048RPG/backend/2048/index.php';
	var url = 'https://2048-ayukawayen.rhcloud.com/';
	
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange=this.onLogPosted;
	
	xhr.battle = this;
	xhr.logs = [];
	while(this.logs.length > 0) {
		xhr.logs.push(this.logs.shift());
	}
	
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-type', 'application/json');
	xhr.send(JSON.stringify(xhr.logs));
	*/
};
Battle.prototype.onLogPosted = function() {
	if(this.readyState==4) {
		if(this.status == 200) {
			return;
		}
		while(this.logs.length > 0) {
			this.battle.logs.push(this.logs.shift());
		}
		
	}
};

Battle.prototype.forEachBattler = function(func, args) {
	this.forEachAlly(func, args);
	this.forEachEnemy(func, args);
};
Battle.prototype.forEachAlly = function(func, args) {
	if(!this.ally.isAlive()) {
		return;
	}
	args.unshift(this.ally);
	func.apply(this, args);
};
Battle.prototype.forEachEnemy = function(func, args) {
	args.unshift(null);
	for(var i=0;i<this.enemys.length;++i) {
		if(!this.enemys[i].isAlive()) {
			continue;
		}
		args[0] = this.enemys[i];
		func.apply(this, args);
	}
};

Battle.prototype.onBattlerStatuStep = function(battler) {
	battler.onStatuStep();
};
Battle.prototype.onAllyPassiveStep = function(battler) {
//Util.log(battler.passives);
	for(var i=0;i<battler.passives.length;++i) {
		var passive = battler.passives[i];
		if(!passive.validate(this)) {
			continue;
		}
		for(var ei=0;ei<passive.effects.length;++ei) {
			battler.postEffect(passive.effects[ei], passive.lv);
		}
	}
};
Battle.prototype.onAllySkillStep = function(battler) {
//Util.log(battler.skSelections);
	++this.skActivateds.t;
	this.skActivateds.items = [];
	
	var mgs = this.move.mergeds;
	for(var i=0;i<mgs.length;++i) {
		var mg = mgs[i];
		var select = mg.tiles[0].ele*Skill.cntEleType + mg.tiles[1].ele;
		var xLv = (mg.tiles[0].ele == mg.tiles[1].ele ? 1 :0);
		var skills = battler.skSelections[select];
		for(var si=0;si<skills.length;++si) {
			if(!skills[si]) {
				continue;
			}
			var skill = skills[si];
			
			this.skActivateds.items.push({
				memberImg:battler.imgs[si],
				eles:[mg.tiles[0].ele, mg.tiles[1].ele],
				name:skill.id,
			});
			
			for(var ei=0;ei<skill.effects.length;++ei) {
				battler.postEffect(skill.effects[ei], skill.lv+xLv);
			}
		}
	}
};

Battle.prototype.onAllyActionStep = function(battler) {
	var mgs = this.move.mergeds;
	
	if(mgs.length <= 0) {
		return;
	}
	
	var v = 0;
	for(var i=0;i<mgs.length;++i) {
		v += mgs[i].value;
	}
	
	v *= 0.75 + mgs.length*0.25;

	battler.onHeal(v * battler.getModifiedHel());
	
	var atkCnt = 1 + battler.getModifier('atkCnt');
	var drainRate = battler.getModifier('drain%')/100;
	for(var mi=0;mi<this.ally.atks.length;++mi) {
		var atk = v * battler.getModifiedAtk(mi);
		for(var ai=0;ai<atkCnt;++ai) {
			var targetBattlers = this.getTargetBattlers((battler.getModifier('atkRange') ? 0x120 : 0x110));
			for(var bi=0;bi<targetBattlers.length;++bi) {
				var dmg = targetBattlers[bi].onAttack(atk);
				if(drainRate > 0) battler.onHeal(dmg * drainRate);
			}
		}
	}
};
Battle.prototype.onEnemyActionStep = function(battler) {
	battler.ap += Math.round(100 * (1+battler.getModifier('spd%')));
	var atk = battler.getModifiedAtk();
	
	while(battler.ap >= 100) {
		var dmg = this.ally.onAttack(atk);
		
		var rate = battler.getModifier('反射%')/100;
		if(rate > 0) battler.postHp(atk*rate*-1);
		var rate = battler.getModifier('回擊%')/100;
		if(rate > 0) battler.postHp(dmg*rate*-1);
		
		battler.ap -= 100;
	}
};
Battle.prototype.onAllyExtraActionStep = function(battler) {
	var xas = battler.xActions['HpGain'] || [];
	for(var i=0;i<xas.length;++i) {
		battler.onHeal(xas[i].value * xas[i].count);
	}
	var xas = battler.xActions['HpLose'] || [];
	for(var i=0;i<xas.length;++i) {
		battler.postHp(xas[i].value * xas[i].count * -1);
	}
	
	var xas = battler.xActions['回復'] || [];
	for(var i=0;i<xas.length;++i) {
		battler.onHeal(xas[i].value * xas[i].count);
	}
	var xas = battler.xActions['單攻'] || [];
	for(var i=0;i<xas.length;++i) {
		for(var ci=0;ci<xas[i].count;++ci) {
			this.getTargetBattlers(0x110)[0].onAttack(xas[i].value);
		}
	}
	
	var xas = battler.xActions['全攻'] || [];
	for(var i=0;i<xas.length;++i) {
		var targetBattlers = this.getTargetBattlers(0x120);
		for(var ci=0;ci<xas[i].count;++ci) {
			for(var ei=0;ei<targetBattlers.length;++ei) {
				targetBattlers[ei].onAttack(xas[i].value);
			}
		}
	}
};
Battle.prototype.onEnemyExtraActionStep = function(battler) {
	var xas = battler.xActions['HpGain'] || [];
	for(var i=0;i<xas.length;++i) {
		battler.onHeal(xas[i].value * xas[i].count);
	}
	var xas = battler.xActions['HpLose'] || [];
	for(var i=0;i<xas.length;++i) {
		battler.postHp(xas[i].value * xas[i].count * -1);
	}
	
	var xas = battler.xActions['回復'] || [];
	for(var i=0;i<xas.length;++i) {
		battler.onHeal(xas[i].value * xas[i].count);
	}
	var xas = battler.xActions['單攻'] || [];
	for(var i=0;i<xas.length;++i) {
		for(var ci=0;ci<xas[i].count;++ci) {
			this.ally.onAttack(xas[i].value);
		}
	}
	var xas = battler.xActions['全攻'] || [];
	for(var i=0;i<xas.length;++i) {
		for(var ci=0;ci<xas[i].count;++ci) {
			this.ally.onAttack(xas[i].value);
		}
	}
};

Battle.prototype.onBattlerCleanStep = function(battler) {
Util.log(battler.modifiers);
	battler.onCleanStep();
};


Battle.prototype.getTargetBattlers = function(target, battler) {
	if(target == 0) {
		return [battler];
	}
	
	var party = (target >> 8) & 0x1;
	var flag = (target >> 4) & 0xf;
	var index = (target) & 0xf;
	
	if(party == 0) {
		return [this.ally];
	}
	
	if(flag == 0) {
		return [this.enemys[index-1]];
	}
	if(flag == 1) {
		for(var i=0;i<this.enemys.length;++i) {
			if(this.enemys[i].isAlive()) {
				return [this.enemys[i]];
			}
		}
		return [this.enemys[i-1]];
	}
	if(flag == 2) {
		return this.enemys;
	}
	
	return [];
};


Battle.putStgId = function(value) {
	Battle.stgId = value;
}

Battle.prototype.getStage = function() {
	if(this.stage) {
		return this.stage;
	}
	
	this.stage = Stage.getItem(this.stgId) || Stage.getItem(Battle.stgId);
	if(!this.stage) {
		this.stage = Stage.items()[0];
		this.stgId = this.stage.id;
	}
	return this.stage;
};


Battle.prototype.nextFloor = function() {
	this.score += ((64<<this.enemyRk)+64);
	
	this.floor++;
	this.isClear = (this.floor == this.getStage().cntFloor);
	
	this.refreshFloor();
	this.createEnemys();
};

Battle.prototype.refreshFloor = function() {
	var stage = this.getStage();
	this.enemySize = (stage.cntEnemy.init-1+this.floor*stage.cntEnemy.inc)%5 + 1;
	this.enemyRk = this.getEnemyRank(this.floor);
	this.nextEnemyImg = 'e'+this.getEnemyRank(this.floor+1)+'.png';
};

Battle.prototype.getEnemyRank = function(floor) {
	var rk = 0;
	for(var i=floor;(i&1)>0;i>>=1) {
		++rk;
	}
	return rk;
};


Battle.prototype.createEnemys = function() {
	var stgLv = this.getStage().lv/10;
	
	var c = (this.enemySize+1)/2;
	
//Util.log(rk);
	var args = {
		'img':'e'+this.enemyRk+'.png',
	};
	args.atk = Math.round(stgLv*( (409600/512*9/8 + 240*(this.enemyRk*2+10))/c + 1920 ));
	args.def = Math.round(stgLv*( 480*(this.enemyRk+1)/2*(10-c)/8 ));
	args.hel = 0;
	args.hp = Math.round(stgLv*( (480*16-args.def)*((64<<this.enemyRk)+64)/16/this.enemySize ));
Util.log(args);
	
	this.enemys = [];
	for(var i=0;i<this.enemySize;++i) {
		var enemy = new Enemy(this, args);
		enemy.cnt = this.enemySize;
		this.enemys.push(enemy);
	}
};

Battle.prototype.initAlly = function() {
	var memberIds = Party.getItem(Battle.partyId).members.map(function(item){return item.id;});
	this.ally = new Ally(this, memberIds, Battle.supId);
Util.log(this.ally);
};


Battle.prototype.storeData = function() {
	var data = {
		'bid':this.bid,
		'stgId':this.stgId,
		'floor':this.floor,
		'score':this.score,
		'chain':this.chain,
		'ally':Serializer.wrap(this.ally, Ally.template),
		'enemys':Serializer.wrap(this.enemys, {type:'list', itemTemplate:Enemy.template}),
		'logs':this.logs,
	};
	data = {
		'v':'20160115',
		'data':data,
	};
	localStorage.setItem('battle', JSON.stringify(data));
};
Battle.prototype.clearData = function() {
	localStorage.removeItem('battle');
};
Battle.prototype.loadData = function() {
	var data = localStorage.getItem('battle');
	
	if(!data) {
		return false;
	}
	
	var args = JSON.parse(data).data;

	this.ally = Ally.unwrap(this, Serializer.unwrap(args.ally, Ally.template));
	delete args.ally;
//Util.log(this.ally);
	if(!this.ally.isAlive()) {
		this.isLose = true;
		if(this.board) {
			this.board.setEnable(false);
		}
	}
	
	for(var i=0;i<args.enemys.length;++i) {
		this.enemys[i] = Enemy.unwrap(this, Serializer.unwrap(args.enemys[i], Enemy.template));
	}
	delete args.enemys;
//Util.log(this.enemys);
	
	for(var k in args) {
		this[k] = args[k];
	}
	
	this.refreshFloor();
	
	return true;
};
