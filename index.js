var _      = require('lodash'),
    solver = require('simplex-solver'),
    parse  = require('./parse');

var MAX_COST = 10000;

var parts = parse('list.txt');

// 'x1', 'x2', 'x3', ..., 'xn'
var variables = _.range(parts.length).map(prefix('x'));

// 'i0x0 + i1x1 + i2x2 + ... + inxn'
var equation = _(parts).map('importance').zip(variables).map(join()).join(' + ');

// 'c0x0 + c1x1 + c2x2 + ... + cnxn <= <MAX_COST>'
var costConstraint = _(parts).map('cost').zip(variables).map(join()).join(' + ') + ' <= ' + MAX_COST;

// 'x0 <= x0max', 'x1 <= x1max', ..., 'xn <= xnmax'
var constraints = _.zip(variables, _.map(parts, 'max')).map(join(' <= '));


var result = solver.maximize(equation, constraints.concat(costConstraint));


var amounts = variables.map(_.propertyOf(result)).map(Math.floor);

var costs = _(parts).map('cost').zipWith(amounts, function(cost, amount) {
	return cost * amount;
}).value();

_(parts).map('name').zip(amounts, costs).forEach(_.spread(function(name, amount, cost) {
	if (amount > 0) {
		console.log(name + ' x ' + amount + ' (' + cost + ' $M)')
	}
})).run();

console.log('Total cost: ' + _.sum(costs) + ' $M');

function prefix(p) {
	return function(x) {
		return p + x;
	}
}

function join(glue) {
	return function(arr) {
		return arr.join(glue || '');
	}
}

