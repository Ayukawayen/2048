var BattleBoardView = React.createClass({
	render: function() {
		this.board = this.props.board;

		this.touch = null;
		this.inputs = [];
		
		var rows = [];
		for(var r=0;r<BattleBoard.countRow;++r) {
			var cells = [];
			for(var c=0;c<BattleBoard.countCol;++c) {
				cells[c] = React.createElement(BattleBoardView.CellView, {item:this.board.tiles[r*BattleBoard.countCol+c]});
			}
			rows[r] = React.createElement('div', {className:'row'}, cells);
		}
		
		var cn = 'board' + (this.board.isGameOver() ? ' noMoreMove' : '');
		
		return (
			React.createElement('div', {className:cn}, rows)
		);
	},
	
	componentDidMount: function() {
		var node = this.getDOMNode();
		
		window.addEventListener('keyup', this.onKeyUp);
		node.addEventListener('touchstart', this.onTouchStart);
		node.addEventListener('touchend', this.onTouchEnd);
	},
	componentWillUnmount: function() {
		var node = this.getDOMNode();
		
		window.removeEventListener('keyup', this.onKeyUp);
		node.removeEventListener('touchstart', this.onTouchStart);
		node.removeEventListener('touchend', this.onTouchEnd);
	},
	
	onKeyUp: function(e) {
		e.preventDefault();
		e.stopPropagation();

		if(e.keyCode == 37 || e.keyCode == 65) {
			this.inputs.push('l');
		}
		else if(e.keyCode == 38 || e.keyCode == 87) {
			this.inputs.push('u');
		}
		else if(e.keyCode == 39 || e.keyCode == 68) {
			this.inputs.push('r');
		}
		else if(e.keyCode == 40 || e.keyCode == 83) {
			this.inputs.push('d');
		}
		
		this.onTick();
	},
	onTouchStart: function(e) {
//Util.log(e);
		e.preventDefault();
		e.stopPropagation();
		
		var touch = e.touches[0];
		if(!touch) {
			return;
		}
		this.touch = {x:touch.clientX, y:touch.clientY};
	},
	onTouchEnd: function(e) {
//Util.log(e);
		e.preventDefault();
		e.stopPropagation();

		var touch = e.changedTouches[0];
		if(!touch) {
			return;
		}
		if(!this.touch) {
			return;
		}
		var dx = touch.clientX - this.touch.x;
		var dy = touch.clientY - this.touch.y;
//Util.log(dx+','+dy);

		this.touch = null;
		
		var thre = Math.min(screen.width, screen.height)/16
		if(Math.abs(dx) < thre && Math.abs(dy) < thre) {
			return;
		}
		
		if(Math.abs(dx) > Math.abs(dy)) {
			this.inputs.push(dx>0 ? 'r' : 'l');
		}
		else {
			this.inputs.push(dy>0 ? 'd' : 'u');
		}
		
		this.onTick();
	},
	
	onTick: function() {
		if(this.inputs.length <= 0) {
			return;
		}
		/*
		if(!this.ally.isAlive) {
			return;
		}
		*/
		if(this.onTick.isMoving) {
			return;
		}
		
		this.onTick.isMoving = true;
		
		var input = this.inputs.shift();
		
		this.board.move(input);
		
		this.onTick.isMoving = false;
	},
});

BattleBoardView.CellView = React.createClass({
	render: function() {
		var item = this.props.item;
		var cn = 'cell';
		for(var k in item.attrs) {
			cn += ' '+k+'_'+item.attrs[k];
		}
		
		var eleCn = `element ele_${item.attrs.ele}`;
		
		return (
			React.createElement('div', {className:cn}, [
				React.createElement('div', {className:eleCn}, [
					//React.createElement('img', {src:'image/symbols.png'}),
				]),
				React.createElement('span', {}, (item.rank>0 ? item.getValue() : '')),
			])
		);
	},
});
