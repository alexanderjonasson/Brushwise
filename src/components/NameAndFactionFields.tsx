"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { factions, searchCatalog, type CatalogEntry } from "@/lib/catalog";
import { input, label, mutedText } from "@/lib/ui";

type Props = { defaultName?: string; defaultFaction?: string };

// The name field suggests known units as you type (an accessible combobox:
// arrow keys to move, Enter to pick, Escape to close). Picking one also fills
// in its faction. Anything can still be typed by hand.
export function NameAndFactionFields({ defaultName = "", defaultFaction = "" }: Props) {
  const [name, setName] = useState(defaultName);
  const [faction, setFaction] = useState(defaultFaction);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const listId = useId();
  const factionListId = useId();
  const suggestions = open ? searchCatalog(name) : [];
  const showList = suggestions.length > 0;

  function pick(entry: CatalogEntry) {
    setName(entry.name);
    setFaction(entry.faction);
    setOpen(false);
    setActive(-1);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((index) => Math.min(index + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && showList && active >= 0) {
      // Pick the highlighted suggestion instead of submitting the form
      event.preventDefault();
      pick(suggestions[active]);
    } else if (event.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="relative">
        <label className="block">
          <span className={label}>Name</span>
          <input
            name="name"
            required
            maxLength={80}
            placeholder="Start typing, e.g. Hive Tyrant"
            autoComplete="off"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showList}
            aria-controls={listId}
            aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
            className={input}
          />
        </label>

        {showList && (
          <ul
            id={listId}
            role="listbox"
            aria-label="Suggested units"
            className="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
            {suggestions.map((entry, index) => (
              <li
                key={`${entry.faction}/${entry.name}`}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === active}
                // mousedown instead of click, so the input doesn't lose focus first
                onMouseDown={(event) => {
                  event.preventDefault();
                  pick(entry);
                }}
                onMouseEnter={() => setActive(index)}
                className={`cursor-pointer px-3 py-2 text-sm ${
                  index === active ? "bg-amber-100 dark:bg-amber-950" : ""
                }`}>
                <span className="font-medium">{entry.name}</span>
                <span className={`block text-xs ${mutedText}`}>{entry.faction}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <label className="block">
        <span className={label}>
          Faction <span className={`font-normal ${mutedText}`}>(optional)</span>
        </span>
        <input
          name="faction"
          maxLength={60}
          placeholder="Filled in when you pick a unit"
          list={factionListId}
          value={faction}
          onChange={(event) => setFaction(event.target.value)}
          className={input}
        />
        <datalist id={factionListId}>
          {factions.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </label>
    </div>
  );
}
