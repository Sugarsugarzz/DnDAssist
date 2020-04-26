from app import socketio
from flask_socketio import emit
from flask_login import current_user
from main import models
from main import db
from lxml.html.clean import clean_html
from flask import render_template


@socketio.on('new_message')
def new_message(content):
    """ 消息发送 """
    message = models.Message(author=current_user._get_current_object(), content=clean_html(content))
    db.session.add(message)
    db.session.commit()
    emit('new_message',
         {
             'message_html': render_template('message.html', message=message)
         },
         broadcast=True)


@socketio.on('dice_message')
def dice_message(dice_message_json):
    """ 掷骰子请求 """
    content = str(current_user._get_current_object().username) + ' 掷出了 ' + str(dice_message_json['result_number']) + \
              '（范围 1~' + str(dice_message_json['max_number']) + '）'
    user_system = db.session.query(models.User).filter(db.and_(models.User.username == '系统')).first()
    message = models.Message(author=user_system, content=content)
    db.session.add(message)
    db.session.commit()
    emit('dice_message',
         {
             'dice_message_html': render_template('message_dice.html', message=message)
         },
         broadcast=True)
