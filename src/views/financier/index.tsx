import { SidebarLayout } from "@/components/layouts/SidebarLayout";

export default function Financier() {
     return (
       <SidebarLayout
         breadcrumb={[{ label: "Financeiro", href: "#" }]}
         current="Dashboard"
       >
         <div className="grid auto-rows-min gap-4 md:grid-cols-3">
           <div className="aspect-video rounded-xl bg-muted/50" />
           <div className="aspect-video rounded-xl bg-muted/50" />
           <div className="aspect-video rounded-xl bg-muted/50" />
         </div>
         <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
       </SidebarLayout>
     );
   
}

export const TransactionsData = [
  {
    id: "1",
    createdAt: "2025-05-30T08:15:00Z",
    typeNotification: "BLOCKCHAIN",
    origin: "0x1aB3fD91fABc1234567890",
    destiny: "0x9cE5Df12aBCe9876543210",
    coin: "USDT",
  },
  {
    id: "2",
    createdAt: "2025-05-30T09:45:00Z",
    typeNotification: "BLOCKCHAIN",
    origin: "0x3bC6eF72aDEF2233445566",
    destiny: "0x6fD4aE31bCCa1122334455",
    coin: "BTC",
  },
  {
    id: "3",
    createdAt: "2025-05-30T10:30:00Z",
    typeNotification: "TRANSFERÊNCIA",
    origin: "Banco 237 - Conta 123456-7",
    destiny: "Banco 001 - Conta 987654-3",
    coin: "BRL",
  },
  {
    id: "4",
    createdAt: "2025-05-30T11:00:00Z",
    typeNotification: "PIX",
    origin: "julio@email.com",
    destiny: "cpf: 123.456.789-00",
    coin: "BRL",
  },
  {
    id: "5",
    createdAt: "2025-05-30T11:30:00Z",
    typeNotification: "BLOCKCHAIN",
    origin: "0x7eA1B92CcEf45678901234",
    destiny: "0x4fC3D12bBAcD5678901234",
    coin: "ETH",
  },
  {
    id: "6",
    createdAt: "2025-05-30T12:00:00Z",
    typeNotification: "TRANSFERÊNCIA",
    origin: "Banco 104 - Conta 000112-0",
    destiny: "Banco 033 - Conta 998877-1",
    coin: "BRL",
  },
];