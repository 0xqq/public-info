!function ($, base, layer) {
    let api = {
        test: '/login/findUserInfo'
    }
    $.http = {
        /**
         * post请求
         * @param api  接口
         * @param data 接口参数
         * @param loadStatus 加载动画显示关闭控制
         * @returns {*}
         */
        $post({api, data = {}, loadStatus = {}}) {
            let {openLoading = 1, closeLoading = 1} = loadStatus
            let loading = null
            let $q = $.Deferred()
            $.extend(data, {APP_URL: base.apiUrl + api})
            $.ajax({
                url: base.env === 'development' ? '/api' : base.apiUrl + api,
                method: 'post',
                data,
                /**
                 * 成功返回回掉
                 * @param res
                 * @param status
                 * @param xhr
                 */
                success(res, status, xhr) {
                    $q.resolve(res, loading)
                },
                /**
                 * 异常返回回掉
                 * @param xhr
                 * @param status
                 * @param err
                 */
                error(xhr, status, err) {
                    layer.msg('接口返回异常，请稍后再试！')
                    $q.reject(err, loading)
                },
                /**
                 * 发送请求前
                 * @param xhr
                 */
                beforeSend(xhr) {
                    openLoading && (loading = layer.load(1, {shade: [0.2, '#000']}))
                },
                /**
                 * 请求返回后回掉 -- 失败和成功都进入这里
                 * @param xhr
                 * @param TS
                 */
                complete(xhr, TS) {
                    closeLoading && layer.close(loading)
                },
                dataType: 'json'
            })

            return $q.promise()
        },
        /**
         * 同时多个请求
         * @param params
         * @param callback
         */
        supervene(params, callback) {
            let i = 0, l = params.length, responses = [], loadings = [],
                loadStatus = {openLoading: 1, closeLoading: 0},
                handleRes = (res, loading) => {
                    responses.push(res)
                    loadings.push(loading)
                    if (responses.length === l) {
                        $.each(loadings, (i, item) => {
                            if (item !== null) {
                                layer.close(item)
                                return false
                            }
                        })
                        callback(responses)
                    }
                }
            while (i < l) {
                if (i !== 0) {
                    loadStatus.openLoading = 0
                }
                this
                    .$post({
                        api: params[i].api,
                        data: params[i].data,
                        loadStatus
                    })
                    .done((res, loading) => handleRes(res, loading))
                    .fail((res, loading) => handleRes(res, loading))
                i++
            }
        },
        /**
         * 测试
         */
        test(callback) {
            this
                .$post({api: api.test, data: {userId: '071495'}})
                .done(res => callback(res))
        }
    }

}(jQuery, BASE, layer)