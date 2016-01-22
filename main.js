ReactDOM.render(
	React.createElement(MainView, null),
	document.querySelector('body')
);

var gUid = (localStorage.getItem('uid') & 0xffffffff) || 0;
if(!gUid) {
	gUid = Date.now() & 0xffffffff;
	localStorage.setItem('uid', gUid);
	MainView.setContentView(BattleView);
	Hint.show((window.onTouchStart ? '初次Touch' : '初次'), {isDisabled:true});
}
else {
	if(new Battle().loadData()) {
		MainView.setContentView(BattleView);
	}
	else {
		//MainView.setContentView(MemberDetailView, {item:Member.getItem(160)});
		MainView.setContentView(StageMainView);
	}
}
/*
MainView.setPopupView({
	isShow:true,
	content:'Hello',
	buttons:[
		{type:'negative', text:'NO'},
		{type:'neutral', text:'OK'},
	],
});
*/