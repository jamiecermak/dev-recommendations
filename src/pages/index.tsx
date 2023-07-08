import { getAuth } from "@clerk/nextjs/server";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Dev Recommendations</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="dark flex min-h-screen items-center justify-center bg-slate-900 text-white"></main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
  // eslint-disable-next-line @typescript-eslint/require-await
) => {
  const auth = getAuth(ctx.req);
  const isSignedIn = auth.userId !== null && auth.userId !== undefined;

  if (!isSignedIn)
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };

  return {
    redirect: {
      destination: "/teams",
      permanent: false,
    },
  };
};
