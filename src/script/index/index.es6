!function ($) {
    /* 点击左侧边a标签 */
    $('#left-side, #right-side').on('click', 'a', function () {
        let $this = $(this),
            left,
            id = $this.parents('ul').attr('id'),
            w = 275, // 弹框宽度
            h = 325  // 弹框高度
        if (id === 'left-side') {
            left = '160px'
        } else if (id === 'right-side') {
            left = `${$.g.cltSize().x - 5 * 2 - 150 - w}px`
        }
        layer.closeAll('page')
        const lIndex = layer.open({
            title: $this.text(),
            type: 1,
            skin: 'layui-layer-rim index-layui-page', // 弹出层自定义类名
            area: [`${w}px`, `${h}px`], // 宽高
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci beatae, excepturi expedita ipsam non optio veniam voluptas! Commodi, magni, perspiciatis.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci beatae, excepturi expedita ipsam non optio veniam voluptas! Commodi, magni, perspiciatis.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci beatae, excepturi expedita ipsam non optio veniam voluptas! Commodi, magni, perspiciatis.',
            anim: 2,
            shade: false,
            offset: ['50%', left]
        })
        layer.style(lIndex, { marginTop: `-${h / 2}px` })
    })

    /* 点击底部a标签 */
    $('#footer').on('click', 'a', function () {
        alert($(this).parent().index())
    })
}(jQuery);