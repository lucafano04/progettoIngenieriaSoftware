import { Utenti } from "../../types";

async function getSession() {
    const token: string | null = sessionStorage.getItem('token') || null;
    if (!token) 
        return null;
    const response = await fetch('/api/v1/session', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if(response.status === 200) {
        const data = await response.json();
        return data as Utenti.User;
    }else {
        return null;
    }
}
async function logout() {
    const token: string | null = sessionStorage.getItem('token') || null;
    if (!token) 
        return false;
    const response = await fetch('/api/v1/session', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if(response.status === 204) {
        sessionStorage.removeItem('token');
        return true;
    }
    throw new Error((await response.json()).details);
}
async function postSession(email: string, password: string) {
    const hashPassword = await hash(password);
    const response = await fetch('/api/v1/session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password: hashPassword})
    });
    if(response.status === 201) {
        const data:{token:string, user: Utenti.User} = await response.json();
        sessionStorage.setItem('token', data.token);
        return data.user;
    }
    if(response.status !== 401)
        try {throw new Error('Errore nella creazione della sessione ' + (await response.json())?.details);}catch(err:any ){throw new Error('Errore nella creazione della sessione ' + await response.text());}
    throw new Error((await response.json()).details);
}
async function hash(string: string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, "0"))
        .join("");
    return hashHex;
}

const utenti = {
    getSession,
    logout,
    postSession
};

export default utenti;
export { 
    getSession,
    logout,
    postSession
};