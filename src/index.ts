import { Elysia } from "elysia";
import { openapi } from '@elysiajs/openapi'
import { Logestic } from 'logestic'
import { cors } from '@elysiajs/cors'

import { auth } from './lib/auth'


const betterAuth = new Elysia({ name: 'better-auth' })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
          headers
        })
        if (!session) return status(401)

        return {
          user: session.user,
          session: session.session
        }
      }
    }
  })

const app = new Elysia()
  .use(cors({
    origin: "http://localhost:8081",  // FIXME: this is just for local development
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }))
  .use(Logestic.preset('common'))
  .use(openapi())
  .use(betterAuth)
  .get("/", () => "🦊 Hello Elysia")
  .get('/user', ({ user }) => user, {
    auth: true
  })
  .listen(Number(process.env.PORT ?? 3000));

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
