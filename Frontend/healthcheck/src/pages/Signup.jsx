import React from 'react'
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"
import FirebaseContext from "../context/firebase";
import { toast } from 'react-toastify';
import loginImg from '../assets/loginBanner.svg'

export default function SignUp() {
    const history = useNavigate();
    const { firebase } = useContext(FirebaseContext)

    const [fullName, setFullName] = useState('')
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');

    const isInvalid = password === '' || emailAddress === '';

    const handleSignUp = async (event) => {
        event.preventDefault();

        try {
            const createdUserResult = await firebase
                .auth()
                .createUserWithEmailAndPassword(emailAddress, password)

            // authentication
            // -> we are sending emailaddress and password and username (displayname)

            await createdUserResult.user.updateProfile({
                displayName: fullName
            });
            // console.log(createdUserResult, createdUserResult.user)

            // firebase user collection (create a document)

            await firebase.firestore().collection('users').add({
                userId: createdUserResult.user.uid,
                fullName,
                emailAddress: emailAddress.toLowerCase(),
                dateCreated: Date.now(),
                admin: false
            })

            toast.success("congo")
            history("/");
        }

        catch (error) {
            setEmailAddress('');
            setFullName('');
            setPassword('');
            switch (error.code) {
                case 'auth/weak-password':
                    toast.info("The password must have atleast 6 characters")
                    return;
                case 'auth/email-already-in-use':
                    toast.error("This email is already registered.")
                    return;
                default:
                    toast.error("Some error occured in auth, try again!")
                    return;
            }
        }

    };

    useEffect(() => {
        document.title = 'Sign Up';
        const userExists = localStorage.getItem('authUser');
        if (userExists) {
            history("/");
        };
    });

    return (
        <div className='relative w-full h-screen bg-zinc-900/90'>
            <img className='absolute w-full h-full object-cover mix-blend-overlay z-[-1]' src={loginImg} alt="/" />


            <div className='flex justify-center items-center h-full'>

                <form className='max-w-[400px] w-full mx-auto bg-white p-8' onSubmit={handleSignUp} method="POST">
                    <h2 className='text-4xl font-bold text-center py-4'>HEALTH CHECK</h2>
                    <div className='flex flex-col mb-4'>
                        <label>FullName</label>
                        <input className='border relative bg-gray-100 p-2' type="text"
                            onChange={({ target }) => setFullName(target.value)}
                        />
                    </div>
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
                        Sign Up
                    </button>
                    <p className='text-center mt-8'>Already a member? <Link to="/login" className="cursor-pointer">Login now</Link> </p>
                </form>
            </div>
        </div>
    )
}