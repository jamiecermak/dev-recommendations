import Head from "next/head";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>Sign Up | Rcmd 👍</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="dark flex min-h-screen items-center justify-center bg-gray-900 text-white ">
        <SignUp
          signInUrl="/sign-in"
          appearance={{
            elements: {
              card: "bg-slate-900 text-white border border-slate-800",
              formFieldInput:
                "py-6 text-lg flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-white",
              footerActionLink: "text-white hover:text-white",
              formFieldLabel: "text-gray-300 mb-1",
              formButtonPrimary: "mt-5",
              formField: "mb-1",
            },
            variables: {
              colorText: "white",
              colorPrimary: "#0ea5e9",
            },
          }}
        />
      </main>
    </>
  );
}
