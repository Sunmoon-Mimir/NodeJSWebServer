$(function () {
    //用户名校验
    // $('#userName').blur(function () {
    //     let username = this.value;
    //     let emailRegex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/;
    //     if (!emailRegex.test(username)) {
    //         $('#emailTip').css({ display: 'block' });
    //     } else {
    //         $('#emailTip').css({ display: 'none' });
    //         $.post("/api/user/exists",
    //             { username: username },
    //             function (result) {
    //                 if (result.code !== 200) {
    //                     $('#userNameTip').css({ display: 'block' });
    //                 } else {
    //                     $('#userNameTip').css({ display: 'none' });
    //                 }
    //             });
    //     }
    // })
    //密码校验
    $('#password').blur(function () {
        let password = this.value;
        let passwordRegex = /^[a-zA-Z0-9]{6,16}$/;
        if (!passwordRegex.test(password)) {
            $('#passwordTip').css({ display: 'block' });
        } else {
            $('#passwordTip').css({ display: 'none' });
        }
    })
    //二次密码校验
    $('#repPwd').blur(function () {
        if ($('#password').val() !== this.value) {
            $('#reprtitionTip').css({ display: 'block' });
        } else {
            $('#reprtitionTip').css({ display: 'none' });
        }
    })

    //提交前校验
    $("input[type='submit']").click(function (event) {
        if (!$('#userName').val() || !$('#password').val() || !$('#repPwd').val()) {
            alert('未录入完整信息');
            event.preventDefault();
        }
    }
    )
})