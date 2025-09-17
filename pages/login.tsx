import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [userMsg, setUserMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  const handleLoginWithEmail = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    const cleanedEmail = email.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail);

    if (isValidEmail) {
      if (email === "1@gmail.com") {
        try {
          setIsLoading(true);
          const { getMagic } = await import("@/lib/magic-client");
          const magic = getMagic();
          const didToken = await magic.auth.loginWithMagicLink({
            email: email,
          });
          if (didToken) {
            await router.push("/");
            return;
          }
        } catch (e) {
          // Handle errors if required!
          setUserMsg("Something went wrong logging in");
          console.error("Something went wrong logging in", e);
        }
      } else {
        setUserMsg("Incorrect credentials");
        return console.log("Incorrect credentials");
      }
    } else {
      setUserMsg("Incorrect email format");
      return console.log("Incorrect email format");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMsg("");
    const email = e.target.value;
    setEmail(email);
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
            value={email}
          ></input>
          <p className={styles.userMsg}>{userMsg}</p>
          <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </main>
    </div>
  );
}
