// Load up the Bonjour client
const getThoriumAddress = require("./helpers/bonjour");
const getClient = require("./helpers/graphqlClient");
const registerClient = require("./helpers/registerClient");
const startApp = require("./app");
const readline = require("readline");

const { keyboardInputId } = require("../config.json");
const { useBonjour } = require("../config.json");
const { serverAddress } = require("../config.json");
const { serverPort } = require("../config.json");

var graphQLClient;

//clientName
module.exports.clientId = keyboardInputId;
const clientId = keyboardInputId;

if (useBonjour) {
	console.log("Activating bonjour browser...");
	getThoriumAddress()
	    .then(({ address, port, name }) => {
	        graphQLClient = getClient(address, port, clientId);
	        console.log("Found Thorium server:");
	        console.log(`Address: ${address}:${port} ${name}`);

	        startApp(address, port, clientId);
	    })
	    .catch(err => {
	        console.error("An error occured");
	        console.error(err);
	    });
} else {
        graphQLClient = getClient(serverAddress, serverPort, clientId);
        console.log("Found Thorium server:");
        console.log(`Address: ${serverAddress}:${serverPort} Manual`);

        startApp(serverAddress, serverPort, clientId);
}

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', function(line) {
    //    console.log(JSON.stringify(registerClient.availcds));
    let keyCaptureData = JSON.parse(line);
    let meta = [];
    let mutationData = {};



    for (let objectKey in keyCaptureData) {
        if (objectKey != "scanCode") {
            if (keyCaptureData[objectKey] == true)
                meta.push(objectKey);
        }
    }

    console.log("simulatorId: " + startApp.simID);
    console.log("id: " + startApp.kbID);
    console.log("key: " + keyCaptureData.scanCode);
    console.log("meta: " + meta);

    mutationData["simulatorId"] = startApp.simID;
    mutationData["id"] = startApp.kbID;
    mutationData["key"] = keyCaptureData.scanCode;
    mutationData["meta"] = meta;



    const MUTATION = `
mutation TriggerKeyAction(
  $simulatorId: ID!
  $id: ID!
  $key: String!
  $meta: [String]!
) {
  triggerKeyboardAction(
    simulatorId: $simulatorId
    id: $id
    key: $key
    meta: $meta
  )
}`;

    graphQLClient
        .query({ query: MUTATION, variables: mutationData })
        .then(() => {
            console.log("Sent");
        });
})
