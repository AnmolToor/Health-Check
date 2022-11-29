import { useContext, useEffect, useState } from "react";
import FirebaseContext from "../context/firebase";
import UserContext from "../context/user";
import { Link, useNavigate } from "react-router-dom";
import logoImg from '../assets/logo.jpg'

export default function Header() {
    const { firebase } = useContext(FirebaseContext);
    const { user } = useContext(UserContext);
    // const avatarPath = avatarsUrl(user ? user.displayName : null);
    // context provider encapsulate the content therefore we need to decapsulate the content

    return (
        <header className="h-16 bg-white border-b border-gray-primary mb-8">
            <div className="container mx-auto max-w-screen-lg h-full">
                <div className="flex justify-between h-full">
                    <div className="text-gray-700 text-center flex items-center cursor-pointer">
                        <h1 className="flex justify-center w-full">
                            <Link to={`/`} aria-label="Health Check logo">
                                <img fetchpriority="high" src={logoImg} alt="HEALTH CHECK" className="mt-2 w-1/2 pb-2 mobiles:mx-2 mobiles:w-7/12" />
                            </Link>
                        </h1>
                    </div>
                    <div className="text-gray-700 text-center flex items-center mobiles:mx-2">
                        {
                            user ? (
                                <>
                                    <Link to={`/`} aria-label="Dashboard">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mt-2 w-8 mr-6 text-black-light cursor-pointer" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                        </svg>
                                    </Link>

                                    <button
                                        type="button"
                                        title="Sign Out"
                                        onClick={() => firebase.auth().signOut().then()}
                                        onKeyDown={(event) => {
                                            if (event.key == 'Enter') {
                                                firebase.auth().signOut();
                                                // history(`/login`);
                                            }
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mt-2 w-8 mr-4 text-black-light cursor-pointer" viewBox="0 0 24 24" fill="currentColor">
                                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    <div>
                                        Hey, {user.displayName}
                                    </div>

                                </>
                            ) : (
                                <>
                                    <Link to={`/login`}>
                                        <button type="button" className="bg-blue-500 font-bold text-sm rounded text-white w-20 h-8">Login</button>
                                    </Link>
                                    <Link to={`/signup`}>
                                        <button type="button" className="font-bold text-sm rounded text-blue-medium w-20 h-8">Sign Up</button>
                                    </Link>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </header>
    )
}