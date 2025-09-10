import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import type { Magic } from "magic-sdk";
import styles from "@/components/navbar/navbar.module.css";

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState("");
  const magic = useRef<Magic | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function getUsername() {
      const { getMagic } = await import("@/lib/magic-client");
      magic.current = getMagic();
      try {
        const { email } = await magic.current.user.getInfo();
        console.log("user info: ", email);
        if (email) setUsername(email);
      } catch (e) {
        console.error(`Error getting user info`, e);
      }
    }
    getUsername();
  }, []);

  const handleSignOut = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      if (magic.current) {
        await magic.current.user.logout();
        console.log(await magic.current.user.isLoggedIn()); // => `false`
        router.push("/login");
      }
    } catch (e) {
      // Handle errors if required!
      console.error("Error during logout", e);
    }
  };

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
                  <Link
                    href="/login"
                    className={styles.linkName}
                    onClick={handleSignOut}
                  >
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
