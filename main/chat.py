from flask import Blueprint
from flask import render_template, flash, redirect, url_for
from flask import request
from flask_login import login_required, current_user
from main import models
from main import db


chat = Blueprint('chat', __name__)


@login_required
@chat.route('/chat', methods=['GET', 'POST'], endpoint='chat')
def chatroom():
    if request.method == 'GET':
        # 显示历史10条消息
        message_list = db.session.query(models.Message).order_by(models.Message.id).all()
        message_list.reverse()
        message_list = message_list[:99]
        message_list.reverse()
        return render_template('chatroom.html', message_list=message_list)