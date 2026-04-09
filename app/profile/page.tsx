import { currentUser } from "@clerk/nextjs/server";

export default async function Profile() {
  const user = await currentUser();

  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {user?.emailAddresses[0].emailAddress}</p>
      <p>Name: {user?.firstName}</p>
    </div>
  );
}
