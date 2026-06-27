"use client";
import rmjLogo from "../../../public/logo-rmj.svg";
import bdmgLogo from "../../../public/logo-bdmg-white.png";

export default function FormLogo() {
  return (
    <div className="h-14 flex items-center gap-4">
      <img
        src={rmjLogo.src}
        alt="RMJ Soluções de Crédito"
        className="h-14 w-auto object-contain"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.style.display = "none";
          const fallback = img.nextElementSibling as HTMLElement;
          if (fallback) fallback.classList.remove("hidden");
        }}
      />
      <div className="hidden items-center gap-2.5">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "#ee661b" }}
        >
          <span className="text-white font-bold text-sm">RMJ</span>
        </div>
        <div>
          <p className="text-white font-bold text-base leading-tight">RMJ Soluções de Crédito</p>
        </div>
      </div>

      <div className="w-px h-8 bg-white/20 hidden sm:block"></div>

      <img
        src={bdmgLogo.src}
        alt="Parceiro Oficial BDMG"
        className="h-12 w-auto object-contain"
      />
    </div>
  );
}
