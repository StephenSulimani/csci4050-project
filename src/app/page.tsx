"use client"

import { Avatar, Button, Card, Box } from "@chakra-ui/react"

import { useRouter } from "next/navigation"

import { Space_Grotesk } from "next/font/google";

import { StockChart } from "@/components/StockChart";

// export function FormattedChart() {
//     return (
//         <div className="h-screen flex items-center justify-center">
//             <div className="w-full max-w-4xl h-full">
//                 <StockChart ticker="AAPL" />
//             </div>
//         </div>
//     )
// }


const spaceGrotesk = Space_Grotesk({subsets: ['latin']});
export default function Home() {
    const router = useRouter();

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            backgroundImage="url('Stockpic.png')"
            backgroundSize="1500px auto"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundColor = "rgba(0, 0, 0, 1)"
        >

        <Box
            position = "absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            backgroundColor="rgba(0, 0, 0, 0.2)"
        />
            <div>
                <Card.Root 
                width="1000px"
                justifyContent="center"
                alignItems="center"
                
                >
                    <Card.Body gap="2"
                    justifyContent="center"
                    alignItems="center"
                    >
                        <Card.Title 
                        mt="2"
                        fontFamily = {spaceGrotesk.style.fontFamily}
                        fontSize="40px"
                        >Welcome to Gnail Trades!</Card.Title>
                        <Card.Description>
                            The simple to use trading solution for you!  Get started by clicking below to login or create an account!
                        </Card.Description>
                    </Card.Body>
                    <Card.Footer justifyContent="flex-end">
                        <Button variant="solid" type="button" onClick={() => router.push('/login')}>Login</Button>
                        <Button variant="outline" type="button" onClick={() => router.push('/login')}>Register</Button>
                    </Card.Footer>
                </Card.Root>
            </div>
        </Box>
    );
}
