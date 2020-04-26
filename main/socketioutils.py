from app import socketio
from flask_socketio import emit, send, join_room, leave_room
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
             'dice_message_html': render_template('message_system.html', message=message)
         },
         broadcast=True)


@socketio.on('card_message')
def card_message(card_json):
    """ 配置车卡请求 """
    card_obj = db.session.query(models.DndCard).filter(models.DndCard.author == current_user._get_current_object()).one_or_none()
    if card_obj:
        # 已有车卡，对属性进行修改
        card_obj.player_attr_json = card_json
        db.session.commit()
    else:
        # 用户无车发，新建车卡
        dnd_card = models.DndCard(author=current_user._get_current_object(), player_attr_json=card_json)
        db.session.add(dnd_card)
        db.session.commit()

    emit('card_message',
         {
            'card_json': card_obj.player_attr_json
         },
         broadcast=True)


@socketio.on('join_room')
def on_join(data):
    """ 加入聊天室 """
    room = data['room']
    join_room(room)
    content = str(current_user._get_current_object().username) + ' 进入了房间。'
    user_system = db.session.query(models.User).filter(db.and_(models.User.username == '系统')).first()
    message = models.Message(author=user_system, content=content)
    db.session.add(message)
    db.session.commit()
    emit('join_room',
         {
             'join_message_html': render_template('message_system.html', message=message),
             'room': room
         },
         broadcast=True)
         # room=room)


@socketio.on('leave_room')
def on_leave(data):
    """ 离开聊天室 """
    room = data['room']
    leave_room(room)
    content = str(current_user._get_current_object().username) + ' 离开了房间。'
    user_system = db.session.query(models.User).filter(db.and_(models.User.username == '系统')).first()
    message = models.Message(author=user_system, content=content)
    db.session.add(message)
    db.session.commit()
    emit('leave_room',
         {
             'leave_message_html': render_template('message_system.html', message=message),
             'room': room
         },
         broadcast=True)
         # room=room)


@socketio.on('connect')
def on_connect():
    """ 连接 """
    emit('connect', str(current_user._get_current_object().username),
         broadcast=True)