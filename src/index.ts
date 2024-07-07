import { createClient } from "@libsql/client/web";
import { Hono } from 'hono'
import {cors} from "hono/cors";
import execute from "./execute";
import evaluate from "./evaluate";

const dbClient = createClient({
    url: Bun.env.URL as string,
    authToken: Bun.env.AUTH_TOKEN,
});

const server = new Hono()
server
    .use(cors())
    .get('/winners',async (ctx)=>{
        const winners = await dbClient.execute(`select * from cse6b where q1 = 1 and q2 = 1 and q3 = 1 order by time`)
        return ctx.json(winners['rows'].map(row=>[row.name,row.time]))
    })
    .post('/exe',async (ctx)=>{
        const clientRes = await ctx.req.json();
        let {name,qn,code} = clientRes;
        const res = await execute(code);
        code = code.replace(/['"`]{1,3}/g, '')
        const {rows} = await dbClient.execute(`select count(*) from cse6b where name = '${name}'`)
        let flag = 1;
        if (!rows[0]['count (*)'])
            await dbClient.execute(`insert into cse6b (name,time,code${qn[1]}) values ('${name}','${Date.now()}','${code}')`);
        if(res[0]) {
            if(evaluate(qn, res[1])){
            await dbClient.execute(`update cse6b set q${qn[1]}=1, code${qn[1]}='${code}' where name = '${name}'`)
            const {rows} = await dbClient.execute(`select * from cse6b where name = '${name}'`)
            if((rows[0].time as number) > 1710000000000 && rows[0].q1 && rows[0].q2 && rows[0].q3) {
                    await dbClient.execute(`update cse6b set time=${Math.floor((Date.now()- (rows[0].time as number))/1000)}, code${qn[1]}='${code}' where name = '${name}'`)
                }
            }else{
                flag = 0
            }
        }
        return ctx.json({
            exeResult:res[0]?[...res,flag]:[res[0],(res[1] as string).split('\n').slice(1).join('\n'),flag],
        })})

export default server
