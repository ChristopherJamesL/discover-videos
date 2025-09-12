import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto_Slab } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "@/components/loading/loading";

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  const [checkingAuth, setCheckingAuth] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const { getMagic } = await import("@/lib/magic-client");
        const magic = getMagic();
        const isloggedIn = await magic.user.isLoggedIn();

        if (!isloggedIn) {
          router.replace("/login");
        }
      } catch (e) {
        console.error("Error checking login status", e);
        router.replace("/login");
      } finally {
        setCheckingAuth(false);
      }
    };
    checkLogin();
  }, []);

  useEffect(() => {
    const handleComplete = () => setCheckingAuth(false);

    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <>
      {checkingAuth ? (
        <Loading />
      ) : (
        <main className={robotoSlab.className}>
          <Component {...pageProps} />
        </main>
      )}
    </>
  );
}
