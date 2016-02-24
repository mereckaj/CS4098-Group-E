# A web-based IDE for PML.

[![Build Status](https://travis-ci.org/mereckaj/CS4098-Group-E.svg?branch=master)](https://travis-ci.org/mereckaj/CS4098-Group-E)

PML is a simple programming language for describing a work flow or process that specifies the activities and roles involved in delivering some tangible outcome.

This project is going to create a web based IDE for PML.

Features
--------
1. Editor
2. Syntax Analysis 
3. Authentication 3rd party (Facebook and Google)
4. Authentication (without SSL)
5. Syntax highlights
6. Code keyword completion 
7. Resource name completion
8. Added keybind emulation (vim,emcas)

Install
-------

To install everything that is needed for this program run:
```bash
./install.sh
```
Dependencies
------------

* [PEOS](https://github.com/jnoll/peos) (PML syntax checker)
* [ACE](https://github.com/ajaxorg/ace-builds) (Ace editor)


Launch
------

Run the command bellow, open up your browser and navigate to localhost:8000
```bash
./start.sh
```

Terminate
---------
```bash
CTRL + C
```

Test
----
Run all tests as so:
```bash
./test.sh
```

### Group E
 * Julius Mereckas
 * Ben Clear
 * Sean Lee
 * Michael Whelan
 * Eoin Higgins
