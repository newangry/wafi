'use client';
import Link from "next/link"
import Image from "next/image"
import "../../style/home/home.css"
import {usePathname} from 'next/navigation'
import {GiHamburgerMenu} from "react-icons/gi";
import {useState} from "react";
import {IoMdClose} from "react-icons/io";
import {useSelector} from "react-redux";

function Navbar() {
    const [isShowNavbar, setIsShowNavbar] = useState(false);
    const handleToggleNavbar = () => {
        setIsShowNavbar(!isShowNavbar)
    }

    const access_token = useSelector((state) => state.auth.access_token)

    const pathname = usePathname()
    return (
        <nav className="relative mt-4">
            <div className=" w-full h-[4.2rem] flex items-center justify-between lg:px-10 px-8 z-20">
            <div className="w-[40%] sm:w-[25%] md:w-[15%]">
                    <Link href="/">
                        <Image src="/logo.png" alt="logo" width={0}
                               height={0}
                               sizes="100vw"
                               style={{width: '65%', height: 'auto'}}/>
                    </Link>
                </div>
                <div className="w-[62%] justify-end items-center hidden md:flex">
                    <ul className="flex gap-2">
                        <li><Link href="/" className="font-[200] lg:px-3 px-1 py-2"><span
                            className={pathname === "/" ? "activeNavLink" : "text-black"}> Home</span></Link></li>
                        <li><Link href="/FAQ" className="font-[200] lg:px-3 px-1 py-2"><span
                            className={pathname === "/FAQ/" ? "activeNavLink" : "text-black"}>FAQ</span></Link>
                        </li>
                        <li><Link href="/Claims" className="font-[200] lg:px-3 px-1 py-2"><span
                            className={pathname === "/Claims/" ? "activeNavLink" : "text-black"}>Claims</span></Link>
                        </li>
                        <li><Link href="/Giveback" className="font-[200] lg:px-3 px-1 py-2"><span
                            className={pathname === "/Giveback/" ? "activeNavLink" : "text-black"}>Giveback</span></Link>
                        </li>
                        <li><Link href="/Blog" className="font-[200] lg:px-3 px-1 py-2"><span
                            className={pathname === "/Blog/" ? "activeNavLink" : "text-black"}>Blog</span></Link>
                        </li>
                        <li><Link href="/Covid-19" className="font-[200] lg:px-3 px-1 py-2"><span
                            className={pathname === "/Covid-19/" ? "activeNavLink" : "text-black"}>Covid-19</span></Link>
                        </li>
                        <li><Link href="/Pet" className="font-[200] lg:px-3 px-1 py-2"><span
                            className={pathname === "/Pet/" ? "activeNavLink" : "text-black"}>Pet</span></Link>
                        </li>
                        
                        
                    </ul>
                </div>
                <div>
                    <Link href={"/login/user"}><button className="bg-[#00FFB6] hover:bg-[#11e0a6]  lg:px-4 px-3 py-2 rounded-full">MY ACCOUNT</button></Link>
                </div>
                <div className="md:hidden">
                    <button onClick={handleToggleNavbar} className="transition-all duration-900">
                        {
                            isShowNavbar ? (
                                <IoMdClose className="text-4xl text-[#ddd]" />
                            ) : (
                                <GiHamburgerMenu className="text-4xl text-[#ddd]"/>
                            )
                        }
                    </button>
                </div>
              
            </div>
            <div className="absolute left-0 right-0 transition-all duration-700 md:hidden z-10" style={isShowNavbar ? {top:"4rem"}:{top:"-30rem"}} >

                <div className=" px-10 pb-4 bg-[#ddd]">
                    <ul className="flex flex-col">
                        <li className=""><Link href="/" className="font-[200] block p-4 hover:bg-neutral-400" onClick={handleToggleNavbar}><span
                            className={pathname === "/" ? "activeNavLink" : "text-black"}>Home</span></Link></li>
                        <li className=""><Link href="/FAQ" className="font-[200] block p-4 hover:bg-neutral-400" onClick={handleToggleNavbar}><span
                            className={pathname === "/FAQ/" ? "activeNavLink" : "text-black"} >FAQ</span></Link>
                        </li>
                        <li className=""><Link href="/Claims" className="font-[200] block p-4 hover:bg-neutral-400" onClick={handleToggleNavbar}><span
                            className={pathname === "/Claims/" ? "activeNavLink" : "text-black"}>Claims</span></Link>
                        </li>
                        <li className=""><Link href="/Giveback" className="font-[200] block p-4 hover:bg-neutral-400" onClick={handleToggleNavbar}><span
                            className={pathname === "/Giveback/" ? "activeNavLink" : "text-black"}>Giveback</span></Link>
                        </li>
                        <li className=""><Link href="/Blog" className="font-[200] block p-4 hover:bg-neutral-400" onClick={handleToggleNavbar}><span
                            className={pathname === "/Blog/" ? "activeNavLink" : "text-black"}>Blog</span></Link>
                        </li>
                        <li className=""><Link href="/Covid-19" className="font-[200] block p-4 hover:bg-neutral-400" onClick={handleToggleNavbar}><span
                            className={pathname === "/Covid-19/" ? "activeNavLink" : "text-black"}>Covid-19</span></Link>
                        </li>
                        <li className=""><Link href="/Pet" className="font-[200] block p-4 hover:bg-neutral-400" onClick={handleToggleNavbar}><span
                            className={pathname === "/Pet/" ? "activeNavLink" : "text-black"}>Pet</span></Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    );
}

export default Navbar;