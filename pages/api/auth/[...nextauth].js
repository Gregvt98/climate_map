import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { username, password } = credentials;
        //console.log("", username, password);
        try {
          // Make a request to your existing API route to validate the credentials and retrieve the user data
          const response = await fetch(
            `http://localhost:8000/api/v1/users/email?email=${username}`,
            {
              method: "Get",
              headers: { "Content-Type": "application/json" },
            }
          );
          if (response.ok) {
            const data = await response.json();
            const user = {
              id: data.id,
              name: data.first_name,
              email: data.email,
              hashed_password: data.hashed_password,
            };
            if (user && (await compare(password, user.hashed_password))) {
              console.log(user);
              // Return the user object
              return user;
            }
          }
        } catch (error) {
          console.error("Authorization error:", error);
        }

        // If the credentials are invalid or the user doesn't exist, return null
        return null;
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt({ token, account, profile }) {
        // Persist the OAuth access_token and or the user id to the token right after signin
        if (account) {
          token.accessToken = account.access_token
          if (profile)  {
            token.id = profile.id
          }
        }
        return token
      },
      async session({ session, token, user }) {
        // Send properties to the client, like an access_token and user id from a provider.
        session.accessToken = token.accessToken
        session.user.id = token.id
        return session
      }
  }
});
