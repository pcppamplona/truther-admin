import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Transactions() {
  return (
    <SidebarLayout current="Transações">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Link to="/transactions/pix-in">
            <Button>PIX IN</Button>
          </Link>
          <Link to="/transactions/pix-out">
            <Button>PIX OUT</Button>
          </Link>
        </div>
      </div>
    </SidebarLayout>
  );
}
