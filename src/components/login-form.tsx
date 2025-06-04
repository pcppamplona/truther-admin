import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/store/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { authenticate, loading, error, user } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  console.log(username, password)

  await authenticate(username, password);

  if (user) {
    navigate("/dashboard");
  } else {
    toast.error("Usuário ou senha inválidos.");
  }
};

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Faça o login com sua conta</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Insira seu nome de usuário e senha para acessar sua conta
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username">E-mail</Label>
          <Input
            id="username"
            type="email"
            placeholder="exemplo@dominio.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Esqueceu sua senha?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          className="w-full cursor-pointer"
          type="submit"
          disabled={loading}
        >
          {loading ? "Carregando..." : "Login"}
        </Button>

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            ou continue com
          </span>
        </div>

        <Button variant="outline" className="w-full">
          <Mail />
          Login com SmartPay
        </Button>
      </div>

      <div className="text-center text-sm">
        Ainda não tem conta?{" "}
        <a
          href="#"
          className="underline underline-offset-4 text-green-400 font-bold"
        >
          Cadastre-se
        </a>
      </div>
    </form>
  );
}
