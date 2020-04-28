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
        # 加载已配置的人物卡
        card_obj = db.session.query(models.DndCard).filter(
            models.DndCard.author == current_user._get_current_object()).one_or_none()
        card_json = None
        if card_obj:
            card_json = card_obj.player_attr_json
        return render_template('chatroom.html', message_list=message_list, card_json=card_json)


@chat.route('/card', methods=['GET', 'POST'], endpoint='card')
def card():
    if request.method == 'GET':
        card_obj = db.session.query(models.DndCard).filter(
            models.DndCard.author == current_user._get_current_object()).one_or_none()
        card_json = None
        if card_obj:
            card_json = card_obj.player_attr_json
        return render_template('chekaTest.html', card_json=card_json)