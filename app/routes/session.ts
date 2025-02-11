import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { User } from '../db/models';
import { Errors, Utenti } from '../../types';
import { token } from '../utils';
import { revoke } from '../utils/token';
import { SignOptions } from 'jsonwebtoken';
import { AVATAR_BASE, AVATAR_QUERY, BASE_URL, JWT_SECRET, RANDOM_SECRET, RESPONSE_MESSAGES } from '../variables';

const router = Router();

router.post('/', async (req, res) => {
    // Get email and password from request body
    const { email, password } = req.body;
    
    // Check if the email and password are present
    if(!email || !password){
        const response: Errors = {
            code: 400,
            message: RESPONSE_MESSAGES[400],
            details: 'Email and password are required'
        }
        res.status(400).json(response);
        return;
    }
    // Find user with email
    const user = await User.findOne({ email });
    if(!user){
        const response: Errors = {
            code: 404,
            message: 'User not found',
            details: 'User with this email does not exist'
        }
        res.status(401).json(response);
        return;
    }
    // Check if password is correct
    if(user.password !== password){
        const response: Errors = {
            code: 401,
            message: RESPONSE_MESSAGES[401],
            details: 'Password is incorrect'
        }
        res.status(401).json(response);
        return;
    }
    // Set the payload for the JWT
    const payload: Utenti.User = {
        self: `${BASE_URL}/user/${user._id}`,
        email: user.email,
        nome: user.nome,
        cognome: user.cognome,
        ruolo: user.ruolo,
        imageUrl: AVATAR_BASE + user.imageUrl + '?' + AVATAR_QUERY
    };
    const secret = JWT_SECRET + RANDOM_SECRET;
    const options: SignOptions = {
        expiresIn: '6h',
    }
    jwt.sign(payload,secret,options, (err, token) => {
        if(err){
            const response: Errors = {
                code: 500,
                message: 'Internal Server Error',
                details: 'Error while generating token'
            }
            res.status(500).json(response);
            return;
        }
        res.status(201).json({
            token,
            user: payload
        });
    });
});
router.get('/', token.checker, async (req, res) => {
    const { user } = req.body;
    const response: Utenti.User = {
        self: user.self,
        email: user.email,
        nome: user.nome,
        cognome: user.cognome,
        ruolo: user.ruolo,
        imageUrl: user.imageUrl
    };
    res.status(200).json(response);
});

router.delete('/', token.checker, async (req, res) => {
    // Invalida il token JWT
    const { authorization } = req.headers;
    if(!authorization){
        const response: Errors = {
            code: 401,
            message: RESPONSE_MESSAGES[401],
            details: 'No authorization header'
        }
        res.status(401).json(response);
        return;
    }
    revoke(authorization.split(' ')[1]);
    res.sendStatus(204);
});

export default router;