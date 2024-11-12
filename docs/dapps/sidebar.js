module.exports = [
  {
    text: 'Overview',
    link: '/dapps/overview/',
  },
  {
    text: 'Quickstart',
    link: '/dapps/quickstart/',
  },
  {
    text: 'Integration',
    collapsed: false,
    items: [
      { text: 'Using API3 Market', link: '/dapps/integration/' },
      {
        text: 'Contract integration',
        link: '/dapps/integration/contract-integration',
      },
      {
        text: 'AggregatorV2V3Interface',
        link: '/dapps/integration/aggregatorv2v3interface',
      },
      {
        text: '@api3/contracts',
        link: '/dapps/integration/api3-contracts',
      },
    ],
  },
];
