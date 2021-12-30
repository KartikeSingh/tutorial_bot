const { gunzipSync } = require("zlib");
const { XMLParser } = require("fast-xml-parser");
const fetch = require("node-fetch");
const flexsearch = require("flexsearch");
const MDN_BASE_URL = "https://developer.mozilla.org/en-US/docs/";

let sources = {};

module.exports = async () => {
    if (sources.lastUpdated && Date.now() - sources.lastUpdated < 43200000) return sources;

    const res = await fetch("https://developer.mozilla.org/sitemaps/en-us/sitemap.xml.gz");
    if (!res.ok) return sources;

    const sitemap = new XMLParser()
        .parse(gunzipSync(await res.arrayBuffer()).toString())
        .urlset.url.map((entry) => ({
            loc: entry.loc.slice(MDN_BASE_URL.length),
            lastmod: new Date(entry.lastmod).valueOf(),
        }));

    const index = new flexsearch.Index();
    sitemap.forEach((entry, idx) => index.add(idx, entry.loc));

    sources = { index, sitemap, lastUpdated: Date.now() };
    return sources;
}

