import { Elysia,t } from 'elysia'
import {cookie}  from '@elysiajs/cookie'

const app = new Elysia()
 // GLOBAL HOOKS ON REQUEST YOU CAN GET HEADERS 
    .onRequest(async(request)=>{
        // GET YOU HEADERS
        console.log(request.headers.get("myheader"))
    })

    // SET YOU COOKIE
    .use(cookie())
    .get("/mycookie",({setCookie})=>{
        setCookie("mycook","You value cookie",{
            secure:true
        })
    })

    // GET HEADERS
    .get("/myhead",({request})=>{
        console.log(request.headers.get("mycert"))
    })

    // POST REQUEST
    .post("/mypost",({body})=>{
        console.log(body)
        return JSON.stringify(body)
    })

    .get('/', () => 'Hello person')
    // POST BODY
    .post("/add",({body})=>{
        console.log(body.username)
        return JSON.stringify(body)
    })
    // VALDATE BODY REQUEST WITH SCHEMA
    .post("/validatebody",({body})=>{
        return {
            "id":body.id,
            "username":body.username
        }
    },{
        schema:{
            body:t.Object({
                id:t.Number(),
                username:t.String()
            })
        }
    })
    // GET PARAMS ID FROM GET REQUEST

    .get("/id/:id",(context)=>{
        console.log("YOu params : ",context.params.id)
        return {
            "id":context.params.id
        }
    })
     
     // GET QUERY FROM NAME AND ID 

    .get("/query",({query})=>{
        return {
            "id":query.id,
            "name":query.name
        }
    })
    // Transform For Increment 
    .post("/transform",({body})=>body,{
        transform:({body})=>{
            body.id = body.id + 1
        }
    })
    // STATE AND DECORATE
    .decorate("youDecor",()=> Date.now())
    .state("counter",10)
    .get("/mystate",({
        youDecor,
        store:{counter}
    })=>`${counter}  ${youDecor()}`)

    // INCREMENT COUNTER
    .state("mycount",2)
    .inject(({store})=>({
        youIncrement(){
            store.mycount++
        }
    }))
    .derive((store)=>({
        double:()=>store().mycount * 20,
        minim:()=>store().mycount - 10
    }))
    .get("/incre",({youIncrement,store})=>{
        youIncrement()
        const {mycount,double,minim} = store
        return {
            mycount,
            double:double(),
            minim:minim()
        }
    })

    // PROTECTING YOU GUARD ROUTE

    .guard({
        schema:{
            query:t.Object({
                token:t.String()
            })
        }
    },(app)=>app.get("/protect",({query})=>{
        if(query.token == 12345){
            return "You token is valid"
        }
        return "Not Authorized"
    })
        .post("/checktoken",({body,query})=>{
            return {
                "name":query.name,

            }
        },
            {
                schema:{
                body:t.Object({
                    id:t.Number(),
                    username:t.String(),
                    profile:t.Object({
                        name:t.String()
                    })
                })
            }
            }

        )

    )



    .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
