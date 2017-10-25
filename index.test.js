'use strict';

const sut = require('./index.js');

describe('#default args', () => {
    let parse;

    beforeEach(() => {
        parse = sut();
    });

    it('Should replace digits', () => {
        expect(parse('/url')).toEqual('/url');
        expect(parse('/url/12345')).toEqual('/url/*');
        expect(parse('/url/12345/')).toEqual('/url/*/');
        expect(parse('/url/12345/abc')).toEqual('/url/*/abc');
        expect(parse('/url/12345/abc/')).toEqual('/url/*/abc/');
    });

    it('Should replace UUIDs', () => {
        expect(parse('/url')).toEqual('/url');
        expect(parse('/url/123e4567-e89b-12d3-a456-426655440000')).toEqual('/url/*');
        expect(parse('/url/123e4567-e89b-12d3-a456-426655440000/abc')).toEqual('/url/*/abc');
    });

});

describe('#custom matchers', () => {
    it('Should test upper-cased hex strings', () => {
        const parse = sut({
            matchers: [sut.getBuiltInMatchers().hexUppercase]
        });

        expect(parse('/url')).toEqual('/url');
        expect(parse('/url/DEADBEEF')).toEqual('/url/*');
        expect(parse('/url/DEADBEEF/abc')).toEqual('/url/*/abc');

        expect(parse('/url/deadbeef/abc')).toEqual('/url/deadbeef/abc');
    });

    it('Should test lower-cased hex strings', () => {
        const parse = sut({
            matchers: [sut.getBuiltInMatchers().hexLowercase]
        });

        expect(parse('/url')).toEqual('/url');
        expect(parse('/url/deadbeef')).toEqual('/url/*');
        expect(parse('/url/deadbeef/abc')).toEqual('/url/*/abc');
        
        expect(parse('/url/DEADBEEF/abc')).toEqual('/url/DEADBEEF/abc');
    });

    it('Should test an arbitrary regex', () => {
        const parse = require('url-id-replace')({
            matchers: [/^ITEM-\d*$/]
        });

        expect(parse('/url')).toEqual('/url');
        expect(parse('/url/ITEM-123')).toEqual('/url/*');
        expect(parse('/url/ITEM-123/abc')).toEqual('/url/*/abc');
    });

});

describe('#custom placeholder', () => {
    it('Should replace matches with the given string', () => {
        const parse = sut({
            placeholder: 'X'
        });

        expect(parse('/url')).toEqual('/url');
        expect(parse('/url/12345')).toEqual('/url/X');
        expect(parse('/url/12345/')).toEqual('/url/X/');
        expect(parse('/url/12345/abc')).toEqual('/url/X/abc');
        expect(parse('/url/12345/abc/')).toEqual('/url/X/abc/');

    });
});

describe('#getBuiltInMatchers', () => {
    it('Should get all the built-in masks', () => {
        const matchers = sut.getBuiltInMatchers();
        expect(matchers.digits).toBeInstanceOf(RegExp);
        expect(matchers.hexLowercase).toBeInstanceOf(RegExp);
    });

    it('Should return a new copy of the masks each time', () => {
        const matchers = sut.getBuiltInMatchers();
        matchers.digits = 'garbage';
        expect(sut.getBuiltInMatchers().digits).toBeInstanceOf(RegExp); // Should be unchanged
    });
});