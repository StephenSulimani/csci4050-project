'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext'; // Assuming this path is correct
import { useEffect, useState } from 'react';
import { Space_Grotesk } from 'next/font/google';

// Shadcn UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Lucide icon for loading spinner
import { ArrowLeft, LineChart, Loader2, Plus, Wallet } from 'lucide-react';

// Utility for conditionally joining class names (part of Shadcn setup)
import { cn } from '@/lib/utils'; // Assuming this path is correct
import Link from 'next/link';
import { PortfolioChart } from '@/components/portfolio-chart';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, TableBody, TableHeader, TableRow, TabsContent, TabsList, TabsTrigger } from '@chakra-ui/react';
import { BuyOrderForm } from '@/components/buy-order-form';
import { SellOrderForm } from '@/components/sell-order-form';
import { Table } from 'sequelize-typescript';
import { TableCell, TableHead } from '@/components/ui/table';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' }); // Use CSS variable

export default function Login() {
    const searchParams = useSearchParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [registerPage, setRegisterPage] = useState(searchParams.get("register") ? true : false);

    const router = useRouter();
    const auth = useAuth(); // Assuming useAuth provides loading and error

    // Redirect if already logged in
    useEffect(() => {
        if (auth.loggedIn) {
            router.push('/kesef');
        }
    }, [auth.loggedIn, router]);

    // Show loading state if auth is loading
    if (auth.loading || auth.loggedIn) {
        // Optional: Render a full-page spinner or skeleton while checking auth status
        return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }


    if (registerPage) {
        return (
            // Main container for register page - background, centering, font
            <div
                className={cn(
                    'relative flex h-screen items-center justify-center',
                    spaceGrotesk.variable // Apply font variable
                )}
                style={{ fontFamily: 'var(--font-space-grotesk)' }} // Apply the font variable (or configure via tailwind.config.js)
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20" />

                {/* Card Container - ensures it's above the overlay and centered */}
                <div className="z-10 w-full max-w-sm">
                    <form onSubmit={() => auth.register(name, email, password)}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Register</CardTitle>
                                <CardDescription>
                                    Fill in the form below to create an account
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                {/* Replaced Fieldset/Field with simple divs and labels/inputs */}
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" type="text" onChange={(e) => setName(e.target.value)} disabled={auth.loading} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email-register">Email Address</Label> {/* Added unique ID */}
                                    <Input id="email-register" type="email" onChange={(e) => setEmail(e.target.value)} disabled={auth.loading} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password-register">Password</Label> {/* Added unique ID */}
                                    <Input id="password-register" type="password" onChange={(e) => setPassword(e.target.value)} disabled={auth.loading} />
                                </div>

                                {/* Error Message */}
                                {auth.error && (
                                    <p className="text-sm font-medium text-red-500">{auth.error}</p>
                                )}

                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                {/* Register Button */}
                                <Button type="submit" onClick={() => auth.register(name, email, password)} disabled={auth.loading}>
                                    {auth.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Register
                                </Button>
                                {/* Login Button */}
                                <Button variant="outline" type="button" onClick={() => setRegisterPage(false)} disabled={auth.loading}>
                                    Login
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </div>
        );
    }

    // Login Page
    return (
        // Main container for login page - centering
        <div className={cn("grid h-screen place-items-center", spaceGrotesk.variable)} style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            {/* Card Container */}
            <div className="w-full max-w-sm">
                <form onSubmit={() => { auth.login(email, password) }}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Fill in the form below to log in
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {/* Replaced Fieldset/Field with simple divs and labels/inputs */}
                            <div className="grid gap-2">
                                <Label htmlFor="email-login">Email address</Label> {/* Added unique ID */}
                                <Input id="email-login" type="email" onChange={(e) => setEmail(e.target.value)} disabled={auth.loading} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password-login">Password</Label> {/* Added unique ID */}
                                <Input id="password-login" type="password" onChange={(e) => setPassword(e.target.value)} disabled={auth.loading} />
                            </div>

                            {/* Error Message */}
                            {auth.error && (
                                <p className="text-sm font-medium text-red-500">{auth.error}</p>
                            )}

                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            {/* Login Button */}
                            <Button type="submit" onClick={() => auth.login(email, password)} disabled={auth.loading}>
                                {auth.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Login
                            </Button>
                            {/* Register Button */}
                            <Button variant="outline" type="button" onClick={() => setRegisterPage(true)} disabled={auth.loading}>
                                Register
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </div>
    );
}


