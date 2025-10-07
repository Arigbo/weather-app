import Image from "next/image";
import NavBar from "./components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <NavBar />
    </div>
  );
}
