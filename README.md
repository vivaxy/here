#serve-*here* [![Build Status](https://travis-ci.org/vivaxy/here.svg?branch=master)](https://travis-ci.org/vivaxy/here)

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
