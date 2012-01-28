function myFunc() {
	console.log(this.variable);
}

var A = function(val) {
	console.log(this);
	this.variable = val;
};

A.prototype.newMethod = myFunc;

var securityManager = new A("testa");
//console.log(securityManager);
securityManager.newMethod();
