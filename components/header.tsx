import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "@mui/material";

const Header = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();

  return (
    <nav className="bg-gray-800 text-white py-4 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Climate Anxiety Map</h1>
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
            <div className="flex flex-row">
              {/** 
                 <div className="mr-4">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    console.log("write post");
                  }}
                >
                  Create a post
                </Button>
                </div>
                */}
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
