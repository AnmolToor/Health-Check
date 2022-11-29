import { useState, useEffect, useContext } from 'react';
import FirebaseContext from '../context/firebase';

export default function useAuthListener() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('authUser')));
    // authuser in local storage is under firebase:authuser
    // console.log(user)
    const { firebase } = useContext(FirebaseContext);

    useEffect(() => {
        const listener = firebase.auth().onAuthStateChanged((authUser) => {
            if (authUser) {
                // we have a user,store the user in localstorage
                localStorage.setItem('authUser', JSON.stringify(authUser));
                // console.log('listener',authUser.multiFactor);
                setUser(authUser);
            } else {
                // we don't have an authUser,clear the localstorage
                localStorage.removeItem('authUser');
                setUser(null);
            }
        });

        return () => listener();
    }, [firebase]);

    return { user };
}