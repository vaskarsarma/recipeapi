const recipe = require("../models/recipe");

exports.getData= function() {
    return new Promise((resolve, rej) => {
        recipe.find().exec((err, res) => {
            if (err) {
                return rej(err)
            } else {
                return resolve(JSON.stringify(res))
            }
        });
    });
}

exports.searchbyrcpname= function(name) {
    return new Promise((resolve, rej) => {
        let regex = new RegExp(name, "i"), query = { rcp_name: regex };
        recipe.find(query).exec((err, res) => {
            if (err) {
                return rej(err)
            } else {
                return resolve(JSON.stringify(res))
            }
        });
    });
}

exports.searchbyrcproute= function(route) {
    return new Promise((resolve, rej) => {
        let query = { rcp_route: route };
        recipe.find(query).exec((err, res) => {
            if (err) {
                return rej(err)
            } else {
                return resolve(JSON.stringify(res))
            }
        });
    });
}

exports.searchrecipe= function(query) {
    return new Promise((resolve, rej) => {
        recipe.find(query).exec((err, res) => {
            if (err) {
                return rej(err)
            } else {
                return resolve(JSON.stringify(res))
            }
        });
    });
}