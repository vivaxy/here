#serve-*here*

[![NPM version][npm-version-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-url] [![MIT License][license-image]][license-url] [![Build Status][travis-image]][travis-url]

local static server

## installation

`sudo npm install -g serve-here`

## usage

In your local folder, type `here` and it goes\!

## advanced usage

#### specify port to 8888

`here -p 8888`

or

`here --port 8888`

default port is 3000

#### specify server root directory

`here -d test`

or

`here --directory test`

default directory is ./

#### do not open the browser

`here -s`

or

`here --silent`

#### verbose log

`here -v`

or

`here --verbose`


[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[npm-url]: https://www.npmjs.com/package/serve-here
[npm-version-image]: http://img.shields.io/npm/v/serve-here.svg?style=flat
[npm-downloads-image]: http://img.shields.io/npm/dm/serve-here.svg?style=flat

[travis-url]: https://travis-ci.org/vivaxy/here
[travis-image]: https://travis-ci.org/vivaxy/here.svg?branch=master
