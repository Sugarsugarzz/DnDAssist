from flask import Blueprint
from flask import render_template, flash, redirect, url_for
from flask import request
from flask_login import login_user, logout_user, login_required
from main import models
from main import db
from utils import forms
import hashlib


auth = Blueprint('auth', __name__)


@auth.route('/login', methods=['GET', 'POST'], endpoint='login')
def login():
    """ 登录 """
    if request.method == 'GET':
        return render_template('login.html')
    elif request.method == 'POST':
        form = forms.LoginForm(formdata=request.form)
        if form.validate():
            password_hash = hashlib.md5(form.data['password'].encode('utf-8')).hexdigest()
            # count = db.session.query(models.User).filter(db.and_(models.User.username == form.data['username'],
            #                                                      models.User.password_hash == password_hash)).count()
            user_obj = db.session.query(models.User).filter(db.and_(models.User.username == form.data['username'],
                                                                    models.User.password_hash == password_hash)).first()
            # if count:
            #     return redirect(url_for('chat.chat'))
            if user_obj:
                login_user(user_obj)
                return redirect(url_for('auth.index'))
            else:
                flash('用户名或密码错误。')
                return redirect(url_for('auth.login'))

        else:
            for error in form.errors:
                flash(form.errors[error][0])
            return redirect(url_for('auth.login'))


@auth.route('/register', methods=['GET', 'POST'], endpoint='register')
def register():
    """ 注册 """
    if request.method == 'GET':
        return render_template('register.html')
    elif request.method == 'POST':
        form = forms.RegisterForm(formdata=request.form)
        if form.validate():
            count = db.session.query(models.User).filter(db.or_(models.User.username == form.data['username'])).count()
            if count:
                flash('用户名已存在。')
                return redirect(url_for('auth.register'))
            else:
                password_hash = hashlib.md5(form.data['password'].encode('utf-8')).hexdigest()
                db.session.add(models.User(username=form.data['username'],
                                           password_hash=password_hash))
                db.session.commit()
                db.session.close()
                flash('注册成功！')
                return redirect(url_for('auth.login'))

        else:
            for error in form.errors:
                flash(form.errors[error][0])
            return redirect(url_for('auth.register'))


@login_required
@auth.route('/logout', methods=['GET', 'POST'], endpoint='logout')
def logout():
    """ 登出 """
    logout_user()
    return redirect(url_for('auth.login'))


@login_required
@auth.route('/', methods=['GET', 'POST'], endpoint='index')
def index():
    """ 首页 """
    return render_template('index.html')