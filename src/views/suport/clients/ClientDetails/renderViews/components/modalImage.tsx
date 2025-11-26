
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Maximize } from "lucide-react";

type ModalImageProps = {
  src: string;
  alt: string;
  className?: string; 
};

export function ModalImage({ src, alt, className }: ModalImageProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className={`relative group cursor-pointer ${className}`}>
          <img
            src={src}
            alt={alt}
            className="rounded border border-border  object-cover w-full h-full"
          />

          <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow group-hover:scale-110 transition-transform">
            <Maximize size={16} color="black" />
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-3xl p-0 bg-transparent border-none">
        <img src={src} alt={alt} className="w-full h-auto rounded-lg" />
      </DialogContent>
    </Dialog>
  );
}
