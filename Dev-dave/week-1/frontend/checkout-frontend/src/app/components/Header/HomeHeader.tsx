"use client";
import Headerbutton from "./Headerbutton";

function HomeHeader() {

  return (
    <header className="flex justify-between   items-center p-4 bg-[rgb(19,25,33)] text-white">
      {/* Logo */}
      <div className="text-1xl md:text-2xl font-bold w-20 shrink-0 sm:w-30 md:w-40">
        <h1>PrimeGoods</h1>
      </div>

      {/* Search bar */}
      <div className="flex-1 mx-10">
        <input
          className="text-black bg-white text-[10px] h-10 px-2 w-23 sm:w-60 md:w-full"
          type="text"
          placeholder=""
        />
      </div>

      {/* Cart logo */}
      <div className="flex items-center w-20 shrink-0 sm:w-30 md:w-40 justify-center">
        <Headerbutton />
      </div>
    </header>
  );
}

export default HomeHeader;
