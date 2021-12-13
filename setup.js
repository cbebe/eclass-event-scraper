const fs = require("fs");
const { getFromPrompt, passwordPrompt } = require("./getFromPrompt");
require("dotenv").config({ path: ".env.example" });

const credentialsProperties = {
  ECLASS_URL: {
    description: `Enter eClass URL (default: ${process.env.ECLASS_URL}):`,
  },
  CCID: { description: "Enter your CCID:" },
};

async function queryAskPass() {
  const { askpass } = await getFromPrompt({
    properties: {
      askpass: { description: "Ask for password every time? [y/N]" },
    },
  });
  return askpass[0] === "y";
}

async function main() {
  const askPass = await queryAskPass();
  if (!askPass) {
    credentialsProperties.PASSWORD = passwordPrompt;
  }

  const credentials = await getFromPrompt({
    properties: credentialsProperties,
  });

  const envVars = {
    CCID: credentials.CCID,
    PASSWORD: credentials.PASSWORD || "",
    ECLASS_URL: credentials.ECLASS_URL || process.env.ECLASS_URL,
  };

  fs.writeFileSync(
    ".env",
    Object.entries(envVars)
      .map(([k, v]) => `${k}=${v}`)
      .join("\n")
  );
}

main().catch((e) => console.error(e.message));
