const getUser = async () => {
  const loadQuery = (): Promise<any> =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve({ queryUser: [{ id: "user-1", _id: "user-1", roles: "admin" }] })
      }, 300)
    })
  const { queryUser } = await loadQuery()

  const user = queryUser?.[0]

  return { id: "user-1", _id: user._id, roles: user.roles }
}

export { getUser }
