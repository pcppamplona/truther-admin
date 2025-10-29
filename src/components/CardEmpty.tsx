import { FC, ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CardEmptyProps {
  title: string;
  subtitle: string | ReactNode;
}

export const CardEmpty: FC<CardEmptyProps> = ({ title, subtitle }) => {
  return (
    <Card className="flex flex-col items-center justify-center text-center p-10">
      <CardContent className="flex flex-col items-center justify-center text-center">
        <TriangleAlert className="text-chart-3 mb-4" />
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground max-w-md mt-2">{subtitle}</p>
      </CardContent>
    </Card>
  );
};
