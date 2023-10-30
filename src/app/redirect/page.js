"use client";

import React, { useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../../redux/auth/authSlice'

const Redirect = () => {

    const dispatch = useDispatch()
    const searchParams = useSearchParams()
    const router = useRouter()
    useEffect(() => {
      const code = searchParams.get('code')
    if (code) {
      const serverEndpoint = `https://95.217.124.180:8001/users/login/google?code=${code}`;
      axios
        .post(serverEndpoint)
        .then((response) => {
          if (response.status === 200) {
              // dispatch(setCredentials({access_token:response.data.access_token}))
              window.sessionStorage.setItem("access_token", response.data.access_token);
              router.push("/panel")
          } else {
              router.push("/login")
          }
        })
        .catch((error) => {
            router.push("/login")
        });
    } else {

    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Image
        src="Confused.svg"
        alt="login image"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "20%", height: "auto" }}
      />
      <h1 className="mt-2 font-extrabold">Loading...</h1>
    </div>
  );
};

export default Redirect;
