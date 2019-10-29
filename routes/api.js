const Router = require("koa-router");
const router = Router({
    prefix: '/recipe'
});
const recipe = require("../models/recipe");

var ObjectId = require('mongodb').ObjectID;

// Get Recipe 
router.get("/", async ctx => {
    ctx.body = await getData();
});

function getData() {
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
            else
                {
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
