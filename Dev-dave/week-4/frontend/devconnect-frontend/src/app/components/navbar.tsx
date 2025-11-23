"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: "/homepage", label: "Home" },
    { href: "/createproject", label: "Create Project" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <nav className="w-full bg-amber-700 text-amber-50 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-amber-100 ">
          DevConnect
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${
                pathname === link.href
                  ? "text-amber-300 border-b-2 border-amber-300"
                  : "hover:text-amber-300"
              } transition`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/logout"
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition duration-200"
          >
            Logout
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-800 focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center bg-amber-50 text-amber-900 shadow-md py-4 space-y-4 text-sm font-medium animate-slideDown">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`${
                pathname === link.href
                  ? "text-amber-700 font-semibold"
                  : "hover:text-amber-600"
              } transition`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/logout"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition duration-200"
            >
            Logout
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
