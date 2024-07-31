
XDate
=====

A Modern JavaScript Date Library (circa 2013)

> [!IMPORTANT]
> This package is no longer actively maintained
> ([blog post](https://arshaw.com/2013/03/xdate-08-and-future-development)).
> We recommend using [temporal-polyfill](https://www.npmjs.com/package/temporal-polyfill) instead.
> It is written by the same author and implements the new standard for JavaScript dates.

XDate is a thin wrapper around JavaScript's native
[Date](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date)
object and provides enhanced functionality for parsing, formatting, and manipulating dates.
It implements the same methods as the native Date, so it should seem very familiar.

Also, it is non-destructive to the DOM, so it can safely be included in third party libraries
without fear of side effects.

Installation:

```
npm install xdate
```

```js
var XDate = require('xdate')
var d = new XDate()
```
