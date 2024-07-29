/*
 * Aumiao-js
 * 喵呜~
 * GitHub @满月叶
 * v1.0.0
 */

function promise(cb) {
    return new Promise(cb)
}

const CodemaoApi = class {
    /*
     =======================
              主类
     ========================
     */
    static users = {}
    static baseUrl = "https://api.codemao.cn"
    static headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
    }

    static setCookie(cookie) {
        this.headers.cookie = cookie
    }

    static setCookieToken(token) {
        this.setCookie(`authorization=${token}`)
    }

    /**
     * Switch to a user that it exists
     * @param { any } id 
     * @returns { CodemaoApi } this
     */
    static switchUser(id) {
        this.setCookieToken(this.users[id])
        return this
    }
    /**
     * Add a user with token
     * @param { any } id 
     * @param { String } token
     * @returns { CodemaoApi } this
     */
    static setupUser(id, token) {
        this.users[id] = token
        return this
    }

    static async featchAll(apiUrlWithoutOffsetAndLimit) {
        function fetchSome(offset, limit) {
            return promise((r) => fetch(`${apiUrlWithoutOffsetAndLimit}offset=${offset}&limit=${limit}`, { headers: CodemaoApi.headers }).then(async (res) => {
                if (res.status >= 200 && res.status < 300)
                    return r(await res.json())
                r({items: []})
            }))
        }
        let offset = 0
        let limit = 200
        /** @type { Array } */
        let items

        let collect = []
        do {
            let data = await fetchSome(offset, limit)
            items = data.items
            offset += limit

            items.forEach((v) => collect.push(v))
        } while (items.length != 0)

        return collect
    }

    /*
     =======================
              子类
     ========================
     */

    /**
     * 用户逻辑
     */
    static User = class {
        /**
         * Login your account
         * @param { String } account
         * @param { String } password
         * @returns { Promise<String> } token
         */
        static getToken(usr, psw) {
            return promise((r) => fetch(`${CodemaoApi.baseUrl}/tiger/v3/web/accounts/login`, {
                method: "POST",
                body: {
                    identity: usr,
                    password: psw,
                    pid: "65edCTyg", // 写死的, 不会变动
                }, headers: CodemaoApi.headers
            }).then(async (res) => {
                if (res.status >= 200 && res.status < 300)
                    return r((await res.json()).auth.token)
                r(null)
            }))
        }
        /**
         * Get my details
         * @returns { Promise<Object> } json
         */
        static getMyDetails() {
            return promise((r) => fetch(`${CodemaoApi.baseUrl}/web/users/details`, { headers: CodemaoApi.headers }).then(async (res) => {
                if (res.status >= 200 && res.status < 300)
                    return r(res.json())
                r(null)
            }))
        }
    }
    /**
     * 作品逻辑
     */
    static Work = class {
        /**
         * Like a work
         * @param { Number } workId 
         * @param { Boolean } unLike
         * @returns { Promise<Boolean> } successOrFailure
         */
        static like(workId, unLike) {
            return promise((r) => fetch(`${CodemaoApi.baseUrl}/nemo/v2/works/${workId}/like`, { headers: CodemaoApi.headers, method: unLike ? "delete" : "post" }).then((res) => {
                if (res.status >= 200 && res.status < 300)
                    return r(true)
                r(false)
            }))
        }
        /**
         * Collect a work
         * @param { Number } workId 
         * @param { Boolean } unCollect 
         * @returns { Promise<Boolean> } successOrFailure
         */
        static collect(workId, unCollect) {
            return promise((r) => fetch(`${CodemaoApi.baseUrl}/nemo/v2/works/${workId}/collection`, { headers: CodemaoApi.headers, method: unCollect ? "delete" : "post" }).then((res) => {
                if (res.status >= 200 && res.status < 300)
                    return r(true)
                r(false)
            }))
        }
        /**
         * Get the newest works
         * @param { Number } limit 
         * @param { Number } offset 
         * @returns { Promise<Object> } json
         */
        static getNewestWorks(limit, offset) {
            return promise((r) => fetch(`${CodemaoApi.baseUrl}/creation-tools/v1/pc/discover/newest-work?work_origin_type=ORIGINAL_WORK&offset=${offset ? offset : 0}&limit=${limit ? limit : 20}`, { headers: CodemaoApi.headers }).then(async (res) => {
                if (res.status >= 200 && res.status < 300)
                    return r(await res.json())
                r(false)
            }))
        }
        /**
         * Get all works, type==nemo
         * @returns { Promise<Object> } json
         */
        static async getMyNemoCloudWorks() {
            return await CodemaoApi.featchAll(`${CodemaoApi.baseUrl}/creation-tools/v1/works/list?published_status=all&`)
        }
        static async getUserWorksByNewest(userId) {
            return await CodemaoApi.featchAll(`${CodemaoApi.baseUrl}/creation-tools/v1/user/center/work-list?user_id=${userId}&type=newest&`)
        }
        /**
         * Get information of a work
         * @param { Number } workId
         * @returns { Promise<Object> } json
         */
        static getWorkInfo(workId) {
            return promise((r) => fetch(`${CodemaoApi.baseUrl}/creation-tools/v1/works/${workId}`, { headers: CodemaoApi.headers }).then(async (res) => {
                if (res.status >= 200 && res.status < 300)
                    return r(await res.json())
                r(false)
            }))
        }
    }
    /**
     * 作品_评论区逻辑
     */
    static WorkComment = class {
        /**
         * Get all comments from a work
         * @param { Number } workId
         * @returns { Promise<Object> } json
         */
        static async getWorkComments(workId) {
            return await CodemaoApi.featchAll(`${CodemaoApi.baseUrl}/creation-tools/v1/works/${workId}/comments?`)
        }
        /**
         * Remove a comment from a work
         * @param { Number } workId 
         * @param { Number } commentId
         * @returns { Promise<Boolean> } successOrFailure
         */
        static deleteComment(workId, commentId) {
            return promise((r) => fetch(`${CodemaoApi.baseUrl}/creation-tools/v1/works/${workId}/comment/${commentId}`, { headers: CodemaoApi.headers, method: "delete" }).then((res) => {
                if (res.status >= 200 && res.status < 300)
                    return r(true)
                r(false)
            }))
        }
    }
}

exports.CodemaoApi = CodemaoApi
