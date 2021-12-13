const prompt = require("prompt");

const passwordPrompt = {
  hidden: true,
  description: "Enter your password:",
};

function getFromPrompt(properties) {
  return new Promise((resolve, reject) => {
    prompt.start();
    prompt.message = "";
    prompt.delimiter = "";
    prompt.get(properties, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

module.exports = { getFromPrompt, passwordPrompt };
