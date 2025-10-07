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
      className={cn("", props.className)}
      onSubmit={props.onSubmit}
    >
      <input
        type="text"
        onChange={props.onChange}
        placeholder="Search Location"
      />
      <button className="">
        <FaSearch className="search"/>
      </button>
    </form>
  );
}
