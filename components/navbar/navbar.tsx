import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { NavbarProps } from "./navbar.types";
import styles from "@/components/navbar/navbar.module.css";

export default function Navbar({ username }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleClickHome = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    router.push("/");
  };

  const handleClickMyList = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    router.push("/browse/my-list");
  };

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link className={styles.logoLink} href="/">
          <div className={styles.logoWrapper}>
            <Image
              alt="Netflix Icon"
              src={"/static/netflix.svg"}
              width={150}
              height={40}
            />
          </div>
        </Link>
        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleClickHome}>
            Home
          </li>
          <li className={styles.navItem2} onClick={handleClickMyList}>
            My List
          </li>
        </ul>
        <nav className={styles.navContainer}>
          <div>
            <button className={styles.usernameBtn} onClick={toggleDropdown}>
              <p className={styles.username}>{username}</p>
              <Image
                alt="dropdown icon"
                src={"/static/dropdown.svg"}
                width={25}
                height={25}
              />
              {/* Expand more icons */}
            </button>
            {showDropdown && (
              <div className={styles.navDropdown}>
                <div>
                  <Link href="/login" className={styles.linkName}>
                    Sign Out
                  </Link>
                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
