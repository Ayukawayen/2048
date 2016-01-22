Hint = function() {
};

Hint.show = function(key, props) {
	if(Hint.isDisabled(key)) {
		return;
	}
	
	var item = Hint.items[key];
	if(!item) {
		return;
	}
	
	props = props || {};
	if(props.isDisabled) {
		Hint.putIsDisabled(key, true);
	}
	
	var buttons = [
		{'key':key, type:'dontShowAgain', text:'下次不要再顯示'},
		{'key':key, type:'ok', text:'OK'},
	];
	if(props.isDisabled) {
		buttons.shift();
	}
	
	MainView.setPopupView({
		isShow:true,
		content:item.content,
		'buttons':buttons,
		onButtonClick:Hint.onButtonClick,
	});
	
};

Hint.onButtonClick = function(item) {
	if(item.type === 'dontShowAgain') {
		Hint.putIsDisabled(item.key, true);
	}
	
	MainView.setPopupView({
		isShow:false,
	});
};

Hint.isDisabled = function(key) {
	Hint.isDisableds = Hint.isDisableds || JSON.parse(localStorage.getItem('hintDisableds')) || {};
	return !!Hint.isDisableds[key];
};

Hint.putIsDisabled = function(key, value) {
	Hint.isDisableds = Hint.isDisableds || {};
	Hint.isDisableds[key] = !!value;
	
	localStorage.setItem('hintDisableds', JSON.stringify(Hint.isDisableds));
};

Hint.items = {
	'初次Touch':{ content:'突然開始的戰鬥，往四個方向滑動方塊來攻擊敵人吧。\n\n戰鬥共有4層，預估所需時間2分鐘。' },
	'初次':{ content:'突然開始的戰鬥，使用方向鍵移動方塊來攻擊敵人吧。\n\n戰鬥共有4層，預估所需時間2分鐘。' },
	
	'Clear':{ content:'恭喜過關！\n\n點擊左上＜返回；或是繼續進行遊戲。' },
	
	'隊員長按':{ content:'長按隊員圖像以顯示詳細資料。' },
	'技能切換':{ content:'點擊右上圖示切換基本資料與技能資料。' },
};

