'use client'
import { PackageIcon, HeartIcon, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton, Protect } from "@clerk/nextjs"
import SmartSearch from "./SmartSearch";

const Navbar = () => {

    const { user } = useUser()
    const { openSignIn } = useClerk()
    const router = useRouter();

    const cartCount = useSelector(state => state.cart.total)
    const wishlistCount = useSelector(state => state.wishlist.items.length)

    return (
        <nav className="relative bg-white">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">

                    <Link href="/" className="relative text-4xl font-semibold text-slate-700">
                        <span className="text-green-600">go</span>cart<span className="text-green-600 text-5xl leading-0">.</span>
                        <Protect plan='plus'>
                            <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                                plus
                            </p>
                        </Protect>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
                        <Link href="/">Home</Link>
                        <Link href="/shop">Shop</Link>
                        <Link href="/">About</Link>
                        <Link href="/">Contact</Link>

                        {/* AI Smart Search */}
                        <div className="hidden xl:block">
                            <SmartSearch />
                        </div>

                        {/* Wishlist Icon */}
                        <Link href="/wishlist" className="relative flex items-center gap-1.5 text-slate-600 hover:text-red-500 transition-colors">
                            <HeartIcon size={18} />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 left-3 text-[8px] text-white bg-red-500 size-3.5 rounded-full flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Cart Icon */}
                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600">
                            <ShoppingCart size={18} />
                            Cart
                            <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">{cartCount}</button>
                        </Link>

                        {
                            !user ? (
                                <button onClick={openSignIn} className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
                                    Login
                                </button>
                            ) : (
                                <UserButton>
                                    <UserButton.MenuItems>
                                        <UserButton.Action labelIcon={<PackageIcon size={16} />} label="My Orders" onClick={() => router.push('/orders')} />
                                        <UserButton.Action labelIcon={<HeartIcon size={16} />} label="Wishlist" onClick={() => router.push('/wishlist')} />
                                    </UserButton.MenuItems>
                                </UserButton>
                            )
                        }

                    </div>

                    {/* Mobile User Button  */}
                    <div className="sm:hidden flex items-center gap-3">
                        {/* Mobile Wishlist */}
                        <Link href="/wishlist" className="relative">
                            <HeartIcon size={20} className="text-slate-600" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 text-[8px] text-white bg-red-500 size-3.5 rounded-full flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                        {/* Mobile Cart */}
                        <Link href="/cart" className="relative">
                            <ShoppingCart size={20} className="text-slate-600" />
                            <span className="absolute -top-1 -right-1 text-[8px] text-white bg-slate-600 size-3.5 rounded-full flex items-center justify-center">{cartCount}</span>
                        </Link>
                        {user ? (
                            <UserButton>
                                <UserButton.MenuItems>
                                    <UserButton.Action labelIcon={<ShoppingCart size={16} />} label="Cart" onClick={() => router.push('/cart')} />
                                    <UserButton.Action labelIcon={<PackageIcon size={16} />} label="My Orders" onClick={() => router.push('/orders')} />
                                    <UserButton.Action labelIcon={<HeartIcon size={16} />} label="Wishlist" onClick={() => router.push('/wishlist')} />
                                </UserButton.MenuItems>
                            </UserButton>
                        ) : (
                            <button onClick={openSignIn} className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full">
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <hr className="border-gray-300" />
        </nav>
    )
}

export default Navbar