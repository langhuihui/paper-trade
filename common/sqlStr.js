/**
 * 生成sql语句
 * @param value 要操作的对象
 * @param other 要覆盖的名称，键为字段名，值为要覆盖的sql参数名,值为空则删除操作对象中的属性名
 */
function getNames(value, other) {
    let names = [];
    let argNames = [];
    for (let n in value) {
        names.push(n)
        argNames.push(":" + n)
    }
    if (other)
        for (let n in other) {
            let i = names.indexOf(n)
            if (other[n]) {
                if (i != -1) {
                    argNames[i] = other[n]
                } else {
                    names.push(n)
                    argNames.push(other[n])
                }
            } else {
                if (i != -1) {
                    names.splice(i, 1)
                    argNames.splice(i, 1)
                }
            }
        }
    return { names, argNames }
}
export default {
    insert(table, value, other) {
        let { names, argNames } = getNames(value, other)
        return `insert into ${table}(${names.join(',')}) values(${argNames.join(',')}) `
    },
    update(table, value, other) {
        let { names, argNames } = getNames(value, other)
        for (let i = 0; i < names.length; i++) {
            names[i] = names[i] + "=" + argNames[i]
        }
        return `update ${table} set ${names.join(',')} `
    }
}