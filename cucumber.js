module.exports = {
    default: {
        requireModule: ['ts-node/register'],
        require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
        format: [
            '@cucumber/pretty-formatter',
            'json:reports/cucumber-report.json'
        ],
        formatOptions: {
            snippetInterface: 'async-await',
            colorsEnabled: true
        }
    }
};

