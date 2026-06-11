export const load = async ({ locals: { safeGetSession }, cookies }) => {
  const { session, user } = await safeGetSession()

  // console.log("Session: ", session,"User: ", user)

  return {
    session,
    user,
    cookies: cookies.getAll(),
  }
}