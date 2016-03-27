#! /bin/bash

# Required programs
PML=pmlcheck
TRAVERSE=traverse
TRAVERSE_JSON=traverse_json

# Required python
VIEWS=app/main/views.py
CODE_RUN=app/main/runCode.py
MODELS=app/main/models.py
FORMS=app/main/forms.py
MANAGE=manage.py

# Required Javascript
ACE=app/static/src-noconflict
EDITOR_JS=app/static/js/editor.js
ACE_JS=app/static/js/ace.js
VIS_JS=app/static/js/vis.js
VIS_JS=app/static/js/vis.js

# Check if $PML exists otherwise print error message and exit
[ -f $PML ] && echo -e "\t $PML [OK]" || { echo -e "\t $PML [FAIL]"; exit 1;}

# Check if $TRAVERSE exists
[ -f $TRAVERSE ] && echo -e "\t $TRAVERSE [OK]" || { echo -e "\t $TRAVERSE [FAIL]"; exit 1;}
[ -f $TRAVERSE_JSON ] && echo -e "\t $TRAVERSE_JSON [OK]" || { echo -e "\t $TRAVERSE_JSON [FAIL]"; exit 1;}

# Main app files
[ -f $VIEWS ] && echo -e "\t $VIEWS [OK]" || { echo -e "\t $VIEWS [FAIL]"; exit 1;}
[ -f $CODE_RUN ] && echo -e "\t $CODE_RUN [OK]" || { echo -e "\t $CODE_RUN [FAIL]"; exit 1;}
[ -f $MODELS ] && echo -e "\t $MODELS [OK]" || { echo -e "\t $MODELS [FAIL]"; exit 1;}
[ -f $FORMS ] && echo -e "\t $FORMS [OK]" || { echo -e "\t $FORMS [FAIL]"; exit 1;}
[ -f $EDITOR_JS ] && echo -e "\t $EDITOR_JS [OK]" || { echo -e "\t $EDITOR_JS [FAIL]"; exit 1;}
[ -f $ACE_JS ] && echo -e "\t $ACE_JS [OK]" || { echo -e "\t $ACE_JS [FAIL]"; exit 1;}
[ -f $ACE_JS ] && echo -e "\t $ACE_JS [OK]" || { echo -e "\t $ACE_JS [FAIL]"; exit 1;}
[ -f $MANAGE ] && echo -e "\t $MANAGE [OK]" || { echo -e "\t $MANAGE [FAIL]"; exit 1;}

# Check if Ace folder exists (Too many files to check)
[ -d $ACE ] && echo -e "\t $ACE [OK]" || { echo -e "\t $ACE [FAIL]"; exit 1;}
