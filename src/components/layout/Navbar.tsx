import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { navBarFields } from "@/app/helpers/contants";
import { signOut } from "next-auth/react";
import appLogo from "@/assets/images/app_logo.png";
import Image from "next/image";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [navBarMenu, setNavBarMenu] = useState(navBarFields);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const handleDropDown = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<HTMLLIElement, MouseEvent>,
    idx: number
  ) => {
    e.stopPropagation(); // Prevent click event from bubbling to the parent element
    const updatedMenu = [...navBarMenu];
    updatedMenu[idx].showDropdown = !updatedMenu[idx].showDropdown;
    setNavBarMenu(updatedMenu);
    // setDropdownVisible(!dropdownVisible);
  };
  const handleMouseDropDown = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<HTMLLIElement, MouseEvent>,
    idx: number,
    isDropdown: boolean
  ) => {
    e.stopPropagation(); // Prevent click event from bubbling to the parent element
    const updatedMenu = [...navBarMenu];
    updatedMenu[idx].showDropdown = isDropdown;
    setNavBarMenu(updatedMenu);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleLogout = async () => {
    await signOut({
      callbackUrl: `${process.env.NEXTAUTH_URL}/sign-in`,
      redirect: true,
    });
  };

  return (
    <nav className=" border-gray-200  bg-green-300">
      <div className="container flex flex-wrap items-center justify-between px-6 py-3 mx-auto">
        <Link
          href={"/"}
          className="self-center w-[150px] font-semibold whitespace-nowrap"
        >
          Admin
          {/* <Image src={appLogo} alt="App Logo" /> */}
          {/* FingerPrint Zero */}
        </Link>
        <button
          data-collapse-toggle="navbar-dropdown"
          type="button"
          className="inline-flex items-center justify-center w-10 h-10 p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
          aria-controls="navbar-dropdown"
          aria-expanded={isDropdownOpen}
          onClick={toggleDropdown}
        >
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`w-full md:block md:w-auto ${
            isDropdownOpen ? "" : "hidden"
          }`}
          id="navbar-dropdown"
        >
          <ul className="flex flex-col p-4 mt-4 font-medium  md:p-0 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
            {navBarMenu.map((navItem, idx) => (
              <>
                <div key={navItem.route}>
                  {navItem.name == "Logout" ? (
                    <li className="relative" key={idx}>
                      <button
                        onClick={handleLogout}
                        className="flex items-center px-3 py-1 text-white bg-gray-800 rounded-md md:border-0 "
                      >
                        Logout
                      </button>
                    </li>
                  ) : (
                    <li
                      className="relative"
                      onMouseLeave={
                        !isMobile
                          ? (e: React.MouseEvent<HTMLLIElement, MouseEvent>) =>
                              handleMouseDropDown(e, idx, false)
                          : () => {}
                      }
                      key={navItem.name}
                    >
                      <button
                        id="dropdownNavbarLink"
                        data-dropdown-toggle="dropdownNavbar"
                        className="flex items-center justify-between w-full px-3 py-2 text-gray-900  hover:text-gray-500 md:border-0 md:p-0 md:w-auto "
                        onClick={
                          navItem.dropdownOptions &&
                          navItem.dropdownOptions.length > 0 &&
                          isMobile
                            ? (
                                e: React.MouseEvent<
                                  HTMLButtonElement,
                                  MouseEvent
                                >
                              ) => handleDropDown(e, idx)
                            : () => router.push(navItem.route)
                        }
                        onMouseEnter={
                          !isMobile
                            ? (
                                e: React.MouseEvent<
                                  HTMLButtonElement,
                                  MouseEvent
                                >
                              ) => handleMouseDropDown(e, idx, true)
                            : () => {}
                        }
                      >
                        {navItem.name}
                        {navItem.showDropdown}
                        {navItem.dropdownOptions &&
                        navItem.dropdownOptions.length > 0 ? (
                          <svg
                            className="w-2.5 h-2.5 ms-2.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 10 6"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="m1 1 4 4 4-4"
                            />
                          </svg>
                        ) : (
                          ""
                        )}
                      </button>
                      {/* <!-- Dropdown menu --> */}
                      {navItem.dropdownOptions &&
                      navItem.dropdownOptions.length > 0 &&
                      navItem.showDropdown ? (
                        <div
                          id="dropdownNavbar"
                          className={`z-10 ${
                            navItem.showDropdown ? "block" : "hidden"
                          } font-normal bg-white divide-y divide-gray-100 shadow  `}
                        >
                          <ul
                            className="unset md:absolute md:w-[150px] left-0 py-1 text-sm ring-1 ring-gray-100 bg-white z-10 rounded-md "
                            aria-labelledby="dropdownLargeButton"
                          >
                            {navItem.dropdownOptions.map((option, index) => (
                              <li className="text-gray-700" key={option.route}>
                                <Link
                                  href={option.route}
                                  className="z-10 block px-3 text-left py-2 text-[13px] font-semibold hover:bg-gray-100 "
                                  key={index}
                                >
                                  {option.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        ""
                      )}
                    </li>
                  )}
                </div>
              </>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
