import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [userMsg, setUserMsg] = useState("");

  const router = useRouter();

  const handleLoginWithEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const cleanedEmail = email.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail);

    if (isValidEmail) {
      if (email === "1@gmail.com") {
        setUserMsg("");
        router.push("/");
        return console.log("Success, Route to dashboard");
      } else {
        setUserMsg("");
        return console.log("Incorrect credentials");
      }
    } else {
      setUserMsg("Enter a valid email address");
      return console.log("Incorrect email format");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMsg("");
    const email = e.target.value;
    setEmail(email);
    console.log(email);
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
          <p className={styles.userMsg}>{userMsg}</p>
          <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
            Sign In
          </button>
        </div>
      </main>
    </div>
  );
}
