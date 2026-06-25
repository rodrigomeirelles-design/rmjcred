"use client";

export default function FormLogo() {
  return (
    <div className="h-10 flex items-center">
      <img
        src="/logo-rmj.svg"
        alt="RMJ Soluções de Crédito"
        className="h-10 w-auto object-contain"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.style.display = "none";
          const fallback = img.nextElementSibling as HTMLElement;
          if (fallback) fallback.classList.remove("hidden");
        }}
      />
      <div className="hidden items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "#ee661b" }}
        >
          <span className="text-white font-bold text-sm">RMJ</span>
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">RMJ Soluções de Crédito</p>
          <p className="text-xs font-semibold" style={{ color: "#f2814a" }}>Parceiro Oficial BDMG</p>
        </div>
      </div>
    </div>
  );
}
