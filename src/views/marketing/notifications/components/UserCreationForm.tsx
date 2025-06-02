import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export function UserCreationForm() {
  const [selectedArea, setSelectedArea] = useState("");

  return (
    <form className="space-y-4 rounded-xl bg-white p-6 shadow-md">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Enter your name" />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="your@email.com" />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="••••••••" />
      </div>

      <div>
        <Label>Área</Label>
        {/* <Select value={selectedArea} onValueChange={setSelectedArea}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="support">Support</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="compliance">Compliance</SelectItem>
            <SelectItem value="juridico">Jurídico</SelectItem>
          </SelectContent>
        </Select> */}
      </div>

      <Button type="submit" className="w-full">
        Create
      </Button>
    </form>
  );
}
