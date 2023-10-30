import React from "react";
import Header from "@/components/home/Header";
import Chat from "@/components/home/Chat";
import Section3 from "@/components/home/Section3";
import Section4 from "@/components/home/Section4";
import { ToastContainer } from 'react-toastify';
export default function page() {
  return (
    <>
      <Chat />
      <Header />
      <Section3 />
      <Section4 />
    </>
  );
}