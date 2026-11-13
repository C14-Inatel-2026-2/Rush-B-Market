import Link from "next/link";
import ItemCard from "./ItemCard";
import type { Item } from "../../data/mockItems";

// Grade responsiva de cards; cada card leva ao detalhe da skin (/skin/[id])
export default function SkinGrid({ items }: { items: Item[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => (
        <Link key={item.id} href={`/skin/${item.id}`} className="grid min-w-0 grid-cols-1">
          <ItemCard
            name={item.name}
            category={item.category}
            price={item.price}
            image={item.image}
            wearLabel={item.wearLabel}
            floatValue={item.floatValue}
          />
        </Link>
      ))}
    </div>
  );
}
