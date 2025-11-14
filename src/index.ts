import { Elysia } from "elysia";
import { openapi } from '@elysiajs/openapi'

import { auth } from './lib/auth'


const authMiddleware = new Elysia({ name: 'better-auth' })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        console.log(headers)
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
  .use(openapi())
  .use(authMiddleware)
  .get("/", () => "Hello Elysia")
  .get('/user', ({ user }) => user, {
    auth: true
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
