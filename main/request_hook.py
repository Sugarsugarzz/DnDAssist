from flask_wtf.csrf import generate_csrf
from app import app


@app.after_request
def after_request(response):
    # 生成csrf_token
    csrf_token = generate_csrf()
    # 通过 cookie 传值到前端
    response.set_cookie("csrf_token", csrf_token)
    return response