import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/components/login-form";

export default function Login() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Admin - Gestão Truther
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
       <div className="hidden md:flex items-center justify-center">
        <img
          src="/Truther-Celular1.png"
          alt="Imagem do app Truther"
          className="w-[400px] lg:w-[600px] h-auto object-contain"
        />
      </div>
    </div>
  );
}
