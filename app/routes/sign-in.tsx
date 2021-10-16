import {
  MetaFunction,
  LoaderFunction,
  ActionFunction,
  json,
  useFetcher,
  useLoaderData,
  redirect,
} from "remix";

import { commitSession, getSession } from "~/utils/session.server";
import { sendMagicLink, verifyMagicLinkToken } from "~/utils/stytch.server";
import { getUser } from "~/utils/user.server";

const meta: MetaFunction = () => {
  return { title: "Sign In" };
};

/*

expected behavior
1. go to localhost:3000/sign-in?token=93742
2. this loader will validate the user (it will resolve mock data)
3. the loader will set the session with user data
4. the loader will then redirect to the home page
5. the home page will validate the user and load the component

what is happening
1. go to localhost:3000/sign-in?token=93742
2. this loader does successfully validate the user (it will resolve mock data)
3. the loader does set the session with user data
4. the loader then does then redirect to the home page
5. the session is empty so it redirects back to the sign in page


*/

const action: ActionFunction = async ({ request }) => {
  const params = new URLSearchParams(await request.text());
  const form = { email: params.get("email") };

  sendMagicLink(form.email as string);
  return json({ success: { emailSent: true } });
};

const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("cookie"));

  if (session.get("user") && session.get("token")) {
    throw redirect("/");
  }

  const url = new URL(request.url);
  const magicLinkToken = url.searchParams.get("token");

  if (!magicLinkToken) return null;

  const { id, sessionToken, sessionId } = await verifyMagicLinkToken();
  if (id && sessionToken && sessionId) {
    const user = await getUser();
    if (!user)
      return json({ errors: { server: "There was an issue signing in." } });
    session.set("user", user);
    session.set("token", sessionToken);
    session.set("sessionId", sessionId);
    return redirect("/", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }
  return json({ errors: { server: "There was an issue signing in." } });
};

const SignIn = () => {
  const data = useLoaderData();
  const form = useFetcher();

  return (
    <div>
      <div className="bg-white dark:bg-gray-900 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        {form?.data?.success?.emailSent ? (
          <p>
            Fake email sent. Go to localhost:3000/sign-in?token=93742 to test
            the magic link
          </p>
        ) : (
          <form.Form method="post">
            <div className="space-y-6">
              <label>Email</label>
              <input name="email" placeholder="type anything" />
              {data?.errors?.server ? (
                <p className="text-red-600 dark:text-red-700 text-sm">
                  {data.errors.server}
                </p>
              ) : null}
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {form.state !== "idle" ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </div>
          </form.Form>
        )}
      </div>
    </div>
  );
};

export { action, loader, meta };
export default SignIn;
