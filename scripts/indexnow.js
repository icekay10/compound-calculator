// pages/sitemap.xml.js
const EXTERNAL_DATA_URL = 'https://www.freecompoundcalculator.com';

function generateSiteMap(paths) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${paths
        .map((path) => {
          return `
            <url>
              <loc>${EXTERNAL_DATA_URL}${path}</loc>
              <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;
}

export async function getServerSideProps({ res }) {
  const paths = [
    "/",
    "/about/",
    "/advanced-calculator/",
    "/basic-calculator/",
    "/contact/",
    "/free-compound-interest-calculator/",
    "/privacy-policy/",
    "/retirement-planner/",
    "/savings-calculator/"
  ];

  const sitemap = generateSiteMap(paths);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

// Rename this to Sitemap (capital S) to match the filename convention
export default function Sitemap() {
  // getServerSideProps will do the heavy lifting
  return null;
}