/* 挂载在jq上常用方法 */
!function ($, window) {
    $.g = {
        /**
         * 格式化日期
         * @param date
         * @param fmt 格式化规则，如 YYYY-MM-DD HH:mm:ss
         * @returns {*}
         */
        formatDate(date, fmt) {
            if (!date) {
                return ''
            }
            date = new Date(date)
            if (isNaN(date)) {
                return ''
            }
            fmt = fmt || 'YYYY-MM-DD HH:mm:ss'
            let o = {
                'Y+': String(date.getFullYear()),
                'M+': String(date.getMonth() + 1),
                'D+': String(date.getDate()),
                'H+': String(date.getHours()),
                'm+': String(date.getMinutes()),
                's+': String(date.getSeconds())
            }
            for (let key in o) {
                fmt = fmt.replace(new RegExp(key), e => /Y+/i.test(key) ? o[key].slice(-1 * e.length) : (e.length > o[key].length ? '0' + o[key] : o[key]))
            }
            return fmt
        },
        /**
         * 深拷贝
         * @param h
         * @returns {*}
         */
        extendDeep(h) {
            var temp, key
            var paramsType = this.type(h)
            if (paramsType === 'array' || paramsType === 'object') { // 传入的数据为数组或对象
                temp = paramsType === 'array' ? [] : {}
                for (key in h) {
                    temp[key] = typeof h[key] === 'object' ? this.extendDeep(h[key]) : h[key]
                }
            } else if (paramsType === 'date') { // 日期对象
                temp = new Date(new Date(h).getTime())
            } else { // 其他的默认直接返回
                temp = h
            }
            return temp
        },
        /**
         * 判断两个对象内容是否相同
         * @param x
         * @param y
         * @returns {boolean}
         */
        isEqual(x, y) {
            // If both x and y are null or undefined and exactly the same
            if (x === y) {
                return true
            }
            // If they are not strictly equal, they both need to be Objects
            if (!(x instanceof Object) || !(y instanceof Object)) {
                return false
            }
            // They must have the exact same prototype chain,the closest we can do is
            // test the constructor.
            if (x.constructor !== y.constructor) {
                return false
            }
            for (var p in x) {
                // Inherited properties were tested using x.constructor === y.constructor
                if (x.hasOwnProperty(p)) {
                    // Allows comparing x[ p ] and y[ p ] when set to undefined
                    if (!y.hasOwnProperty(p)) {
                        return false
                    }
                    // If they have the same strict value or identity then they are equal
                    if (x[p] === y[p]) {
                        continue
                    }
                    // Numbers, Strings, Functions, Booleans must be strictly equal
                    if (typeof (x[p]) !== 'object') {
                        return false
                    }
                    // Objects and Arrays must be tested recursively
                    if (!this.isEqual(x[p], y[p])) {
                        return false
                    }
                }
            }
            for (p in y) {
                // allows x[ p ] to be set to undefined
                if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
                    return false
                }
            }
            return true
        },
        /**
         * 数据类型判断
         * @param h
         * @returns {string | array, object, boolean, string, number, regexp, date ...}
         */
        type(h) {
            return Object.prototype.toString.call(h).slice(8, -1).toLowerCase()
        },
        /**
         * 解析json字符串
         * @param str { 传入的数据 }
         * @param defaults { 期望的数据格式 }
         * @returns {*}
         */
        parseJson(str, defaults = []) {
            let dataType = this.type(str)
            let defaultType = this.type(defaults)
            // 传入类型和期望数据类型相同直接返回传入数据
            if (dataType === defaultType) {
                return str
            }
            // 传入的不是字符串类型直接返回期望的数据类型默认值
            if (dataType !== 'string') {
                return defaults
            }
            // 使用JSON.parse解析json字符串
            try {
                return JSON.parse(str)
            } catch (e) {
                return defaults
            }
        },
        /**
         * 获取url中的参数
         * @returns {{}}
         */
        getQueryString() {
            let qs = location.search.substr(1) // 获取url中"?"符后的字串
            let args = {} // 保存参数数据的对象
            let items = qs.length ? qs.split('&') : [] // 取得每一个参数项,
            let item = null
            let len = items.length
            for (let i = 0; i < len; i++) {
                item = items[i].split('=')
                let name = decodeURIComponent(item[0])
                let value = decodeURIComponent(item[1])
                if (name) {
                    args[name] = value
                }
            }
            return args
        },
        /**
         * 清除数据中的无效属性
         * @param data
         * @returns {*}
         */
        removeNull(data) {
            try {
                // 无效的属性值，后面将会删除对象中属性值为下面数组中的值
                let voidProp = [null, undefined, 'null', 'undefined']
                for (let key in data) {
                    if (this._isArray(data[key]) || this._isObject(data[key])) {
                        this.removeNull(data[key])
                    } else if (voidProp.includes(data[key])) {
                        delete data[key]
                    }
                }
            } catch (err) {
            }
            return data
        },
        /**
         * 货币阿拉伯转中文繁体
         * @param num
         * @returns {*}
         * @constructor
         */
        NumberToChinese(num) {
            if (num === '' || num === undefined) return
            var unitPos = 0
            var strIns = ''
            var chnStr = ''
            var needZero = false
            var chnNumChar = ['零', '壹', '贰', '叁', '肆', '伍', '陸', '柒', '扒', '玖']
            var chnUnitSection = ['', '萬', '亿', '萬亿', '亿亿']
            var chnUnitChar = ['', '拾', '佰', '仟']

            var intNum = Math.floor(num)
            var floatNum = num * 100 - intNum * 100

            num = intNum

            function SectionToChinese(section) {
                var strIns = ''
                var chnStr = ''
                var unitPos = 0
                var zero = true
                while (section > 0) {
                    var v = section % 10
                    if (v === 0) {
                        if (!zero) {
                            zero = true
                            chnStr = chnNumChar[v] + chnStr
                        }
                    } else {
                        zero = false
                        strIns = chnNumChar[v]
                        strIns += chnUnitChar[unitPos]
                        chnStr = strIns + chnStr
                    }
                    unitPos++
                    section = Math.floor(section / 10)
                }
                return chnStr
            }

            if (num === 0) {
                return chnNumChar[0]
            }

            while (num > 0) {
                var section = num % 10000
                if (needZero) {
                    chnStr = chnNumChar[0] + chnStr
                }
                strIns = SectionToChinese(section)
                strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0]
                chnStr = strIns + chnStr
                needZero = (section < 1000) && (section > 0)
                num = Math.floor(num / 10000)
                unitPos++
            }
            chnStr += '圆'
            if (floatNum !== 0) {
                var n = Math.floor(floatNum)
                var jiaoIndex = Math.floor(n / 10)
                var fenIndex = Math.floor(n % 10)
                chnStr += `${chnNumChar[jiaoIndex]}角`
                if (fenIndex !== 0) {
                    chnStr += `${chnNumChar[fenIndex]}分`
                }
            }

            return chnStr === '' ? '' : chnStr + '整'
        },
        /**
         * 是否数组
         * @param h
         * @returns {boolean}
         * @private
         */
        _isArray(h) {
            return this.type(h) === 'array'
        },
        /**
         * 是否对象
         * @param h
         * @returns {boolean}
         * @private
         */
        _isObject(h) {
            return this.type(h) === 'object'
        },
        /**
         * 是否字符串
         * @param h
         * @returns {boolean}
         * @private
         */
        _isString(h) {
            return this.type(h) === 'string'
        },
        /**
         * 判断是否是函数
         * */
        _isFunction(h) {
            return this.type(h) === 'function'
        },
        /**
         * 从一个对象中获取部分属性，并返回一个对象
         * 前面参数为需要获取的属性，最后一个参数是数据来源对象
         * @returns {{}}
         */
        getProp() {
            let args = [...arguments]
            let props = args.slice(0, -1)
            let obj = args.slice(-1)[0]
            if (!this._isObject(obj)) {
                return {}
            }
            let backs = {}
            props.forEach(item => {
                if (this._isString(item) && obj[item] !== undefined) {
                    backs[item] = obj[item]
                }
            })
            return backs
        },
        /**
         * 从一个嵌套多级对象中获取嵌套的属性值
         * str: 类似`res.data.list`结构
         * data: 数据源，必须是个对象
         * expectType: 预期获取的数据结构，如果最终结果和这个值不同会返回该预期的默认值
         * callback: 成功获取值得回调（只会在数据类型和预期的数据类型相同时才会调用）
         * @returns {*}
         */
        judeProp(str, data, expectType = [], callback = _ => { }) {
            // 数据源不是对象就返回默认值
            if (!this._isObject(data)) {
                return expectType
            }
            // 传入的字符串不符合类似'res.data.list'规则的返回默认值
            if (!this._isString(str) || !/^\w+(\.\w+)*$/.test(str)) {
                return expectType
            }
            let arr = str.split('.')
            let len = arr.length
            // 传入的字符串为'res'（只有一级）时根据所需的数据类型和传入的数据源的数据类型进行返回
            if (len === 1) {
                return this.type(data) === this.type(expectType) ? data : expectType
            }
            // 以下传入字符串符合'red.data'规则（多重嵌套对象）
            let fn = (i, data, temp, len) => {
                // 未到最后一级就不是对象，返回默认值
                if (++i !== len && !this._isObject(temp)) {
                    return expectType
                }
                if (i === len) {
                    // 到达最后一级，且和预期的数据类型相同才返回最终值
                    if (this.type(expectType) === this.type(temp[arr[i]])) {
                        callback(temp[arr[i]])
                        return temp[arr[i]]
                    } else {
                        return expectType
                    } // 到达最后一级，但是数据类型对应不上返回默认值
                }
                // 还未达到最后一级递归继续取值
                return fn(i, data, temp[arr[i]], len)
            }
            return fn(0, data, data, len - 1)
        },
        /**
         * 获取可视区的宽高
         * @returns {{x: Number, y: Number}|*}
         */
        cltSize () {
            // if (this.__windowSize__) { return this.__windowSize__ }
            // this.__windowSize__ = {x: window.innerWidth, y: window.innerHeight}
            // return this.__windowSize__
            return {x: window.innerWidth, y: window.innerHeight}
        }
    }
}(jQuery, window)