@login_manager.user_loader
def load_user(userid):
	user = User.query.get(int(userid))
	if user:
		return user

@facebook.tokengetter
def get_facebook_oauth_token():
	return session.get('oauth_token')