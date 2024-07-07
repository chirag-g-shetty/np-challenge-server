const evaluate = (qn:string,res: string|number) => {
    let flag = 0
switch (qn[1]){
    case '1': if (res==='-138.198\n') flag=1
        break
    case '2': if (res==='7.296\n') flag=1
        break
    case '3': if (res==='1.261\n') flag=1
        break
    default:break
}
    return flag
}
export default evaluate