const fs = require('fs');
const { create } = require('xmlbuilder2');

// List all your routes manually (or import from a routes config)
const routes = [
  '/',
  '/about',
  '/contact',
  '/free-compound-interest-calculator',
  '/privacy-policy',
  
];

// Create sitemap XML
const root = create({ version: '1.0', encoding: 'UTF-8' })
  .ele('urlset', {
    'xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    'xsi:schemaLocation': 'http://www.s3.amazonaws.com/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd'
  });

routes.forEach(route => {
  root
    .ele('url')
      .ele('loc').txt(`https://www.freecompoundinterest.com${route}`).up()
      .ele('changefreq').txt('monthly').up()
      .ele('priority').txt(route === '/' ? '1.0' : '0.8').up()
    .up();
});

// Convert to string and save
const xml = root.end({ prettyPrint: true });
fs.writeFileSync('./public/sitemap.xml', xml);
console.log('✅ Sitemap generated at public/sitemap.xml');