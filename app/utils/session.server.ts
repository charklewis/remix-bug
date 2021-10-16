import { createCookieSessionStorage, Session, redirect } from "remix"
import { revokeSession, verifySession } from "./stytch.server"

const sessionSecret = process.env.SESSION_COOKIE_SECRET || "abc"

if (!sessionSecret) {
  throw new Error("Cookie secret environment variable is required.")
}

const cookiesOptions = {
  httpOnly: true,
  sameSite: "strict" as "strict",
  secure: process.env.ENVIRONMENT !== "localhost",
  path: "/",
  maxAge: 86400 * 21,
  secrets: [sessionSecret]
}

const sessionKey = "__session__"

const { commitSession, getSession, destroySession } = createCookieSessionStorage({
  cookie: { name: sessionKey, ...cookiesOptions }
})

const destroySessionsAndRedirectToSignIn = async (session: Session) => {
  const id = session.get("sessionId")
  if (id) {
    await revokeSession(id)
  }
  throw redirect("/sign-in", { headers: { "Set-Cookie": await destroySession(session) } })
}

const requireAuthenticatedUser = async (request: Request) => {
  const session = await getSession(request.headers.get("cookie"))
  const token = session.get("token")
  if (!token) await destroySessionsAndRedirectToSignIn(session)
  const user = await verifySession(token)
  if (!user) await destroySessionsAndRedirectToSignIn(session)
  return { session, user }
}

export { getSession, commitSession, destroySession, requireAuthenticatedUser, destroySessionsAndRedirectToSignIn }
