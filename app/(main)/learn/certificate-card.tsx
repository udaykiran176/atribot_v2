"use client";

import { Medal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export const CertificateCard = () => {
  const router = useRouter();

  return (
    <Card className="border-2 border-blue-300 shadow-md">
      <CardHeader >
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <Medal className="h-6 w-6 text-blue-600" />
            Get Certificate
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground mb-4">
          Complete all challenges to unlock your certificate of completion!
        </p>
        <Button
          onClick={() => router.push("/certificate")}
          variant="secondary"
        > 
          Unlock Certificate
        </Button>
      </CardContent>
    </Card>
  );
};