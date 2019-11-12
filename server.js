// Imports
const Koa = require("koa");
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const logger = require("koa-logger");

// Middlewares
app.use(bodyParser());
app.use(cors());
app.use(logger());

const port=process.env.PORT || 3001

//Error Handling
app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		ctx.status = err.status || 500;
		ctx.body = err.message;
		ctx.app.emit('error', err, ctx);
	}
})

const recipeApi = require('./routes/api');
app.use(recipeApi.routes());

// Listining Port
app.listen(port);

module.exports = app;
console.log(`Starting server at port ${port}`);
