// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/prices/penguins',
        destination: 'https://data.rarity.tools/prices/pudgypenguins'
      },
      {
        source: '/prices/coolcats',
        destination: 'https://data.rarity.tools/prices/cool-cats-nft'
      },
      {
        source: '/prices/kia',
        destination: 'https://data.rarity.tools/prices/koala-intelligence-agency'
      },
      {
        source: '/prices/seals',
        destination: 'https://data.rarity.tools/prices/sappy-seals'
      },
      {
        source: '/prices/bayc',
        destination: 'https://data.rarity.tools/prices/boredapeyachtclub'
      },
      {
        source: '/prices/mayc',
        destination: 'https://data.rarity.tools/prices/mutant-ape-yacht-club'
      },
      {
        source: '/PUDGY',
        destination: '/'
      },
      {
        source: '/KIA',
        destination: '/'
      },
      {
        source: '/SAPPY',
        destination: '/'
      },
      {
        source: '/COOLCATS',
        destination: '/'
      },
      {
        source: '/BAYC',
        destination: '/'
      }
    ]
  },
  //Incomeing Request
  async headers() {
    return [
      {
        // matching all API routes
        source: "/prices/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
};
