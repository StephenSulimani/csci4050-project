import { Landmark, LogOut, Wallet } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { IAuthContext } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Header({ auth, active }: { auth: IAuthContext, active: string }) {
    const router = useRouter();
    return (
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <div className="flex items-center gap-2 font-semibold">
                <Landmark className="h-6 w-6" />
                <span>Kesef</span>
            </div>
            <nav className="ml-auto flex gap-2">
                <Button className={active === "research" ? "border-gray-400 rounded-md bg-gray-200" : ""} asChild variant={active === "research" ? "outline" : "ghost"} size="sm">
                    <Link href="/research">Research</Link>
                </Button>
                <Button className={active === "dashboard" ? "border-gray-400 rounded-md bg-gray-200" : ""} asChild variant={active === "dashboard" ? "outline" : "ghost"} size="sm">
                    <Link href="/kesef">Portfolios</Link>
                </Button>
                {auth.loggedIn && (
                    <Button className="border-gray-400 rounded-md" variant="outline" size="sm" onClick={() => { auth.logout(); router.push('/') }}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                )}
            </nav>
        </header>
    )
}
