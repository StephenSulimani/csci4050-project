import { StockChart } from "@/components/StockChart";

export default function Home() {
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="w-full max-w-4xl h-full">
                <StockChart />
            </div>
        </div>
    )
}
