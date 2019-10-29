const Router = require("koa-router");
const router = Router({
    prefix: '/recipe'
});
const recipe = require("../models/recipe");

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

module.exports = router;
