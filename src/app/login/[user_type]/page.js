"use client";
import Image from "next/image";
import { useEffect } from "react";
const Login = ({params}) => {
  const user_type = params.user_type;
  
  const googleLogin = () => {
    // Replace with your Google OAuth 2.0 client ID and redirect URI
    const clientId =
      // "188888100839-1840iic8vn85kj85a28gqcn92262lblm.apps.googleusercontent.com";
      "120362233982-h7gv79n7ap48v7k9s9t8kqml00auhbo4.apps.googleusercontent.com";
    // const clientSecret = "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";
    const clientSecret = "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";
    const redirectUri = "https://wafi-six.vercel.app/redirect";
    const authUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=email%20profile`;
    window.location.href = authUrl;
  };
  useEffect(() => {
    localStorage.setItem("user_type", user_type)
  }, [])
  return (
    <>
      <body suppressHydrationWarning={true} className="max-h-screen">
        <section className="bg-gray-100 md:bg-[#f9f9f9] min-h-screen flex items-center justify-center">
          <div className="flex-col bg-gray-100 p-5 rounded-2xl md:shadow-lg w-full items-center md:w-3/5 flex-col flex-col md:flex-col">
            <div className="flex flex-col md:flex-row mb-7">
              <div className="w-full md:w-1/2 px-5 flex flex-col justify-center items-center rounded-r-[48px]">
              <div className="flex flex-col  items-center m-10">
              <Image
                src="/logo.png"
                alt="login image"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
                <h2 className=" text-3xl  md:text-2xl lg:text-3xl font-bold text-[#333333] font-inter mb-6 sm:mb-8 md:mb-10 lg:mb- xl:mb-20 text-center">
                  <span>Welcome</span> to
                  <br />
                  Our <span className="text-[#00FFB6]">Login</span> Page
                </h2>
                <button
                  onClick={googleLogin}
                  className="bg-[#DB4437] hover:bg-[#f24f41] hover:border-[#ed6f07]
         py-3 w-full rounded-xl  flex justify-center
         items-center text-sm hover:scale-105 duration-300 hover:bg-[#00FFB6] md:py-2 hover:border-4"
                >
                  <Image
                    src="/1534129544.svg"
                    alt="login image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{
                      width: "7%",
                      height: "auto",
                      background: "white",
                      borderRadius: "100%",
                    }}
                  />
                  <span className="m-2 text-[#ffff] font-bold ">Login with Google</span>
                </button>
              </div>

              <div className="w-full md:w-1/2 mt-5 md:mt-0">
                <Image
                  src="/mobile.svg"
                  alt="login image"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </body>
    </>
  );
};

export default Login;
