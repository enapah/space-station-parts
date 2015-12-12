var fs = require('fs'),
    _  = require('lodash');

function split(separator) {
	return function(row) {
		return row.split(separator);
	}
}

module.exports = function parse(file) {
	return fs.readFileSync(file, 'utf-8')
		.split('\n')
		.map(split('\t'))
		.map(_.partial(_.zipObject, ['name', 'cost', 'importance', 'max']));
};
