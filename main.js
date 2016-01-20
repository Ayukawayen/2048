ReactDOM.render(
	React.createElement(MainView, null),
	document.querySelector('body')
);

var gUid = (localStorage.getItem('uid') & 0xffffffff) || 0;
if(!gUid) {
	gUid = Date.now() & 0xffffffff;
	localStorage.setItem('uid', gUid);
	MainView.setContentView(BattleView);
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