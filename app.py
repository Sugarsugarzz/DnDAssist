from main import create_app, db
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from flask_socketio import SocketIO

# import eventlet
app = create_app()

socketio = SocketIO(app, async_mode='eventlet')
from main.request_hook import *


manager = Manager(app)
migrate = Migrate(app, db)
manager.add_command('db', MigrateCommand)

from main.socketioutils import *


if __name__ == '__main__':
    # 迁移数据库用这个启动
    # manager.run()

    # 启动服务用这个
    socketio.run(app, host='0.0.0.0', port=9999)
