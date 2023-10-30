
import Link from "next/link"
import Image from "next/image"
import {RiArrowLeftSLine} from "react-icons/ri";
import {IoLogoWhatsapp} from "react-icons/io";
import {ImAppleinc} from "react-icons/im"
import {FaGooglePlay} from "react-icons/fa"
import {FaTwitter} from "react-icons/fa"
import {AiFillLinkedin} from "react-icons/ai"
import {BsFacebook} from "react-icons/bs"
import {GrGithub} from "react-icons/gr"
import {FiDribbble} from "react-icons/fi"

function Footer() {
    return (
        <footer className="mt-28">
            <div className="bg-[#282828] py-10 px-16 sm:text-left text-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-2  ">
                    
                    <div className="sm:mt-0 mt-8">
                        <h3 className="text-[1rem] font-bold text-[#5e5c5c] mb-8 ">FEATURES</h3>
                        <div className="mt-5  space-y-5 flex flex-col items-center sm:block">
                            <div className="flex">
                                
                                <Link href="/API" className="text-white text-[0.9rem] hover:text-neutral-500">API </Link>
                            </div>
                            <div className="flex">
                                
                                <Link href="/Giveback" className="text-white text-[0.9rem] hover:text-neutral-500">Giveback</Link>
                            </div>
                            <div className="flex">
                                
                                <Link href="/Claims" className="text-white text-[0.9rem] hover:text-neutral-500">Claims</Link>
                            </div>
                            <div className="flex">
                                
                                <Link href="/Police" className="text-white text-[0.9rem] hover:text-neutral-500">Police 2.0</Link>
                            </div>
                            <div className="flex">
                                
                                <Link href="/Homeowners" className="text-white text-[0.9rem] hover:text-neutral-500">Homeowners</Link>
                            </div>
                        </div>
                    </div>
                    <div className="sm:mt-0 mt-8">
                        <h3 className="text-[1rem] font-bold text-[#5e5c5c] mb-8 ">RESOURCES</h3>
                        <div className="mt-5  space-y-5 flex flex-col items-center sm:block">
                            <div className="flex">
                                
                                <Link href="/Blog" className="text-white text-[0.9rem] hover:text-neutral-500">Blog </Link>
                            </div>
                            <div className="flex">
                                
                                <Link href="/FAQ" className="text-white text-[0.9rem] hover:text-neutral-500">FAQ</Link>
                            </div>
                            <div className="flex">
                                
                                <Link href="/Community" className="text-white text-[0.9rem] hover:text-neutral-500">Community</Link>
                            </div>
                            <div className="flex">
                                
                                <Link href="/Transparency" className="text-white text-[0.9rem] hover:text-neutral-500">Transparency</Link>
                            </div>
                            <div className="flex">
                                
                                <Link href="/Live" className="text-white text-[0.9rem] hover:text-neutral-500">Where We're Live</Link>
                            </div>
                            <div className="flex">
                                
                                <Link href="/Insurance" className="text-white text-[0.9rem] hover:text-neutral-500">Insurance Dictionary</Link>
                            </div>
                            <div className="flex">
                                
                                <Link href="/Investor" className="text-white text-[0.9rem] hover:text-neutral-500">Investor Relations</Link>
                            </div>
                        </div>
                    </div>
                    <div className="lg:mt-0 mt-8">
                        <h3 className="text-[1rem] font-bold text-[#5e5c5c] mb-8  ">COMPANY</h3>
                        <div className="mt-5  space-y-5 flex flex-col items-center sm:block">
                            <div className="flex">
                                
                                <Link href="/Blog" className="text-white text-[0.9rem] hover:text-neutral-500">Blog </Link>
                            </div>
                            <div className="flex">
                                
                                <Link href="/FAQ" className="text-white text-[0.9rem] hover:text-neutral-500">FAQ</Link>
                            </div>
                            <div className="flex">
                                
                                <Link href="/Community" className="text-white text-[0.9rem] hover:text-neutral-500">Community</Link>
                            </div>
                            <div className="flex">
                                
                                <Link href="/Transparency" className="text-white text-[0.9rem] hover:text-neutral-500">Transparency</Link>
                            </div>
                            <div className="flex">
                                
                                <Link href="/Live" className="text-white text-[0.9rem] hover:text-neutral-500">Where We're Live</Link>
                            </div>
                            <div className="flex">
                                
                                <Link href="/Insurance" className="text-white text-[0.9rem] hover:text-neutral-500">Insurance Dictionary</Link>
                            </div>
                            <div className="flex">
                                
                                <Link href="/Investor" className="text-white text-[0.9rem] hover:text-neutral-500">Investor Relations</Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center sm:block xl:mt-0 mt-8">
                        <div className="w-[90%]">
                            
                            
                            <select id="countries" className="bg-[#282828] border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4">
                              <option selected>CHOOSE A COUNTRY</option>
                              <option value="US">UNITED STATES</option>
                              <option value="CA">CANADA</option>
                              <option value="FR">FRANCE</option>
                              <option value="DE">GERMANY</option>
                            </select>
                            

                            
                        </div>
                        <div className="mt-7">
                            <h2 className="text-[#5e5c5c] font-semibold">
                                GET OUR STORE
                            </h2>
                            <div className="mt-5 flex flex-col gap-2">
                                <div className="text-white">
                                    <a href=""> 
                                        <button className="flex items-center gap-2 border-2 border-[#574e4e] rounded-md px-2 py-0.5 ">
                                            <div className="text-3xl">
                                                <ImAppleinc/>

                                            </div>
                                            <div className="text-start">
                                                <div>
                                                    <p className="text-xs">Download on the</p>
                                                </div>
                                                <div>
                                                    <p className="font-semibold">App Store</p>
                                                </div>
                                            </div>
                                        </button>
                                    </a>
                                </div>
                                <div className="text-white">
                                    <a href=""> 
                                        <button className="flex items-center gap-2 border-2 border-[#574e4e] rounded-md px-2 py-0.5 ">
                                            <div className="text-2xl">
                                                <FaGooglePlay/>

                                            </div>
                                            <div className="text-start">
                                                <div>
                                                    <p className="text-xs">GET IT ON</p>
                                                </div>
                                                <div>
                                                    <p className="font-semibold">Google Play</p>
                                                </div>
                                            </div>
                                        </button>
                                    </a>
                                </div>
                                
                                
                            </div>
                        </div>
                        <div className="mt-7">
                            <h2 className="text-[#5e5c5c] font-semibold">
                                FOLLOW US
                            </h2>
                            <div className="mt-5 flex gap-4 text-2xl text-[#BFBFBF]">
                                <div><a href="#"><FaTwitter/></a></div>
                                <div><a href="#"><AiFillLinkedin/></a></div>
                                <div><a href="#"><BsFacebook/></a></div>
                                <div><a href="#"><GrGithub/></a></div>
                                <div><a href="#"><FaTwitter/></a></div>
                                <div><a href="#"><FiDribbble/></a></div>
                               
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" text-[#5e5c5c]  py-3 text-[0.8rem] mt-10">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea nisi tempora, totam cumque doloremque molestias obcaecati voluptates sequi inventore? Facilis beatae aut in optio provident, eligendi accusantium sunt aliquam dolore.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea nisi tempora, totam cumque doloremque molestias obcaecati voluptates sequi inventore? Facilis beatae aut in optio provident, eligendi accusantium sunt aliquam dolore.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea nisi tempora, totam cumque doloremque molestias obcaecati voluptates sequi inventore? Facilis beatae aut in optio provident, eligendi accusantium sunt aliquam dolore.
                </div>
            </div>
            
        </footer>
    );
}

export default Footer;