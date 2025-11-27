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
import { Textarea } from "@/components/ui/textarea";
import { useDecode } from "@/services/support/useSupport";
import { toast } from "sonner";
import { useI18n } from "@/i18n";

export default function Decode() {
  const [code, setCode] = useState("");
  const [decodedResult, setDecodedResult] = useState("");

  const { mutateAsync: decode, isPending } = useDecode();
  const { t } = useI18n();

  const handleReset = () => {
    setCode("");
    setDecodedResult("");
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error(t("supportPages.decode.toast.emptyField"));
      return;
    }

    try {
      const data = await decode({ data: code });
      const decodedText =
        typeof data === "string"
          ? data
          : (data as any)?.decoded ??
            (data as any)?.message ??
            JSON.stringify(data, null, 2);

      setDecodedResult(decodedText ?? "");
      toast.success(t("supportPages.decode.toast.successTitle"));
    } catch (error: any) {
      setDecodedResult("");
      toast.error(t("supportPages.decode.toast.errorTitle"), {
        description:
          error?.response?.data?.message ??
          t("supportPages.decode.toast.errorDescription"),
      });
    }
  };

  return (
    <SidebarLayout
      breadcrumb={[{ label: t("sidebar.support.title"), href: "/clients" }]}
      current={t("sidebar.support.decode")}
    >
      <div className="flex flex-1 flex-col max-h-screen overflow-y-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">
                {t("supportPages.decode.title")}
              </CardTitle>
              <CardDescription>
                {t("supportPages.decode.description")}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Textarea
                placeholder={t("supportPages.decode.inputPlaceholder")}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isPending}
              />

              <Textarea
                placeholder={t("supportPages.decode.resultPlaceholder")}
                value={decodedResult}
                readOnly
                disabled={isPending}
              />
            </CardContent>

            <CardFooter className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isPending}
              >
                {t("supportPages.decode.actions.cancel")}
              </Button>
              <Button
                className="bg-primary text-white"
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending
                  ? t("supportPages.decode.actions.loading")
                  : t("supportPages.decode.actions.submit")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
}
