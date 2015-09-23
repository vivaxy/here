#serve-*here*

[![Build Status][travis-image]][travis-url]
[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]
[![Dependency Status][david-image]][david-url]

[![NPM][nodei-image]][nodei-url]

本地静态服务器

## 特点

- 自动切换端口：如果默认的3000端口被占用，会自动寻找另一个可用的端口，本服务器可以起多个实例。

- 自定义路由：用户通过编写 here.js 可以自定义服务器的响应。

- 自动刷新：文件变动后，自动刷新页面。

- 自动打开浏览器：服务启动后，自动打开浏览器，打开首页。

- 同一网段内的设备可以访问服务器：服务带本机 ip。

- 支持post等请求：不区分get，post等请求，统一使用文件内容返回。

- 支持 ajax：将没有后缀的文件响应为`application/json`。

- 服务开启后，在控制台输入回车可以在浏览器中打开服务器首页。

## 安装

`[sudo] npm install -g serve-here`

## 用法

进入项目目录，在控制台输入`here`。

## 高级用法

#### 指定端口 8888

`here -p 8888`

或

`here --port 8888`

默认端口 3000

#### 指定服务的根目录

`here -d test`

或

`here --directory test`

默认根目录`./`

#### 不自动打开浏览器

`here -s`

或

`here --silent`

#### 输出日志

`here -l`

或

`here --log`


#### 开启自动刷新，文件变动后3秒刷新

`here -w 3`

或

`here --watch`

默认刷新间隔0秒

推荐将刷新间隔设置为页面载入的时间。

自动刷新功能不适用于项目下同一时刻改动的文件过多的情况。

#### 自定义路由

在启动服务的目录下新建`here.js`

```
module.exports = function (req, res) {
    // takes node original server arguments
    console.log(req);
    res.end('test');
    // return true , request will continue going to `here` server
    return false;
};

```

## 类似的工具

- [puer](https://www.npmjs.com/package/puer) 不支持`post`，无后缀的文件响应为`application/octet-stream`

- [anywhere](https://www.npmjs.com/package/anywhere) 不支持`post`，不支持自动刷新


[npm-version-image]: http://img.shields.io/npm/v/serve-here.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/serve-here
[npm-downloads-image]: http://img.shields.io/npm/dm/serve-here.svg?style=flat-square
[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: LICENSE
[travis-image]: https://img.shields.io/travis/vivaxy/here.svg?style=flat-square
[travis-url]: https://travis-ci.org/vivaxy/here
[david-image]: http://img.shields.io/david/vivaxy/here.svg?style=flat-square
[david-url]: https://david-dm.org/vivaxy/here
[nodei-image]: https://nodei.co/npm-dl/serve-here.png?height=3
[nodei-url]: https://nodei.co/npm/serve-here/
