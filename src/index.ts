import { Elysia } from "elysia";
import { openapi } from '@elysiajs/openapi'
import { Logestic } from 'logestic'

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
