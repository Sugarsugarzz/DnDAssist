var socket = io('/')

$(function () {
    send()
    get()
    send_dice()
    get_dice()
})

function send() {
    // 点击发送按钮发送消息
    $('#send_button').click(function () {
        var content = $('#text_area').val().trim();
        if (content == "") {

        } else {
            socket.emit('new_message', content);
            $('#text_area').val("")
        }
    })
}

function get() {
    // 将发送的消息显示在页面上
    socket.on('new_message', function (data) {
        $('#message_container').append(data.message_html);
        scrollToEnd();
    })
}

function send_dice() {
    // 发送掷骰子请求
    $('#submit_dice').click(function () {
        var num = parseInt(document.getElementById('dice_number').value.trim())
        if (!isNaN(num)){
            var result = Math.floor(Math.random() * (num - 1)) + 1;
            var jsonObj = {"result_number": result, "max_number": num}
            socket.emit('dice_message', jsonObj)
            $('#dice_number').val("")
            scrollToEnd()
        } else {
            alert('输入的数值不合法，请输入整数。');
        }

    })
}

function get_dice() {
    // 显示掷骰子结果
    socket.on('dice_message', function (data) {
        $('#message_container').append(data.dice_message_html);
        scrollToEnd();
    })

}

function scrollToEnd() {
    // 滚动到底部
    var ele = document.getElementById('message_container')
    ele.scrollTop = ele.scrollHeight;
}

        