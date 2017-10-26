# url-id-replace
Replace things like IDs and other regexes in a URL path with a placeholder

### Sample Usage
```js
const parse = require('url-id-replace')();

console.log(parse('/users/12345')); // /users/*
console.log(parse('/users/123e4567-e89b-12d3-a456-426655440000/')); // /users/*/
```

### Custom Matchers
Custom matchers are regexes that can be specified when the parser is created
```js
const parse = require('url-id-replace')({
    matchers: [/^ITEM-\d*$/]
});
console.log(parse('/items/ITEM-12345/location')); // /items/*/location
console.log(parse('/items/123')); // items/123 -- the default matchers were overwritten
```

This will override the default matchers. The default matchers are still available if you need them:
```js
const urlIdReplace = require('url-id-replace');
const parse = urlIdReplace({
    matchers: urlIdReplace.getDefaultMatchers().concat(/^ITEM-\d*$/)
});
console.log(parse('/items/ITEM-12345/location')); // /items/*/location
console.log(parse('/items/123')); // items/*

```

### Built-in Matchers
A few common matchers are already provided:
```js
const builtInMatchers = urlIdReplace.getBuiltInMatchers();
// Returns an object that looks like this:
{
    digits: /^\d+$/,
    uuid: /^[\da-f]{8}\-[\da-f]{4}\-[\da-f]{4}\-[\da-f]{4}\-[\da-f]{12}$/i,
    hexLowercase: /^[\da-f]{7,}$/,
    hexUppercase: /^[\dA-F]{7,}$/
}
```

### Changing the Placeholder
Instead of `*`, you can specify any string you want to be used for matches:
```js
const parse = require('url-id-replace')({
    placeholder: 'X'
});
console.log(parse('/items/123/location/')); // items/X/location/
```