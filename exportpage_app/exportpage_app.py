from flask import Flask,jsonify, session, redirect, url_for, escape, request
from flask_restful import Resource, Api
from flask.ext.pymongo import PyMongo
    
app = Flask(__name__)
api = Api(app)

#============= set session secret_key =============#
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

#============= data base configuration =============#
app.config['MONGO_URI'] = 'mongodb://root:root@exportpage_app_local:27017/exportpagedb'
app.config['MONGO_DBNAME'] = 'exportpagedb'

mongo = PyMongo(app, config_prefix='MONGO')



def addUser(login, password):
	users = mongo.db.users
	users.insert({'login': login, 'password': password})

def checkUserExsting(login):
	users = mongo.db.users
	exist = users.find_one({'login': login})
	if not exist:
		return True
	return False

class SignUp(Resource):
    def post(self):
    	login = request.json['login']
    	password = request.json['password']

    	if checkUserExsting(login):
    		addUser(login, password)
    		return {'msg': 'ok'}
    	return {'msg': 'exist'}




def checkAcces(login, password):
	users = mongo.db.users
	exist = users.find_one({'login': login, 'password': password})
	if exist:
		return True
	return False

class SignIn(Resource):
    def post(self):
    	login = request.json['login']
    	password = request.json['password']

    	if checkAcces(login, password):
    		session['login'] = login
    		return {'logged': 'ok'}
    	return {'logged': 'not'}




def checkLogged():
	if 'login' in session:
		return True
	return False

class Home(Resource):
    def get(self):
    	if checkLogged():
    		return {'logged': 'ok','user': session['login']}
    	return {'logged': 'not'}



class LogOut(Resource):
    def get(self):
    	if 'login' in session:
    		session.pop('login', None)
    		return {'logout': 'ok'}
    	return {'logout': 'not'}

def addPage(user, url, page):
	exportedpage = mongo.db.exportedpage
	exportedpage.insert({'user': user, 'url': url, 'page': page})

class ExportPage(Resource):
    def post(self):
    	user = session['login']
    	url = request.json['url']
    	page = request.json['page']

    	addPage(user,url ,page)

    	return {'inserted': 'ok'}




api.add_resource(SignUp, '/signup')
api.add_resource(SignIn, '/signin')
api.add_resource(Home, '/home')
api.add_resource(LogOut, '/logout')
api.add_resource(ExportPage, '/sendpage')

if __name__ == '__main__':
    app.run(debug=True)
