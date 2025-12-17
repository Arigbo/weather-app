import { cn } from "@/utils/cn";
import { FaSearch } from "react-icons/fa";

interface SearchBoxProps {
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function SearchBox({
  className,
  value,
  onChange,
  onSubmit,
}: SearchBoxProps) {
  return (
    <form
      className={cn("flex items-center gap-2", className)}
      onSubmit={onSubmit}
    >
      <input
        type="text"
        placeholder="Search Location"
        value={value}
        onChange={onChange}
        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Search location"
      />
      <button
        type="submit"
        className="p-2 hover:bg-gray-100 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Search"
      >
        <FaSearch className="w-5 h-5" />
      </button>
    </form>
  );
}
