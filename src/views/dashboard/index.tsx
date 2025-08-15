
import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@radix-ui/react-progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const blockchainMetrics = [
  { label: "Total Transactions", value: "152,340", icon: "/blockchain.png" },
  { label: "Active Nodes", value: "342", icon: "/eth.png" },
  { label: "Hash Rate", value: "127.3 TH/s", icon: "/bitcoin.png" },
];

const conversionRates = [
  { currency: "BTC", rate: "67,530", icon: "/bitcoin.png", progress: 80 },
  { currency: "ETH", rate: "3,520", icon: "/eth.png", progress: 65 },
  { currency: "MATIC", rate: "0.88", icon: "/polygon.png", progress: 40 },
  { currency: "USDT", rate: "1.00", icon: "/usdt.png", progress: 95 },
];

const transactionsData = [
  { month: "Jan", transactions: 12000 },
  { month: "Feb", transactions: 15000 },
  { month: "Mar", transactions: 18000 },
  { month: "Apr", transactions: 14000 },
  { month: "May", transactions: 20000 },
  { month: "Jun", transactions: 24000 },
  { month: "Jul", transactions: 22000 },
];

const hashRateData = [
  { month: "Jan", hashRate: 100 },
  { month: "Feb", hashRate: 110 },
  { month: "Mar", hashRate: 115 },
  { month: "Apr", hashRate: 108 },
  { month: "May", hashRate: 120 },
  { month: "Jun", hashRate: 127 },
  { month: "Jul", hashRate: 130 },
];

export default function Dashboard() {
  return (
    <SidebarLayout current="Dashboard Admin">
      {/* Metrics */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {blockchainMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm">{metric.label}</CardTitle>
                <CardDescription className="text-xl font-bold">{metric.value}</CardDescription>
              </div>
              <img src={metric.icon} alt={metric.label} width={40} height={40} />
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Simulated Graphs */}
      <div className="grid gap-4 md:grid-cols-2 ">
        <Card>
          <CardHeader>
            <CardTitle>Transações de Blockchain (últimos 7 dias)</CardTitle>
            <CardDescription>Gráfico Simulado</CardDescription>
          </CardHeader>
           <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transactionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="transactions" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendência da taxa de hash</CardTitle>
            <CardDescription>Gráfico Simulado</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hashRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="hashRate" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Rates */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Taxas de conversão de criptomoedas (vs. USD)</CardTitle>
          <CardDescription>Taxas simuladas em tempo real com barras de utilização</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {conversionRates.map((item) => (
            <div key={item.currency} className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={item.icon} alt={item.currency} width={24} height={24} />
                  <span className="text-sm font-medium">{item.currency}</span>
                </div>
                <span className="text-sm">${item.rate}</span>
              </div>
              <Progress value={item.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </SidebarLayout>
  );
}

