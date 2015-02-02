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

default port is 8080

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

### specify the config file

If this command is not supplied, *here* will look for `here.json` for default config file.

And if this command is not supplied, and `here.json` not exists, *here* will respond with default.

While if this command is supplied, and file specified not exists, *here* will create a sample file and use it.

And if this command is supplied, and file specified exists, *here* will use it.
