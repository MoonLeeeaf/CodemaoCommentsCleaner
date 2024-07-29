const { CodemaoApi } = require('./moon-codemao-api')

let v = {}

const reg = /^.?自动.*$/

if (process.argv.length < 4)
    return console.error('Usage: node main.js <authentication> (<workid> / --user=<userId>)')

CodemaoApi.setCookieToken(process.argv[2])

/**
 * 清理作品内的评论
 * @param { Number } workId 作品ID
 */
async function clean(workId) {
    let info = await CodemaoApi.Work.getWorkInfo(workId)
    console.log(`正在扫描作品 ${workId}`)
    let res = await CodemaoApi.WorkComment.getWorkComments(workId)
    for (let i of res) {
        // commentId = i.id， text = i.content
        // 16030966 AI大烤鸡（）
        if (reg.test(i.content) || i.user.id == 16030966) {
            console.log(`删除${ CodemaoApi.WorkComment.deleteComment(workId, i.id) ? '成功' : '失败' }: ${i.id} -> 来自 ${i.user.nickname}(${i.user.id}) -> ${i.content}`)
        }
    }
    console.log(`清理完毕！`)
}

if (process.argv[3].startsWith('--user=')) {
    let u = process.argv[3].replaceAll('--user=', '')
    CodemaoApi.Work.getUserWorksByNewest(u).then((res) => {
        for (let i of res) {
            // work_name， id
            console.log(`获取到作品: ${i.work_name}(${i.id})`)
            clean(i.id)
        }
    })
} else
    clean(process.argv[3])
