require("dotenv").config();
const app = require("express")();
const Cors = require("cors");
const BodyParser = require("body-parser");

app.disable("etag");


const Routes = require("./routes");
const db = require("./database/PostgresDb");

app.use(Cors());
app.use(BodyParser.json({ limit: "50mb" }));

app.use(
  BodyParser.urlencoded({
    extended: false
  })
);

app.use("/api", Routes);

// Handles all errors
app.use((err, req, res, next) => {
  try {
    if (process.env.NODE_ENV === "production") {
      console.log("HumanaR-error-logs", err);
      if (err.status === 412 || err.status === "412") {
        return res
          .status(err.status)
          .send({ success: false, message: err.message });
      }
      return res
        .status(err.status || 400)
        .send({ success: false, message: "An error occur" });
    }
    console.log("HumanaR-error-logs", err);
    return res
      .status(err.status || 400)
      .send({ success: false, message: err.message });
  } catch (error) {
    return res
      .status(error.status || 400)
      .send({ success: false, message: error.message });
  }
});

// Not found route
app.use((req, res) => {
  return res.status(404).send({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> console.log(`Server Started on PORT: ${PORT}`));
