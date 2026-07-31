"use client";

import { useState } from "react";
import { Tag } from "lucide-react";
import { toggleEquipmentCheck } from "./actions";

export interface EquipmentItem {
  id: string;
  text: string;
  category: string;
  isRentable: boolean;
  isChecked: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  clothing: "Одежда",
  footwear: "Обувь",
  gear: "Снаряжение",
  documents: "Документы",
  other: "Другое",
};

export default function EquipmentChecklist({ items: initialItems }: { items: EquipmentItem[] }) {
  const [items, setItems] = useState(initialItems);

  async function handleToggle(id: string) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const next = !item.isChecked;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isChecked: next } : i)));
    const result = await toggleEquipmentCheck(id, next);
    if (!result.ok) {
      // Revert on failure.
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isChecked: !next } : i)));
      alert(result.error);
    }
  }

  const categories = Array.from(new Set(items.map((i) => i.category)));
  const checkedCount = items.filter((i) => i.isChecked).length;

  return (
    <div>
      <p className="text-xs text-mist mb-4">
        Собрано: {checkedCount} / {items.length}
      </p>
      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
        {categories.map((cat) => (
          <div key={cat}>
            <h3 className="text-xs uppercase tracking-wide text-glacier-light mb-2">
              {CATEGORY_LABELS[cat] ?? cat}
            </h3>
            <ul className="flex flex-col gap-2">
              {items
                .filter((i) => i.category === cat)
                .map((item) => (
                  <li key={item.id}>
                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.isChecked}
                        onChange={() => handleToggle(item.id)}
                        className="w-4 h-4 mt-0.5 shrink-0"
                      />
                      <span className={item.isChecked ? "text-mist line-through" : "text-snow"}>
                        {item.text}
                      </span>
                      {item.isRentable && (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase text-glacier-light border border-glacier-light/40 px-1.5 py-0.5 shrink-0">
                          <Tag className="w-2.5 h-2.5" />
                          есть в аренду
                        </span>
                      )}
                    </label>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
