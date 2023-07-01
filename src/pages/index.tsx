import Head from 'next/head';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { SignInButton, SignUpButton, useAuth } from '@clerk/nextjs';

function SignInCardFooter({ children }: { children: React.ReactNode }) {
    const auth = useAuth();

    if (!auth.isLoaded) {
        return (
            <Button size="lg" className="w-96" isLoading>
                Please wait
            </Button>
        );
    }

    if (auth.isSignedIn) {
        return children;
    }

    return (
        <>
            <SignUpButton>
                <Button size="lg" className="w-96">
                    Sign up
                </Button>
            </SignUpButton>

            <p className="text-sm text-slate-400">
                Already have an account?{' '}
                <SignInButton>
                    <a className="cursor-pointer font-medium text-slate-100 hover:underline">
                        Sign in instead
                    </a>
                </SignInButton>
            </p>
        </>
    );
}

export default function HomePage() {
    return (
        <>
            <Head>
                <title>Dev Recommendations</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="dark flex min-h-screen items-center justify-center bg-slate-900 text-white">
                <Card className="p-5">
                    <CardHeader className="pb-0">
                        <h1 className="scroll-m-20 text-center text-2xl font-extrabold tracking-tight lg:text-3xl">
                            Join Team
                        </h1>
                    </CardHeader>
                    <CardContent className="py-20">
                        <p>My Awesome Team</p>
                        <p>43 Members</p>
                        <p>Invited by Jamie Cermak</p>
                    </CardContent>
                    <CardFooter className="flex flex-col justify-center gap-5">
                        <SignInCardFooter>
                            <Button size="lg" className="w-96">
                                Join now
                            </Button>
                        </SignInCardFooter>
                    </CardFooter>
                </Card>
            </main>
        </>
    );
}
