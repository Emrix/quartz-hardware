const bonjour = require("bonjour")();

module.exports = function startBonjour() {
  return new Promise(resolve => {
    bonjour.find({ type: "thorium-http" }, newService);
    const servers = [];
    // While this code could be adapted to connect to multiple Thorium servers
    // we'll use it to connect to the first one.
    function newService(service) {
      if (
        service.name.indexOf("Thorium") > -1 ||
        service.type === "thorium-http" ||
        service.type === "local"
      ) {
        const ipregex = /[0-2]?[0-9]{1,2}\.[0-2]?[0-9]{1,2}\.[0-2]?[0-9]{1,2}\.[0-2]?[0-9]{1,2}/gi;
        const address = service.addresses.find(a => ipregex.test(a));
        const uri = `http://${address}:${service.port}/client`;
        servers.push({
          name: service.host,
          address,
          port: service.port
        });
        if (servers.length === 1) {
          resolve(servers[0]);
        }
      }
    }
  });
};
