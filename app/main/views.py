from flask import Flask, render_template, url_for, request, session
from . import main
from .runCode import pmlchecker
from .. import db
from flask_oauthlib.client import OAuth, OAuthException

main.debug = True
main.secret_key = 'development'
oauth = OAuth()

FACEBOOK_APP_ID = '486691024846349'
FACEBOOK_APP_SECRET = '5654dfce0e6167725cf31272545a914e'

facebook = oauth.remote_app(
    'facebook',
    base_url='https://graph.facebook.com/',
    request_token_url=None,
    access_token_url='/oauth/access_token',
    authorize_url='https://www.facebook.com/dialog/oauth',
    consumer_key=FACEBOOK_APP_ID,
    consumer_secret=FACEBOOK_APP_SECRET,
    request_token_params={'scope': 'email'}
)

# Result page
@main.route("/result/",methods=["POST"])
def root_post():
	# Extract the code from the POST request
	code = request.form["code"]

	# Run the code through the pmlheck tool and get the result
	result = pmlchecker(code)
	
	return render_template("pmlcheck_result.html",result=result)
	return session

# Main page
@main.route("/",methods=["GET"])
def root_get():
	return render_template("public_base.html")

# #facebook login page
@main.route('/login')
def login():
    callback = url_for(
        'main.facebook_authorized',
        next=request.args.get('next') or request.referrer or None,
        _external=True
    )
    return facebook.authorize(callback=callback)

@main.route('/login/authorized')
def facebook_authorized():
    resp = facebook.authorized_response()
    if resp is None:
        return 'Access denied: reason=%s error=%s' % (
            request.args['error_reason'],
            request.args['error_description']
        )
    if isinstance(resp, OAuthException):
        return 'Access denied: %s' % resp.message

    session['oauth_token'] = (resp['access_token'], '')
    me = facebook.get('/me')
    return 'Logged in as id=%s name=%s redirect=%s' % \
        (me.data['id'], me.data['name'], request.args.get('next'))


@facebook.tokengetter
def get_facebook_oauth_token():
    return session.get('oauth_token')
