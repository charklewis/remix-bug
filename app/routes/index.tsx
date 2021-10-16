import { MetaFunction, LoaderFunction } from "remix";
import { requireAuthenticatedUser } from "~/utils/session.server";

const meta: MetaFunction = () => {
  return { title: "My website", robots: "noindex" };
};

const loader: LoaderFunction = async ({ request }) => {
  await requireAuthenticatedUser(request);
  return null;
};

const Index = () => {
  return (
    <main>
      <p>you made it!</p>
    </main>
  );
};

export { meta, loader };
export default Index;
