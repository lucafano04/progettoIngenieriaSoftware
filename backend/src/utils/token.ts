// File per il controllo del token JWT
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { Errors } from '../types';

const revokeList = new Set<string>();

function checker(req: Request, res: Response, next: NextFunction) {
    // Get the token from the request headers
    const token = req.headers['authorization'];
    // Just to test
    // console.log(token);
    // Check if token is present
    if(!token){
        const response: Errors = {
            code: 401,
            message: 'Unauthorized',
            details: 'Token not found'
        }
        res.status(401).json(response);
        return;
    }
    // Check if the toke is in the format 'Bearer <token>'
    const parts = token.split(' ');
    if(parts.length !== 2){
        const response: Errors = {
            code: 401,
            message: 'Unauthorized',
            details: 'Token format is invalid'
        }
        res.status(401).json(response);
        return;
    }
    if(!process.env.JWT_SECRET || !process.env.RANDOM_SECRET){
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
    // Check if the token is valid
    jwt.verify(parts[1], secret, (err, decoded) => {
        if(err){
            const response: Errors = {
                code: 401,
                message: 'Unauthorized',
                details: 'Token is invalid'
            }
            res.status(401).json(response);
            return;
        }
        if(revokeList.has(parts[1])){
            const response: Errors = {
                code: 401,
                message: 'Unauthorized',
                details: 'Token has been revoked'
            }
            res.status(401).json(response);
            return;
        }
        // Save the decoded token in the request object
        // This is safe because only if the token is valid we reach this point and we can trust the decoded token
        req.body.user = decoded;
        next();
    });
}
function revoke(token: string){
    revokeList.add(token);
}

export default {
    checker,
    revoke
}

export {
    checker,
    revoke
}