"use client";

import LoginCard from "@/components/Login/LoginCard";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";

import logo from "@/public/sc4c_logo.png";
import { NextPageWithLayout } from "@/ui/Layout/NextPageWithLayout";

const Home: NextPageWithLayout = () => {
  const router = useRouter();
  // const { data: me, isFetched } = useGetAuthMe();
  // useEffect(() => {
  //   if (isFetched && me) {
  //     router.push(`/dashboard`);
  //   }
  // }, [me, isFetched, router]);
  return (
    <div className="p-6 bg-white md:p-24 min-h-screen md:h-screen md:overflow-hidden">
      <div className="flex flex-col items-center  h-full  md:mt-24  relative">
        <Image alt="Senvisio Logo" src={logo} className="w-[300px] mb-6" />
        <div className="flex max-w-[400px] w-full flex-col gap-7">
          <div className="font-semibold text-center md:text-lg text-dark">
            Zaloguj się na swoje konto
          </div>

          <div className="w-full ">
            <LoginCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
