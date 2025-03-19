const express = require("express");
const app = express();
const port = 1010;
const morgan = require("morgan");
const { readdirSync } = require("fs");
const cors = require("cors");

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(morgan("dev"));
app.use(cors());

readdirSync("./routes").map((file) =>
  app.use("/api", require("./routes/" + file))
);

app.listen(port, () => {
  console.log(`Server is runing on http://localhost:${port}`);
});
