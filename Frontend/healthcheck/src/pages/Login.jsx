import React from 'react'
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"
import FirebaseContext from "../context/firebase";
import { toast } from 'react-toastify';

import loginImg from '../assets/loginBanner.svg'

export default function Login() {
    const history = useNavigate();
    const { firebase } = useContext(FirebaseContext)

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');

    const isInvalid = password === '' || emailAddress === '';

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            await firebase.auth().signInWithEmailAndPassword(emailAddress, password);
            history('/');
            toast.success("congo")
        } catch (error) {
            setEmailAddress('');
            setPassword('');
            toast.error(error.message)
        }
    };

    useEffect(() => {
        document.title = 'Log In';
        const userExists = localStorage.getItem('authUser');
        if (userExists) {
            history("/")
        }
    });

    return (
        <div className='relative w-full h-screen bg-zinc-900/90'>
            <img className='absolute w-full h-full object-cover mix-blend-overlay z-[-1]' src={loginImg} alt="/" />


            <div className='flex justify-center items-center h-full'>

                <form className='max-w-[400px] w-full mx-auto bg-white p-8' onSubmit={handleLogin} method="POST">
                    <h2 className='text-4xl font-bold text-center py-4'>HEALTH CHECK</h2>
                    {/* <div className='flex justify-between py-8'>
                        <p className='border shadow-lg hover:shadow-xl px-6 py-2 relative flex items-center'><AiFillFacebook className='mr-2' /> Facebook</p>
                        <p className='border shadow-lg hover:shadow-xl px-6 py-2 relative flex items-center'><FcGoogle className='mr-2' /> Google</p>
                    </div> */}
                    <div className='flex flex-col mb-4'>
                        <label>Email</label>
                        <input className='border relative bg-gray-100 p-2' type="text"
                            onChange={({ target }) => setEmailAddress(target.value)}
                        />
                    </div>
                    <div className='flex flex-col '>
                        <label>Password</label>
                        <input className='border relative bg-gray-100 p-2' type="password"
                            onChange={({ target }) => setPassword(target.value)}
                        />
                    </div>
                    <button
                        disabled={isInvalid}
                        type="submit"
                        className={` 
                            w-full py-3 mt-8 bg-blue-500 hover:bg-indigo-500 relative text-white
                            ${isInvalid && `opacity-50`}     
                        `}>
                        Log In
                    </button>
                    <p className='flex items-center mt-2'><input className='mr-2' type="checkbox" />Remember Me</p>
                    <p className='text-center mt-8'>Not a member? <Link to="/signup"> Sign up now </Link> </p>
                </form>
            </div>
        </div>
    )
}