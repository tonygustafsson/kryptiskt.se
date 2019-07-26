const Metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');
const sass = require('metalsmith-sass');
const watch = require('metalsmith-watch');
const canonical = require('metalsmith-canonical');
const sitemap = require('metalsmith-sitemap');
const msIf = require('metalsmith-if');

const pageUrl = 'https://www.blockkedjor.se/';

const productionMode = process.argv[2] === 'build';

if (productionMode) {
    console.log('Building in production mode.');
} else {
    console.log('Building in development mode.');
}

Metalsmith(__dirname)
    .metadata({
        pageTitle: 'Blockkedjor.se',
        pageUrl: pageUrl,
        googleAnalyticsId: 'UA-144587630-1',
        productionMode: productionMode
    })
    .source('./docs')
    .destination('./dist')
    .clean(true)
    .use(markdown())
    .use(
        canonical({
            hostname: pageUrl
        })
    )
    .use(
        layouts({
            engine: 'handlebars'
        })
    )
    .use(
        sass({
            outputStyle: productionMode ? 'compressed' : 'expanded'
        })
    )
    .use(
        msIf(
            !productionMode,
            watch({
                paths: {
                    '${source}/**/*': true,
                    '${source}/styles/**/*': '**/*.scss',
                    'layouts/**/*': '**/*.md'
                },
                livereload: !productionMode
            })
        )
    )
    .use(
        sitemap({
            hostname: pageUrl,
            modifiedProperty: 'modified'
        })
    )
    .build(function(err, files) {
        if (err) {
            throw err;
        }
    });
