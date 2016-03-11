[![Build Status](https://travis-ci.org/mereckaj/CS4098-Group-E.svg?branch=master)](https://travis-ci.org/mereckaj/CS4098-Group-E)
# Group E (I don't think we have a name (idtwhan))

## Table of Contents  
1. [About](#about)  
2. [Issues](#issues)  
3. [Install](#install)
4. [Launch](#launch)
5. [Test](#test)
6. [Clean](#clean)
7. [External Dependencies](#deps)
8. [Features](#features)
	1. [Editor](#f1)
    2. [Syntax Analysis](#f2)
    3. [Authentication 3rd party (Facebook and Google)](#f3)
    4. [Authentication (without SSL)](#f4)
    5. [Syntax highlights](#f5)
    6. [Code keyword completion](#f6)
    7. [Resource name completion](#f7)
    7. [Key-bind emulation (vim,emcas)](#f8)
    9. [Persistent storage of user preferences](#f9)
    10. [File saving and deletion](#f10)
    11. [File uploading](#f11)
    12. [Resource Flow](#f12)
    13. [Flow graphs](#f13)
    14. [Analysis Coloured Actions](#f14)
9. [Members](#members)

<a name="about"></a>
## About
### Web-based IDE for PML.
PML is a simple programming language for describing a work flow or process that specifies the activities and roles involved in delivering some tangible outcome.

<a name="issues"></a>
## Issues

1. Emacs auto complete does not work
2. Vim auto-compelte works with Ctrl-space in insert mode (Not Ctrl-P/Ctrl-N as the key-binds file suggests)


<a name="install"></a>
## Install

Run the following script in your terminal to install, compile and prepare the app and all of the dependencies.
```bash
./install.sh
```
<a name="launch"></a>
## Launch

Run the following command in your terminal to start the application. Once done, navigate to [localhost:8000](localhost:8000) using your browser.
```bash
./start.sh
```

<a name="test"></a>
## Test
### Server Side
To test all of the server side components run the following command in your terminal.
```bash
./test.sh
```

### Client Side
To run all of the client side tests:
1. Start the application
2. Navigate to [localhost:8000](localhost:8000) using your browser
3. Open up your browsers developer console (<b>F12</b> on Firefox/Chrome)
4. In the navigation bar click on <b>Settings</b> -> <b>Run tests</b>

<a name="clean"></a>
## Clean
To reset the project to what it was like after cloning (Basically to undo what install.sh does) run the following command in your terminal.
```bash
./clean.sh
```
<a name="deps"></a>
## External Dependencies

* [PEOS](https://github.com/jnoll/peos) (PML syntax checker and converter to DOT)
* [vis.js](https://github.com/almende/vis/) (DOT parser and graph visualizer)
<a name="features"></a>
## Features

<a name="f1"></a>
1. Editor
    * <b>Description: </b>
        * An area to add your code into.
    * <b>Usage: </b>
        1. Look at the left side of the screen after logging in.

<a name="f2"></a>
2. Syntax Analysis
    * <b>Description: </b>
        * On click ofa button the PML syntax is evaluated and any warnings/errors are shown.
    * <b>Usage: </b>
        1. Type your PML into the editor.
        2. Click the <b>Analyze</b> button below the editor.

<a name="f3"></a>
3. Authentication 3rd party (Facebook and Google)
    * <b>Description: </b>
        * Allow users to register using Facebook and Google accounts.
    * <b>Usage: </b>
        1. Go to main menu.
        2. Click on either the <b>Facebook Login</b> or <b>Google Login</b>
            * If no account is associated with your Facebook/Google accounts it will be created and you will be logged in. If an account is already associated with that email address you will be logged in.

<a name="f4"></a>    
4. Authentication (without SSL)
    * <b>Description: </b>
        * Allow users to register their own accounts and login using email + password combinations.
    * <b>Usage:</b>
        1. Go to main menu
        2. Click <b>Register</b>.
        3. Enter your details.
        4. Click <b>Register</b>.

<a name="f5"></a>
5. Syntax highlights
    * <b>Description: </b>
        * PML keywords are highlighted in the editor.
    * <b>Usage: </b>
        1. Enter some PML code into the editor.
        2. Observe the beautiful highlighting of keywords (process, requires, provides etc.)

<a name="f6"></a>
6. Code keyword completion
    * <b>Description: </b>
        * When using <b>default</b> key-binds keywords can be auto-completed using <b>CTRL + Space</b>
        * [There are some known issues with this feature](#issues)
    * <b>Usage: </b>
        1. Type in the first letter of any keyword (e.g. p for process)
        2. Click <b>CTRL + Space</b> to display a menu in which you will be able select one of the possible keywords.    

<a name="f7"></a>
7. Resource name completion
    * <b>Description: </b>
        * When using <b>default</b> key-binds resource names can be auto-completed using <b>CTRL + Space</b>
        * [There are some known issues with this feature](#issues)
    * <b>Usage: </b>
        1. Type in the first letter of any resource that has already been defined
        2. Click <b>CTRL + Space</b> to display a menu in which you will be able select one of the possible resource names.    

<a name="f8"></a>
8. Key-bind emulation (vim,emcas)
    * <b>Description: </b>
        * Allows changing between Vim, Emacs and default ACE key-binds.
    * <b>Usage: </b>
        1. Login
        2. Click on <b>Settings</b> drop-down menu in the navigation bar.
        3. Select the key-binds you prefer.

<a name="f9"></a>
9. Persistent storage of user preferences (Key binds, font size etc.)
    * <b>Description: </b>
        * Users choice of key-binds and font size are stored persistently
    * <b>Usage: </b>
        1. Login
        2. Change key-binds/font size
        3. Logout and Log back in
        4. Observe that settings still remain.

<a name="f10"></a>
10. File saving and deletion
    * <b>Description: </b>
        * Allows users to save files remotely.
        * Allows users to delete remote files.
    * <b>Usage: Saving</b>
        1. Login
        2. Click <b>File</b> -> <b>Open File</b>
        3. Alternatively, <b>File</b> -> <b>New File</b> -> <b>Save</b>
    * <b>Usage: Deleting</b>
        1. Login
        2. Click <b>File</b> -> <b>Delete Project</b>
        3. Select a file to delete

<a name="f11"></a>
11. File uploading
    * <b>Description: </b>
        * Allows a user to upload local files to be saved and worked on remotely.
    * <b>Usage: </b>
        1. Login
        2. Click <b>File</b> -> <b>Open File</b>
        3. Select your local file
        4. It is now added as a new project

<a name="f12"></a>
12. Resource Flow
    * <b>Description: </b>
        * A flow diagram of the PML code annotated with coloured resource names.
    * <b>Usage: </b>
        1. Login
        2. Enter some PML into the editor
        3. Click <b>Visualize</b> in the navigation bar
        4. Click <b>Standard Flow Graph</b>

<a name="f13"></a>
13. Flow graphs
    * <b>Description: </b>
        * A flow diagram of the PML code
    * <b>Usage: </b>
        1. Login
        2. Enter some PML into the editor
        3. Click <b>Visualize</b> in the navigation bar
        4. Click <b>Standard Flow Graph</b>

<a name="f14"></a>
14. Analysis Coloured Actions
    * <b>Description: </b>
        *  "Miracle" "Black hole" and "Transformer" actions are coloured differently.
    * <b>Usage: </b>
        1. Login
        2. Enter some PML into the editor
        3. Click <b>Visualize</b> in the navigation bar
        4. Click <b>Standard Flow Graph</b>
        5. Look at the legend

<a name="members"></a>
## Members
 * Julius Mereckas
 * Ben Clear
 * Sean Lee
 * Michael Whelan
 * ~~Eoin Higgins~~
