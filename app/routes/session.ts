import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { User } from '../db/models';
import { Errors } from '../../types';
import { token } from '../utils';
import { revoke } from '../utils/token';
import { SignOptions } from 'jsonwebtoken';

const router = Router();

router.post('', async (req, res) => {
    // Get email and password from request body
    const { email, password } = req.body;

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
            message: 'Unauthorized',
            details: 'Password is incorrect'
        }
        res.status(401).json(response);
        return;
    }
    // Set the payload for the JWT
    const payload = {
        _id: user._id,
        email: user.email,
        nome: user.nome,
        cognome: user.cognome,
        ruolo: user.ruolo,
        imageUrl: (process.env.AVATAR_BASE || 'https://gravatar.com/avatar/') + user.imageUrl + '?' + process.env.AVATAR_QUERY
    };
    if(!process.env.JWT_SECRET){
        const response: Errors = {
            code: 500,
            message: 'Internal Server Error',
            details: 'JWT secret not set'
        }
        res.status(500).json(response);
        console.error('[ERROR] JWT secret not set');
        process.exit(1);
    }
    const secret = process.env.JWT_SECRET + process.env.RANDOM_SECRET;
    if(!secret){
        const response: Errors = {
            code: 500,
            message: 'Internal Server Error',
            details: 'JWT secret not set'
        }
        res.status(500).json(response);
        console.error('[ERROR] JWT secret not set');
        process.exit(1);
    }
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
router.get('', token.checker, async (req, res) => {
    const { user } = req.body;
    res.status(200).json({
        email: user.email,
        nome: user.nome,
        cognome: user.cognome,
        ruolo: user.ruolo,
        imageUrl: user.imageUrl
    });
});

router.delete('', token.checker, async (req, res) => {
    // Invalida il token JWT
    const { authorization } = req.headers;
    if(!authorization){
        const response: Errors = {
            code: 401,
            message: 'Unauthorized',
            details: 'No authorization header'
        }
        res.status(401).json(response);
        return;
    }
    revoke(authorization.split(' ')[1]);
    res.sendStatus(204);
});

export default router;