import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import Link from "next/link";

const Header = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();

  return (
    <nav className="bg-gray-800 text-white py-4 px-6 flex items-center justify-between">
      <div>
        <Link
        href="/"
        >
        <h1 className="text-2xl font-bold">Climate Anxiety Map</h1>
        </Link>
      </div>
      <div>
        {!session && (
          <>
            <Button variant="contained" onClick={() => signIn()}>
              Sign In
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                router.push("/signup");
              }}
            >
              Sign Up
            </Button>
          </>
        )}
        {session && (
          <>
            <div className="flex flex-row items-center">
              <div className="mr-4">
                <span>{session.user.name ? session.user.name : session.user.email}</span>
              </div>
              <div className="mr-4">
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
