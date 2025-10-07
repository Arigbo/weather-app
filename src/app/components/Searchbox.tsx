import cn from "@/utils/cn";
import React from "react";
import { FaSearch } from "react-icons/fa";
type Props = {
  className: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
  setSearch: any;
  search: any;
};
export default function SearchBox(props: Props) {
  return (
    <form
      action=""
      className={cn("", props.className)}
      onSubmit={props.onSubmit}
    >
      <input
        type="text"
        placeholder="Search Location"
        value={props.search}
        onChange={(e) => {
          props.onChange, props.setSearch(e.target.value);
        }}
      />
      <button className="">
        <FaSearch className="search" />
      </button>
    </form>
  );
}
