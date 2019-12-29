# here

![here](./assets/images/here.jpg)

[![Build Status][travis-image]][travis-url]
[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]

Local static server

Everything start from `here`.

Node.js >= 8.0

## Feature

- Look up available port automatically, which means multiple instances without specifying port.

- Custom routes by scripting `here.js`.

- Live reload.

- Support https.

- Add ip address to your server, which makes your server available to other devices.

- Resolve get, post... every method into local files, for ajax.

- Respond files without extension as `application/json` for ajax.

- Open default browser after server launched.

- When the server is on, press `enter` will open the browser.

## Installation

`[sudo] npm install -g @vivaxy/here`

## Usage

In your local folder, type `here` and it goes\!

## Advanced Usage

#### Specify port to 8888

`here -p 8888`

or

`here --port 8888`

Default port is 3000.

#### Switch protocol to https

`here -S`

or

`here --ssl`

#### Open Gzip

`here -G`

or

`here --gzip`

#### Specify server root directory

`here -d test`

or

`here --directory test`

Default directory is `./`.

#### Watch file changes, once files changed, reload pages

`here -w 3`

or

`here --watch`

Default interval is 0 second.

Recommend to set reload interval to page reload time.

#### Do not open the browser

`here -s`

or

`here --silent`

#### Output log

`here -l`

or

`here --log 0`

#### Middleware support

Write `here.js` in server base directory.

```
let db = {
  tobi: {
    name: 'tobi',
    age: 21
  },
  loki: {
    name: 'loki',
    age: 26
  },
  jane: {
    name: 'jane',
    age: 18
  }
};

module.exports = [
  {
    method: 'get',
    path: '/pets',
    data () {
      let names = Object.keys(db);
      return names.map((name) => {
        return db[name];
      });
    }
  },
  {
    method: 'get',
    path: '/pets/:name',
    data () {
      let name = this.params.name;
      let pet = db[name];
      if (!pet) {
        return {
          error: `cannot find pet ${name}`
        };
      } else {
        return pet;
      }
    }
  }
];
```

See [koa-router document](https://github.com/alexmingoia/koa-router#module_koa-router--Router+get%7Cput%7Cpost%7Cpatch%7Cdelete) for more detail.

## Prior Art

- [puer](https://www.npmjs.com/package/puer) not support post, respond files without extension as `application/octet-stream`
- [anywhere](https://www.npmjs.com/package/anywhere) not support post, and not support reload
- [browsersync](http://www.browsersync.io/) not support post, respond files without extension as `application/octet-stream`
- [serve](https://github.com/zeit/serve)

## Change Log

[Change Log](CHANGELOG.md)

## Contributing

[Contributing](CONTRIBUTING.md)

[npm-version-image]: http://img.shields.io/npm/v/@vivaxy/here.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@vivaxy/here
[npm-downloads-image]: http://img.shields.io/npm/dt/@vivaxy/here.svg?style=flat-square
[license-image]: http://img.shields.io/npm/l/@vivaxy/here.svg?style=flat-square
[license-url]: LICENSE
[travis-image]: https://img.shields.io/travis/vivaxy/here.svg?style=flat-square
[travis-url]: https://travis-ci.org/vivaxy/here
