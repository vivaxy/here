# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.4.1](https://github.com/vivaxy/here/compare/v3.4.0...v3.4.1) (2021-02-07)


### Bug Fixes

* **deps:** update dependency commander to v7 ([342a2bb](https://github.com/vivaxy/here/commit/342a2bb9a3552a692a78479c6c61cfc04acb0ff2))
* **deps:** update dependency koa-compress to v4 ([a74ddd4](https://github.com/vivaxy/here/commit/a74ddd4b2bad0aa74a4ecf663289cdf3d43633c1))
* **deps:** update dependency koa-router to v8 ([27ceb5d](https://github.com/vivaxy/here/commit/27ceb5db4103afe28863a5a58e2ac85df8c2b1a3))
* **deps:** update dependency mime to v2 ([af7298d](https://github.com/vivaxy/here/commit/af7298dcf13bbe2192c56d62ae840d12657af4d4))
* :bug: fix file mime and commander options ([e419d5f](https://github.com/vivaxy/here/commit/e419d5f1662c55eae0cadc182d890ac0c22c24a6))

<a name="3.4.0"></a>
# [3.4.0](https://github.com/vivaxy/here/compare/v3.3.0...v3.4.0) (2019-07-10)


### Features

* **file explorer:** :sparkles: add Access-Control-Allow-Origin * for all files ([787cae9](https://github.com/vivaxy/here/commit/787cae9))



<a name="3.3.0"></a>
# [3.3.0](https://github.com/vivaxy/here/compare/v3.2.2...v3.3.0) (2018-10-12)


### Features

* **gzip:** :sparkles:Support gzip compression ([1fb8732](https://github.com/vivaxy/here/commit/1fb8732))
* Drop support for node.js v6 and v7 ([74c277d](https://github.com/vivaxy/here/commit/74c277d))



<a name="3.2.2"></a>
## [3.2.2](https://github.com/vivaxy/here/compare/v3.2.1...v3.2.2) (2017-12-28)


### Bug Fixes

* :lock:Fix an issue that users can browse outside the wd ([d50c567](https://github.com/vivaxy/here/commit/d50c567)), closes [#16](https://github.com/vivaxy/here/issues/16)



<a name="3.2.1"></a>
## [3.2.1](https://github.com/vivaxy/here/compare/v3.1.0...v3.2.1) (2017-04-11)



# v3.2.0

- support restful API, config same as `koa-router`
- upgrade jade to pug
- update node versions in travis ci
- add verbose log for request method, path and cost time
- fix directory config
- change server response log from debug level to verbose
- add ssl test case
- update readme

# v3.1.0

- add ssl support

# v3.0.1

- remove usage report

# v3.0.0

- rewrite in es6

- use co
