//COOKIE填这
const COOKIE = ''









// 获取所有课程信息,返回 js 对象数组
async function get_course() {
    const queryHeaders = {
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'sec-ch-ua': '"Microsoft Edge";v="149", "Chromium";v="149", "Not)A;Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-requested-with': 'XMLHttpRequest',
        'cookie': COOKIE,
        'Referer': 'https://jwglxt.zstu.edu.cn/jwglxt/xspjgl/xspj_cxXspjIndex.html?doType=details&gnmkdm=N401605&layout=default',
    }

    const buildQueryBody = (currentPage) => new URLSearchParams({
        _search: 'false',
        'queryModel.showCount': '15',
        'queryModel.currentPage': String(currentPage),
        'queryModel.sortName': 'kcmc,jzgmc ',
        'queryModel.sortOrder': 'asc',
        time: '0',
    }).toString()

    const fetchPage = async (currentPage) => {
        const res = await fetch(
            'https://jwglxt.zstu.edu.cn/jwglxt/xspjgl/xspj_cxXspjIndex.html?doType=query',
            { headers: queryHeaders, body: buildQueryBody(currentPage), method: 'POST' }
        )
        return res.json()
    }

    const pick = (it) => ({
        jgh_id: it.jgh_id,
        jxb_id: it.jxb_id,
        kch_id: it.kch_id,
        xsdm: it.xsdm,
        tjztmc: it.tjztmc,
        kcmc: it.kcmc,
        jzgmc: it.jzgmc,
    })

    try {
        const first = await fetchPage(1)
        const totalPage = Number(first.totalPage) || 1
        let all = first.items.map(pick)
        for (let page = 2; page <= totalPage; page++) {
            const json = await fetchPage(page)
            all = all.concat(json.items.map(pick))
        }
        console.log(`共获取到${all.length}要评价的课程，开始评价!`)
        return all
    } catch (e) {
        console.error('获取课程列表失败:', e.message)
        console.error('可能是 COOKIE 已过期或被踢下线,请重新登录教务系统复制新的 COOKIE 后重试。')
        process.exit(1)
    }
}

// 遍历 courses,只对 tjztmc == "未评" 的发请求提交评价
async function submit(courses) {
    // ===== 评教模板相关参数(改这里就行)=====
    const submitParams = {
        ztpjbl: 100,
        jszdpjbl: 0,
        xykzpjbl: 0,

        jxb_id: '',
        kch_id: '',
        jgh_id: '',
        xsdm: '',

        pjmbmcb_id: '5445C7CE57F2D901E063085AA8C025F4',
        pjmbmc: '实验课学评教指标',
        pjdxdm: '01',
        fxzgf: '',
        py: '老师很认真、负责!',

        pfdjdmxmb_id: '838B81D35579C5BEE0530100007FD60E',
        pfdjdmb_id: '838B81D35573C5BEE0530100007FD60E',
        zsmbmcb_id: '5445C7CE57F2D901E063085AA8C025F4',

        xspjList: [
            { pjzbxm_id: '5445C7CE57F3D901E063085AA8C025F4', children: [
                { pjzbxm_id: '5445C7CE57F7D901E063085AA8C025F4' },
                { pjzbxm_id: '5445C7CE57F8D901E063085AA8C025F4' },
                { pjzbxm_id: '5445C7CE57F9D901E063085AA8C025F4' },
                { pjzbxm_id: '5445C7CE57FAD901E063085AA8C025F4' },
            ] },
            { pjzbxm_id: '5445C7CE57F4D901E063085AA8C025F4', children: [
                { pjzbxm_id: '5445C7CE57FBD901E063085AA8C025F4' },
            ] },
            { pjzbxm_id: '5445C7CE57F5D901E063085AA8C025F4', children: [
                { pjzbxm_id: '5445C7CE57FCD901E063085AA8C025F4' },
            ] },
            { pjzbxm_id: '5445C7CE57F6D901E063085AA8C025F4', children: [
                { pjzbxm_id: '5445C7CE57FDD901E063085AA8C025F4' },
                { pjzbxm_id: '5445C7CE57FED901E063085AA8C025F4' },
            ] },
        ],

        pjzt: 1,
        tjzt: 1,
    }

    const buildSubmitBody = (p) => {
        const form = new URLSearchParams()
        form.set('ztpjbl', p.ztpjbl)
        form.set('jszdpjbl', p.jszdpjbl)
        form.set('xykzpjbl', p.xykzpjbl)
        form.set('jxb_id', p.jxb_id)
        form.set('kch_id', p.kch_id)
        form.set('jgh_id', p.jgh_id)
        form.set('xsdm', p.xsdm)
        form.set('modelList[0].pjmbmcb_id', p.pjmbmcb_id)
        form.set('modelList[0].pjmbmc', p.pjmbmc)
        form.set('modelList[0].pjdxdm', p.pjdxdm)
        form.set('modelList[0].fxzgf', p.fxzgf)
        form.set('modelList[0].py', p.py)
        form.set('modelList[0].xspfb_id', '')
        p.xspjList.forEach((item, i) => {
            item.children.forEach((child, j) => {
                form.set(`modelList[0].xspjList[${i}].childXspjList[${j}].pfdjdmxmb_id`, p.pfdjdmxmb_id)
                form.set(`modelList[0].xspjList[${i}].childXspjList[${j}].pjzbxm_id`, child.pjzbxm_id)
                form.set(`modelList[0].xspjList[${i}].childXspjList[${j}].pfdjdmb_id`, p.pfdjdmb_id)
                form.set(`modelList[0].xspjList[${i}].childXspjList[${j}].zsmbmcb_id`, p.zsmbmcb_id)
            })
            form.set(`modelList[0].xspjList[${i}].pjzbxm_id`, item.pjzbxm_id)
        })
        form.set('pjzt', p.pjzt)
        form.set('tjzt', p.tjzt)
        return form.toString()
    }

    const submitHeaders = {
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'sec-ch-ua': '"Microsoft Edge";v="149", "Chromium";v="149", "Not)A;Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-requested-with': 'XMLHttpRequest',
        'cookie': COOKIE,
        'Referer': 'https://jwglxt.zstu.edu.cn/jwglxt/xspjgl/xspj_cxXspjIndex.html?doType=details&gnmkdm=N401605&layout=default',
    }

    for (const c of courses) {
        if (c.tjztmc !== '未评') continue

        const body = buildSubmitBody({
            ...submitParams,
            jxb_id: c.jxb_id,
            kch_id: c.kch_id,
            jgh_id: c.jgh_id,
            xsdm: c.xsdm,
        })

        try {
            const res = await fetch(
                'https://jwglxt.zstu.edu.cn/jwglxt/xspjgl/xspj_tjXspj.html?gnmkdm=N401605',
                { headers: submitHeaders, body, method: 'POST' }
            )
            const result = await res.text()
            console.log(`[${c.kcmc}] [${c.jzgmc}] ${result}`)
        } catch (e) {
            console.log(`[${c.kcmc}] [${c.jzgmc}] 失败:${e.message}`)
        }
    }
    console.log('所有评价已完成!请至如下网址确定结果: https://jwglxt.zstu.edu.cn/jwglxt/xspjgl/xspj_cxXspjIndex.html?doType=details&gnmkdm=N401605&layout=default')
}


//get_course().then(courses => console.log(courses))   //打印获取到的所有课程
get_course().then(submit)
