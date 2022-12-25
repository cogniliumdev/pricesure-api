require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { handelElasticData } = require("./src/helperFunctions/elasticData");

const app = express();
const port = process.env.PORT || 7777;

app.use(cors());
app.use(express.json());

app.post("/elastic-data", async (req, res) => {
    try {
        const result = await handelElasticData(req.body);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
    }
});

app.get("/test", (req, res) => res.status(200).json({ apiRes: "IM GETTING AN API RESPONSE" }));

app.listen(port, () => console.log(`server running at http://localhost:${port}`));

module.exports = app;
