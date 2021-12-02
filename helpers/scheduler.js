const agenda = require("./agenda");

exports.ActivateEmail = async ({ email, name }) => {
  
  await agenda.schedule("in 10 seconds ", "sendActivationMail", {
    email, 
    name
  });
};
