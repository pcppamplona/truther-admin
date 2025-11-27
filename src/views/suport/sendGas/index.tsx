import { useState } from "react";
import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSendGas } from "@/services/support/useSupport";
import type { SendGasPayload } from "@/services/support/useSupport";
import { toast } from "sonner";
import { useI18n } from "@/i18n";

export default function SendGas() {
  const [ticket, setTicket] = useState("");
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState<SendGasPayload["network"] | "">("");

  const { mutateAsync: sendGas, isPending } = useSendGas();
  const { t } = useI18n();

  const handleReset = () => {
    setTicket("");
    setAddress("");
    setNetwork("");
  };

  const handleSubmit = async () => {
    if (!ticket.trim() || !address.trim() || !network) {
      toast.error(t("supportPages.sendGas.toast.missingFields"));
      return;
    }

    try {
      await sendGas({ ticket, address, network });
      toast.success(t("supportPages.sendGas.toast.successTitle"), {
        description: t("supportPages.sendGas.toast.successDescription")
          .replace("{{ticket}}", ticket)
          .replace("{{network}}", network),
      });
      handleReset();
    } catch (error: any) {
      toast.error(t("supportPages.sendGas.toast.errorTitle"), {
        description:
          error?.response?.data?.message ??
          t("supportPages.sendGas.toast.errorDescription"),
      });
    }
  };

  return (
    <SidebarLayout
      breadcrumb={[{ label: t("sidebar.support.title"), href: "clients" }]}
      current={t("sidebar.support.sendGas")}
    >
      <div className="flex flex-1 flex-col max-h-screen overflow-y-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">
                {t("supportPages.sendGas.title")}
              </CardTitle>
              <CardDescription>
                {t("supportPages.sendGas.description")}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Input
                type="text"
                name="ticket"
                placeholder={t("supportPages.sendGas.fields.ticket")}
                value={ticket}
                onChange={(e) => setTicket(e.target.value)}
                disabled={isPending}
              />

              <Input
                type="text"
                name="address"
                placeholder={t("supportPages.sendGas.fields.address")}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isPending}
              />

              <Select value={network} onValueChange={setNetwork} disabled={isPending}>
                <SelectTrigger>
                  <SelectValue placeholder={t("supportPages.sendGas.fields.network")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="polygon">
                    <div className="flex items-center gap-2">
                      <img src="/polygon.png" alt="polygon" className="w-5 h-5" />
                      Polygon
                    </div>
                  </SelectItem>
                  <SelectItem value="liquid">
                    <div className="flex items-center gap-2">
                      <img src="/liquid.png" alt="liquid" className="w-5 h-5" />
                      Liquid
                    </div>
                  </SelectItem>
                  <SelectItem value="bitcoin">
                    <div className="flex items-center gap-2">
                      <img src="/bitcoin.png" alt="bitcoin" className="w-5 h-5" />
                      Bitcoin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>

            <CardFooter className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleReset} disabled={isPending}>
                {t("supportPages.sendGas.actions.cancel")}
              </Button>
              <Button onClick={handleSubmit} disabled={isPending}>
                {isPending
                  ? t("supportPages.sendGas.actions.loading")
                  : t("supportPages.sendGas.actions.submit")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
}
