# History

---

## 0.13.0 / 2015-05-05

- feat(rename): pass file to rename as a first arguments when it's a function

## 0.12.4 / 2015-05-05

- fix: generate hash with .css.js

## 0.12.3 / 2015-05-05

- fix: generate hash with handlebars/tpl/json

## 0.12.2

Fix: crash in windows when import css, Close #35

## 0.12.1

Add styleBox as an option

## 0.12.0

Remove standalone.
Fix(hash): calculate hash on demand

## 0.11.1

Fix(css): dont handle css resources when entry is js file, Fix [spmjs/spm#1206](https://github.com/spmjs/spm/issues/1206)
Fix(css): fix css resources path error

## 0.11.0

Support rename with hash

## 0.10.4

Deps: upgrade father to 0.11

## 0.10.3

Fix(css) don't parse `data:` resources

## 0.10.2

Fix(css) get all local css resources, not just relative resources

## 0.10.1

Get css's image and font resources and push to stream.

## 0.10.0

Get umd variable name from opt.umd

## 0.9.4

Return window.xx if not contain `window.` when global

## 0.9.3

Set global option can replace require('xx') to global variable

## 0.9.2

searequire -> crequire

## 0.9.1

Fixed parse .json, .tpl, .handlebars when it is an entry

## 0.9.0

Package name changed: gulp-transport -> gulp-spm

- set file.base of sub module
- pass file to next stream directly when it's not js or css
- upgrade father@0.10.0
- parse jsx before js by default
- support standalone and umd
- father file can be used from gulp file
- rename gulp-transport -> gulp-spm
- integrate dest into transport
- using global package that need not parse any more
- integrate father into transport

## 0.8.1

Fixed unescape quote when transport tpl

## 0.8.0

- add bench
- skip when file is null
- don't use PluginError
- upgrade gulp and vinyl

## 0.7.2

fix miss import-style when css is required deeply #18

## 0.7.1

fix missing extra dependencies

## 0.7.0

now support require file in package just like node

## 0.6.9

support .html

## 0.6.8

fix ignore package in transportDeps when fileInfo.ignore

## 0.6.7

if package is not existed, fileInfo.ignore will be true 

## 0.6.6

- improve rename
- return package name when package is ignore

## 0.6.5

- fix dest plugin when rename
- improve fileInfo return [originPath, path, pkg]

## 0.6.4

can transport the dependencies of the package

## 0.6.3

remove dest plugin in from transport

## 0.6.2

fix dest position

## 0.6.1

- fix extendOption when empty string
- opt.stream's value should be function
- add dest plugin

## 0.6.0

- big change, transport stream wrapped
- upgrade searequire@1.5.0

## 0.5.5

fix ignore in handlebars spmjs/spm#831

## 0.5.4

fix idleading exception

## 0.5.3

fix win path in getFileInfo spmjs/spm#815

## 0.5.2

add styleBox option

## 0.5.1

fix ie hack when css2js

## 0.5.0

- idleading support function
- change .css -> .css.js
- remove css comment
- support require directory

## 0.4.7

- update npmignore
- exports jsParser

## 0.4.6

fix windows path

## 0.4.5

- stop parsing dependencies when have been ignore
- ignore condition before package check
- throw when rename error
- replace ignore comment

## 0.4.4

fix quote bug in handlebar and tpl

## 0.4.3

handlebars -> handlebars-runtime

## 0.4.2

rollback: addExt: a.css -> a.css.js

## 0.4.1

- PluginError miss argument
- fix addExt: a.css -> a.css.js

## 0.4.0

- upgrade css-import@0.2.0
- transport relative id into complete id by transportId
- more testcase form cssParser

## 0.3.5

fix generateId when set base

## 0.3.4

util.replaceSuffix -> util.rename

## 0.3.3

don't modify origin option

## 0.3.2

add suffix option

## 0.3.1

throw when css conflict

## 0.3.0

- add cssParser
- upgrade father
- getId support sub package
- don't return relative path in dependent package

## 0.2.0

exports other parser as plugins, in parser folder

## 0.1.0

First commit
