/**
 * See /dev/axios-scripts.md
 */

const axios = require('axios');
const fs = require('fs');
const CHAINS = require('@api3/chains').CHAINS;

/**
 * Builds the list of chains for /dapis/reference
 */
async function dapiChains() {
  const repo = await axios.get(
    'https://raw.githubusercontent.com/api3dao/contracts/main/deployments/addresses.json'
  );
  const repoData = repo.data;

  let list = {};
  Object.entries(CHAINS).forEach((element) => {
    const id = element[1].id;
    const chain = CHAINS.find((x) => x.id === id);

    const contractList = {
      Api3ServerV1: repoData.Api3ServerV1[id],
      AccessControlRegistry: repoData.AccessControlRegistry[id],
      OwnableCallForwarder: repoData.OwnableCallForwarder[id],
      ProxyFactory: repoData.ProxyFactory[id],
      Api3Market: repoData.Api3Market[id],
    };

    if (contractList.Api3Market) {
      list[chain.alias] = {
        id: id,
        alias: chain.alias,
        name: chain.name,
        nativeToken: chain.symbol,
        testnet: chain.testnet,
        explorerUrl: chain.explorer.browserUrl,
        contracts: contractList,
      };
    }
  });

  fs.writeFileSync(
    'docs/dapis/reference/chains/chains.json',
    JSON.stringify(list)
  );
}

/**
 * Build the list of contract addresses for multiple
 * chains for the Airnode docset, and for each version.
 * @param {*} contractName
 * @param {*} url
 * @param {*} path
 */
async function airnodeContractAddresses(contractName, url, path) {
  try {
    const response = await axios.get(url);
    const obj = response.data;

    let arr = [];
    Object.keys(obj[contractName]).forEach((key) => {
      // Get the chain obj from @api3/chains. If undefined is returned then skip
      // the ID as it is no longer be available such as Rinkeby.
      const c = CHAINS.find((chain) => chain.id == key) || undefined;
      if (c) {
        arr.push({
          id: key,
          fullname: c.name,
          alias: c.alias,
          contractName: contractName,
          contractAddress: obj[contractName][key],
        });
      }
    });

    fs.writeFileSync(
      'docs' + path + 'src/' + contractName + '.json',
      JSON.stringify(arr)
    );
  } catch (err) {
    console.error(
      `Error: ${contractName}
      failed to write file for path: ${path}
      from repo ${url}
      ${err.message}`
    );
    console.log('------------------');
  }
}

/* Start the script here */
console.log('\n----- Building Axios based script files -----');

console.log('> Building chains.json in docs/dapis/reference/chains/');
dapiChains();

console.log('------------------');
