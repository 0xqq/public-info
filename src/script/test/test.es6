// $.http.test(res => console.log(res, '***** res *****'))
// console.log($.g)

$.http.supervene([
    {api: '/login/findUserInfo', data: {userId: '071495'}},
    {api: '/login/findUserInfo', data: {userId: '071495'}},
    {api: '/login/findUserInfo', data: {userId: '071495'}}
], res => console.log(res))