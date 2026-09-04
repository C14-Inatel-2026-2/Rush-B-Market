import ItemCard from "./_components/ItemCard";
import { mockItems } from "../data/mockItems";

export default function Home() {
  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {mockItems.map((item) => (
            <ItemCard 
              key={item.id} 
              name={item.name}
              category={item.category}
              price={item.price}
              image={item.image}
              wearLabel={item.wearLabel}
              floatValue={item.floatValue}
            />
          ))}
        </div>
      </div>
    </main>
  );
}