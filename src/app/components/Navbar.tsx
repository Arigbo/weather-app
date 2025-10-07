"use client";
import React, { useState } from "react";
import { IoMdLocate } from "react-icons/io";
import { IoLocation } from "react-icons/io5";
import { MdSunny } from "react-icons/md";
import SearchBox from "./Searchbox";
  var location= "alakahia";
type Props = {
  onClick: React.MouseEventHandler<SVGElement> | undefined;
  search:undefined
  location: string;
};
export default function NavBar(props: Props) {
  const [search, setSearch] = useState();

  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="nav-inner-left">
          <h2 className="logo">Weather</h2>
          <MdSunny className="sun" />
        </div>
        <section className="nav-inner-right">
          <IoMdLocate
            className="location"
            title="Your Location"
            onClick={() => setSearch(location)}
          />
          <p className="">
            {" "}
            <IoLocation className="pin" />
            {search}
          </p>
          <SearchBox setSearch={setSearch} search={search} />
        </section>
      </div>
    </nav>
  );
}
