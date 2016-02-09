from flask import Blueprint

# Args: Blueprint name and where it is located
main = Blueprint("main",__name__)

# Import routes from other files (e.g. views.py)
# Don't move this, it should be at the bottom, otherwise there
# could be a problem with circular dependencies. 
from . import views
