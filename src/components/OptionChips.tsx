import clsx from "clsx";

interface OptionChipsProps {
  options: string[];
  selected?: string[];
  multiSelect?: boolean;
  onSelect: (value: string) => void;
}

export default function OptionChips({
  options,
  selected = [],
  multiSelect = false,
  onSelect,
}: OptionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {options.map((opt) => {
        const isSelected = selected.includes(opt);
        return (
          <button
            key={opt}
            className={clsx("chip", isSelected && "selected")}
            onClick={() => onSelect(opt)}
            aria-pressed={isSelected}
            type="button"
          >
            <span>{opt}</span>
            {multiSelect && isSelected && (
              <span style={{ marginLeft: 6, fontSize: 12 }}>✓</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
