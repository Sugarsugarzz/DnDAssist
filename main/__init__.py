from flask import Flask, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect
from flask_login import LoginManager

db = SQLAlchemy()
login_manager = LoginManager()

from main.models import *
from main.auth import auth
from main.chat import chat


@login_manager.user_loader
def load_user(user_id):
    return db.session.query(models.User).filter(models.User.id==user_id).first()


@login_manager.unauthorized_handler
def unauthorized():
    return redirect(url_for('auth.login'))


def create_app():
    """ 创建APP """
    """ 使用flask-sqlalchemy来建立数据库表结构 """
    app = Flask(__name__, template_folder='../templates', static_folder='../static')
    app.debug = True
    # 注册蓝图
    app.register_blueprint(auth)
    app.register_blueprint(chat)
    # 添加配置
    app.config.from_object('main.settings.DebugConfig')
    # 读取配置
    db.init_app(app)
    login_manager.init_app(app)
    CSRFProtect(app)

    return app