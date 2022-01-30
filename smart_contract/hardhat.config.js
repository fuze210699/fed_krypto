//https://eth-ropsten.alchemyapi.io/v2/K0d8VpxRYdAPnEnJ5ndUh3oOgcGJ6j__

require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    ropsten: {
      url: "https://eth-ropsten.alchemyapi.io/v2/K0d8VpxRYdAPnEnJ5ndUh3oOgcGJ6j__",
      accounts: [
        "dc27e41396557a483e3ff83b7aaf3b0e78e01e906613eee11bc02cc63833e2e7",
      ],
    },
  },
};
