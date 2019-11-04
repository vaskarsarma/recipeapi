const Router = require("koa-router");
const router = Router({
    prefix: '/recipe'
});
const recipe = require("../models/recipe");
const commonutils = require("../utils/common");

var ObjectId = require('mongodb').ObjectID;

// Get Recipe 
router.get("/", async ctx => {
    ctx.body = await commonutils.getData();
});

// Get Recipe by name 
router.get("/search/:name", async ctx => {
    let r_name = ctx.params.name;
    ctx.body = await commonutils.searchbyrcpname(r_name);
});

// Get Recipe by route
router.get("/search/:origin/:dest", async ctx => {
    let r_route = (ctx.params.origin && ctx.params.dest) ? ctx.params.origin + "-" + ctx.params.dest : "";
    if (r_route) {
        console.log(r_route.toString());
        ctx.body = await commonutils.searchbyrcproute(r_route.toUpperCase());
    }
    else
        ctx.body = "Invalid query";
});

// Get Recipe by any post query
router.post("/search/", async ctx => {
    try {
        var { rcp_name, rcp_route } = ctx.request.body;

        var query = {
            $and: [
                {
                    rcp_name: { $regex: rcp_name, $options: 'i' }
                },
                {
                    rcp_route: { $regex: rcp_route, $options: 'i' }
                }
            ]
        }
        
        console.log(query.toString());
        ctx.body = await commonutils.searchrecipe(query);
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
                console.log("Vaskar 1 ", err);
                ctx.body = {
                    status: "error",
                    error: "Failed to update!!!Please Try again."
                }
            }
            else {
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
