import { betterAuth } from 'better-auth'
import { expo } from "@better-auth/expo"
import { Pool } from 'pg'

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL
  }),
  emailAndPassword: {
    enabled: true,
  },
  defaultCookieAttributes: {
    httpOnly: true,
    secure: true
  },
  plugins: [expo()],
  useSecureCookies: true,
  trustedOrigins: [
    "trailapp://",
    "http://localhost:8081",
    "https://trailapp.expo.app/"
  ] // FIXME
})

export default auth
