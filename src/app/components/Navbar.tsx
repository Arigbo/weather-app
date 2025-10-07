import React from "react";
import { IoMdLocate } from "react-icons/io";
import { IoLocation } from "react-icons/io5";
import { MdSunny } from "react-icons/md";
import SearchBox from "./Searchbox";
type Props = {};
export default function NavBar({}: Props) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="nav-inner-left">
          <h2 className="logo">Weather</h2>
          <MdSunny className="sun" />
        </div>
        <section className="nav-inner-right">
          <IoMdLocate className="location" />

          <p className="">
            {" "}
            <IoLocation className="pin" />
            Nigeria
          </p>
          <SearchBox />
        </section>
      </div>
    </nav>
  );
}
