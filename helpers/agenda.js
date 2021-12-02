require("dotenv").config();
const Agenda = require("agenda");


const agenda = new Agenda({
  db: { address: process.env.MONGO_URI, collection: "userAction" },
  processEvery: "20 seconds"
});

agenda
  .on("ready", () => console.log("Agenda started!"))
  .on("error", () => console.log("Agenda connection error!"));

agenda.define("sendActivationMail", async job => {
  const { email, name } = job.attrs.data;
  await EmployeeActionService.suspendEmployeeService({
    email,
    name
  });
});

agenda.start();

module.exports = agenda;
