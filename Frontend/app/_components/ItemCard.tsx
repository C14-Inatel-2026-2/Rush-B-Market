import Image from 'next/image';
import { Item } from '../../lib/mockItems'; // Importe a interface aqui

export default function ItemCard({ name, category, price, image, wearLabel, floatValue }: Item) {
  return (
    <div className="relative flex flex-col border border-[#2a2f37] bg-[#0d1014] p-3 font-mono transition-colors hover:border-[#35c9d8] group cursor-pointer">
      {/* Etiqueta de Condição (ex: FN) */}
      <div className="absolute top-0 right-0 border-b border-l border-[#2a2f37] bg-[#0a0b0d] px-2 py-1 text-[10px] font-bold text-[#d4a72c] tracking-[0.15em]">
        {wearLabel}
      </div>
      
      {/* Container da Imagem */}
      <div className="relative mb-3 flex h-28 items-center justify-center">
        <Image 
          src={image} 
          alt={name} 
          fill 
          className="object-contain transition-transform group-hover:scale-105" 
        />
      </div>

      {/* Textos da Skin */}
      <div className="mb-1 truncate text-[10px] tracking-[0.15em] text-[#5a6069]">
        {category}
      </div>
      <div className="mb-3 truncate text-[11px] tracking-[0.1em] text-[#d4d7dd]">
        ★ {name}
      </div>

      {/* Rodapé: Preço e Float */}
      <div className="mt-auto flex items-baseline justify-between border-t border-white/5 pt-2">
        <span className="text-[13px] text-[#e8eaed]">${price.toFixed(2)}</span>
        <span className="text-[10px] tracking-[0.1em] text-[#5a6069]">{floatValue}</span>
      </div>
    </div>
  );
}