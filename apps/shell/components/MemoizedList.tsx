"use client";

// MODÜL 2 · Memoization Mastery
// memo: component'i memoize eder (aynı props ile yeniden render etmez)
// useMemo: hesaplanan bir değeri memoize eder
// useCallback: bir fonksiyon referansını memoize eder
//
// Not: Bu teknikleri her yerde kullanmak "over-optimization" riskidir —
// önce React DevTools Profiler ile gerçek bottleneck'i tespit edin.

import { memo, useCallback, useMemo, useState } from "react";

type Item = { id: string; label: string };

const ListRow = memo(function ListRow({
  item,
  onSelect,
}: {
  item: Item;
  onSelect: (id: string) => void;
}) {
  return (
    <li
      onClick={() => onSelect(item.id)}
      className="rounded-lg bg-card2 px-3 py-2 cursor-pointer hover:bg-card"
    >
      {item.label}
    </li>
  );
});

export default function MemoizedList({ items }: { items: Item[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  // useMemo: filter değişmediği sürece yeniden hesaplanmaz
  const filteredItems = useMemo(
    () => items.filter((i) => i.label.toLowerCase().includes(filter.toLowerCase())),
    [items, filter]
  );

  // useCallback: ListRow'a sabit bir fonksiyon referansı geçirilir,
  // böylece memo(ListRow) gereksiz yere re-render olmaz.
  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filtrele..."
        className="w-full rounded-lg bg-card2 px-3 py-2 mb-3 outline-none"
      />
      <ul className="space-y-2">
        {filteredItems.map((item) => (
          <ListRow key={item.id} item={item} onSelect={handleSelect} />
        ))}
      </ul>
      {selectedId && (
        <p className="text-muted text-sm mt-3">Seçili: {selectedId}</p>
      )}
    </div>
  );
}
