module.exports = {
  networks: {
    azure :{
        host: "xxx.westeurope.cloudapp.azure.com",
        port: 8545,
        network_id: "10101010"
    },
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*"
    }
  }
};
