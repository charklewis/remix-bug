const sendMagicLink = (email: string) => {
  return true
}

const verifyMagicLinkToken = () => {
  const verify = new Promise<{ id: string; sessionToken: string; sessionId: string }>(resolve => {
    setTimeout(() => {
      resolve({ id: "user-1", sessionToken: "session-token-1", sessionId: "session-id-1" })
    }, 1000)
  })

  return verify
}

const verifySession = (token: string) => {
  const verify = new Promise(resolve => {
    setTimeout(() => {
      resolve({ session: { user_id: "user-1" } })
    }, 2000)
  })
  return verify
}

const revokeSession = (token: string) => {
  return true
}

export { sendMagicLink, verifyMagicLinkToken, verifySession, revokeSession }
