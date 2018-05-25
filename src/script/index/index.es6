!function ($) {
    /* 点击左侧边a标签 */
    $('#left-side, #right-side').on('click', 'a', function () {
        let $this = $(this), $parent = $this.parent()
        layer.closeAll('page')
        layer.open({
            title: $this.text(),
            type: 1,
            skin: 'index-layui-page', //弹出层自定义类名
            area: ['360px', '255px'], //宽高
            content: 'html内容',
            anim: 3,
            shade: false,
            offset: ['50%', '160px']
        });
    })

    /* 点击底部a标签 */
    $('#footer').on('click', 'a', function () {
        alert($(this).parent().index())
    })
}(jQuery);