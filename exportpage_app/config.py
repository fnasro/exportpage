#============= set session secret_key =============#
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

#============= data base configuration =============#
app.config['MONGO_URI'] = 'mongodb://root:root@exportpage_app_local:27017/exportpagedb'
app.config['MONGO_DBNAME'] = 'exportpagedb'

mongo = PyMongo(app, config_prefix='MONGO')