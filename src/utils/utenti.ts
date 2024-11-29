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
    return false;
}
async function login(username: string, password: string) {
    const response = await fetch('/api/v1/session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
    });
    if(response.status === 201) {
        const data:{token:string, user: Utenti.User} = await response.json();
        sessionStorage.setItem('token', data.token);
        return true;
    }
    return false;
}

const utenti = {
    getSession,
    logout,
    login
};

export default utenti;
export { 
    getSession,
    logout,
    login
};