from main import db
from flask_login import UserMixin
import hashlib
from datetime import datetime


class User(UserMixin, db.Model):
    """ 用户实体 """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(256), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    avatar_url = db.Column(db.String(256))
    messages = db.relationship('Message', back_populates='author', cascade='all')
    dndcard = db.relationship('DndCard', back_populates='author', cascade='all')

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
        if self.username is not None and self.avatar_url is None:
            self.avatar_url = 'https://gravatar.com/avatar/' + hashlib.md5(self.username.encode('utf-8')).hexdigest() + \
                              '?d=identicon'


class Message(db.Model):
    """ 消息实体 """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    content = db.Column(db.Text, nullable=False)
    create_time = db.Column(db.DateTime, default=datetime.now, index=True)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    author = db.relationship('User', back_populates='messages')


class DndCard(db.Model):
    """ 车卡实体 """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    player_attr_json = db.Column(db.JSON, nullable=False)
    create_time = db.Column(db.DateTime, default=datetime.now, index=True)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    author = db.relationship('User', back_populates='dndcard')
