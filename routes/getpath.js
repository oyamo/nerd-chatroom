const path = require('path');

module.exports = (filename) =>{
    return path.join(__dirname, '../public', filename)
}