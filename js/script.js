React.createElementList = function(type, propsList) {
	var elements = [];
	for(var i=0;i<propsList.length;++i) {
		elements.push(React.createElement(type, propsList[i]));
	}
	return elements;
}