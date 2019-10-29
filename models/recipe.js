const mongoose = require("../database/database");

const schema = {
    rcp_id: { type: mongoose.SchemaTypes.Number, required: true },
    rcp_name: { type: mongoose.SchemaTypes.String, required: true },
    rcp_route: { type: mongoose.SchemaTypes.String, required: true }
};

const collectionName = "recipe"; // Name of the collection 
const recipeSchema = mongoose.Schema(schema);
const recipe = mongoose.model(collectionName, recipeSchema);
module.exports = recipe;