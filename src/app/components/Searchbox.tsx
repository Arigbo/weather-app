import cn from "@/utils/cn";
import React from "react";
import { FaSearch } from "react-icons/fa";
type Props = {
  className: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
};
export default function SearchBox(props: Props) {
  return (
    <form
      action=""
      className={cn("flex relative items-center jusify-center h-10", props.className)}
      onSubmit={props.onSubmit}
    >
      <input
        type="text"
        onChange={props.onChange}
        placeholder="Serch Location"
        className="px-4 py-2 w-[230px] border-gray-300 rounded-1-md focus:outline-none focus:border-blue-500 h-full"
      />
      <button className="px-4">
        <FaSearch />
      </button>
    </form>
  );
}
