'use strict';

const getBuiltInMatchers = () => ({
    digits: /^\d+$/,
    uuid: /^[\da-f]{8}\-[\da-f]{4}\-[\da-f]{4}\-[\da-f]{4}\-[\da-f]{12}$/i,
    hexLowercase: /^[\da-f]{7,}$/,
    hexUppercase: /^[\dA-F]{7,}$/,
    iso8061: /^\d{4}(?:-\d\d(?:-\d\d(?:T\d\d:\d\d(?::\d\d)?(?:\.\d+)?(?:(?:[+-]\d\d:\d\d)|Z)?)?)?)?$/
    // iso8061: /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/
});

const getDefaultMatchers = () => {
    const Matchers = getBuiltInMatchers();
    return [Matchers.digits, Matchers.uuid];
};

const validateOpts = (opts) => {
    const allowedOpts = ['matchers', 'placeholder'];
    Object.keys(opts).forEach((name) => {
        if (allowedOpts.indexOf(name) === -1) {
            throw new Error('Unexpected option: ' + name + 
                '; expected one of ' + JSON.stringify(allowedOpts));
        }
    });
};

function buildParser(opts) {
    opts = opts || {};
    validateOpts(opts);

    const matchers = opts.matchers || getDefaultMatchers();
    const placeholder = opts.placeholder || '*';

    const isMatched = (s) => {
        return matchers.some((matchers) => matchers.test(s));
    }
    
    const parse = (path) => {
        return path
            .split('/')
            .map((chunk) => isMatched(chunk) ? placeholder : chunk)
            .join('/');
    };

    return parse;
}

module.exports = buildParser;
module.exports.getBuiltInMatchers = getBuiltInMatchers;
module.exports.getDefaultMatchers = getDefaultMatchers;