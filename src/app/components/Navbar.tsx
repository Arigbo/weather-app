import React from "react";
import { IoMdLocate } from "react-icons/io";
import { IoLocation } from "react-icons/io5";
import { MdSunny } from "react-icons/md";
import SearchBox from "./Searchbox";
type Props = {};
export default function NavBar({}: Props) {
  return (
    <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
      <div className="h-80px w-full flex justify-between items-center max-w-7xl px-3 max-auto">
        <p className="flex items-center justify-center gap-2">
          <h2 className="text-gray-500 text-3xl">Weather</h2>
          <MdSunny className="text-3xl mt-1 text-yellow-300" />
        </p>
        <section className="flex gap-2 items-center">
          <IoMdLocate className="text-2xl text-gray-400 hover:opacity-80 cursor-pointer "/>
          <IoLocation className="text-3xl" />
          <p className="text-slate-900/80 text-sm">Nigeria</p>
          <SearchBox/>
        </section>
      </div>
    </nav>
  );
}
