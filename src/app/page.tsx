"use client";

// Removed unused Avatar and Chakra Box/Card/Button
// import { Avatar, Button, Card, Box } from "@chakra-ui/react";

import { useRouter } from "next/navigation";

import { Space_Grotesk } from "next/font/google";

// Assuming StockChart component is already Tailwind/standard HTML
import { StockChart } from "@/components/StockChart";

// Shadcn UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Utility for conditionally joining class names (part of Shadcn setup)
import { cn } from '@/lib/utils'; // Assuming this path is correct


const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' }); // Use CSS variable

export default function Home() {
    const router = useRouter();

    return (
        // Main container: h-screen, flex, center, background image/size/position/repeat, background color overlay handled separately
        <div
            className={cn(
                "relative flex h-screen items-center justify-center", // Use Tailwind arbitrary value for size, add bg-black
                spaceGrotesk.variable // Apply font variable
            )}
            style={{ fontFamily: 'var(--font-space-grotesk)' }} // Apply the font variable (or configure via tailwind.config.js)
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Card Container - ensures it's above the overlay and centered by the parent flexbox */}
            <div className="z-10 w-full max-w-sm md:max-w-[1000px]"> {/* Set max width for card, w-full ensures responsiveness up to max */}
                <Card>
                    {/* CardHeader can be left empty or used for logos etc. */}
                    {/* The Chakra original put Title/Description in Body, we'll use CardContent */}
                    <CardContent className="flex flex-col items-center gap-2 p-6"> {/* Added p-6 for padding, flex-col, items-center for centering */}
                        <CardTitle
                            className={cn("mt-2 text-[40px] text-center", spaceGrotesk.variable)} // Use arbitrary value for size, center text
                            style={{ fontFamily: 'var(--font-space-grotesk)' }} // Apply the font variable
                        >
                            Welcome to Kesef!
                        </CardTitle>
                        <CardDescription className="text-center"> {/* Center description text */}
                            The simple to use trading solution for you! Get started by clicking below to login or create an account!
                        </CardDescription>
                    </CardContent>

                    {/* CardFooter: Right align buttons with gap */}
                    <CardFooter className="flex justify-end gap-2 p-6"> {/* Added p-6 for padding */}
                        <Button type="button" onClick={() => router.push('/login')}>Login</Button>
                        <Button variant="outline" type="button" onClick={() => router.push('/login?register=1')}>Register</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
