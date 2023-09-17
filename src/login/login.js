import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'

const auth = getAuth();

async function verify() {
    email = document.getElementById('email')
    password = document.getElementById('password')
    signInWithEmailAndPassword(auth, email, password).auth
        .then((userCredential) => {
            const user = userCredential.user;
        })
        .catch((error) => {
            console.log(`error code ${error.code}: ${error.message}`)
        })
}