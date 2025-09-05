import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Login.module.css";

export default function Login() {
  const handleLoginWithEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("login button clicked");
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const change = e.target.value;
    console.log(change);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix SignIn</title>
      </Head>
      <header className={styles.header}>
        <div className={styles.headerWrapper}>
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
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>
          <input
            type="text"
            placeholder="Email Address"
            className={styles.emailInput}
            onChange={handleChange}
          ></input>
          <p className={styles.userMsg}>Enter a valid email address</p>
          <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
            Sign In
          </button>
        </div>
      </main>
    </div>
  );
}
