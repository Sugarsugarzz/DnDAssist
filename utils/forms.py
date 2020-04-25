from wtforms import Form
from wtforms.fields import simple, html5
from wtforms import validators
from wtforms import widgets


class LoginForm(Form):
    """ 登录验证 """
    username = simple.StringField(
        validators=[
            validators.DataRequired(message='用户名不能为空。')
        ],
        widget=widgets.TextInput(),
    )
    password = simple.PasswordField(
        validators=[
            validators.DataRequired(message='密码不能为空。'),
            validators.Length(min=4, message='密码长度必须大于%(min)d'),
        ],
        widget=widgets.PasswordInput(),
    )


class RegisterForm(Form):
    """ 注册验证 """
    username = simple.StringField(
        validators=[
            validators.DataRequired(message='用户名不能为空。')
        ],
        widget=widgets.TextInput(),
    )
    password = simple.PasswordField(
        validators=[
            validators.DataRequired(message='密码不能为空。'),
            validators.Length(min=4, message='密码长度必须大于%(min)d'),
        ],
        widget=widgets.PasswordInput(),
    )