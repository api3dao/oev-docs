module.exports = [
  {
    text: 'Overview',
    link: '/dapps/',
  },
  {
    text: 'Quickstart',
    link: '/dapps/quickstart/',
  },
  {
    text: 'Integration',
    collapsed: false,
    items: [
      { text: 'Using Api3 Market', link: '/dapps/integration/' },
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
      {
        text: 'Security considerations',
        link: '/dapps/integration/security-considerations',
      },
      {
        text: 'Old integrations',
        link: '/dapps/integration/old-integrations',
      },
    ],
  },
  {
    text: 'OEV Rewards',
    collapsed: false,
    items: [
      { text: 'Getting paid', link: '/dapps/oev-rewards/' },
      { text: 'Best practices', link: '/dapps/oev-rewards/best-practices' },
    ],
  },
];
