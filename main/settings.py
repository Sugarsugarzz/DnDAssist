import pymysql


class DebugConfig():
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:123456@127.0.0.1:3306/dnd'
    SECRET_KEY = 'dnd'