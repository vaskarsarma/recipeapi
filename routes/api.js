const Router = require("koa-router");
const router = Router({
    prefix: '/recipe'
});
const recipe = require("../models/recipe");
const commonutils = require("../utils/common");
const _cache = require("../utils/cache");

var ObjectId = require('mongodb').ObjectID;

var cachekey = "recipe_";

// Get Recipe 
router.get("/", async ctx => {
    var data = _cache.get(cachekey);

    if (!data) {
        console.log("not cached");
        data = await commonutils.getData(cachekey);
        _cache.set(cachekey, data);
    }

    ctx.body = data;
});

// Get Recipe by name 
router.get("/:name", async ctx => {
    let r_name = ctx.params.name;
    cachekey = "recipe_" + r_name;

    var data = _cache.get(cachekey);

    if (!data) {
        console.log("not cached");
        data = await commonutils.searchbyrcpname(cachekey, r_name);
        _cache.set(cachekey, data);
    }

    ctx.body = data;
});

// Get Recipe by route
router.get("/:origin/:dest", async ctx => {
    let r_route = (ctx.params.origin && ctx.params.dest) ? ctx.params.origin + "-" + ctx.params.dest : "";

    if (r_route) {
        console.log(r_route.toString());
        cachekey = "recipe_" + r_route;
        var data = _cache.get(cachekey);

        if (!data) {
            console.log("not cached");
            data = await commonutils.searchbyrcproute(cachekey, r_route.toUpperCase());
            _cache.set(cachekey, data);
        }

        ctx.body = data;
    }
    else
        ctx.body = "Invalid query";
});

// Get Recipe by any post query
router.post("/", async ctx => {
    try {
        var { rcp_name, rcp_route } = ctx.request.body;

        var query = { $and: [{ rcp_name: { $regex: rcp_name, $options: 'i' } }, { rcp_route: { $regex: rcp_route, $options: 'i' } }] }

        cachekey = "recipe_" + rcp_name + "_" + rcp_route;
        var data = _cache.get(cachekey);

        if (!data) {
            console.log("Not Cached");
            data = await commonutils.searchrecipe(cachekey, query);
            _cache.set(cachekey, data);
        }

        ctx.body = data;

    } catch (err) {
        console.log(err);
        ctx.body = {
            status: "error",
            error: "Failed to search!!!Please Try again."
        }
    }
});

// Add recipe
router.post("/add", ctx => {
    var rcp = new recipe(ctx.request.body);

    console.log(rcp);

    //TODO - Validate recipe

    // Saving it to the database.
    rcp.save((err, res) => {
        if (err) {
            ctx.body = {
                status: "error",
                error: "Failed to save!!!Please Try again."
            }
        }
        else {
            if ((_cache.keys()).length > 0) {
                console.log("Cache cleared");
                _cache.reset(); //Clear Cache
            }

            ctx.body = {
                status: "success",
                data: res
            }
        }
    });
});

// Edit recipe
router.put('/edit/:id', (ctx) => {
    try {
        var { rcp_id, rcp_name, rcp_route } = ctx.request.body;
        console.log(rcp_id, rcp_name, rcp_route);
        var rcp = {
            rcp_id: rcp_id,
            rcp_name: rcp_name,
            rcp_route: rcp_route
        }
        console.log(rcp);

        var query = { '_id': new ObjectId(ctx.params.id) };
        recipe.findByIdAndUpdate(query, rcp, { upsert: false }, function (err, res) {
            if (err) {
                ctx.body = {
                    status: "error",
                    error: "Failed to update!!!Please Try again."
                }
            }
            else {
                if ((_cache.keys()).length > 0) {
                    console.log("Cache cleared");
                    _cache.reset(); //Clear Cache
                }

                console.log("done", res);
                ctx.body = {
                    status: "success",
                    data: res
                }
            }
        });
    } catch (err) {
        console.log(err);
        ctx.body = {
            status: "error",
            error: "Failed to update!!!Please Try again."
        }
    }
});

module.exports = router;
