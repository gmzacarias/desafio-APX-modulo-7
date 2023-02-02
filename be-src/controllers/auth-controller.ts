import 'dotenv/config';
import { Auth } from "../models";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
const SECRET = process.env.SECRET
export function getSHA256ofString(text) {
    return crypto.createHash('sha256').update(text).digest('hex')
}
export async function getToken(data) {
    const { email, password } = data
    const hashedPassword = getSHA256ofString(password)

    try {
        const auth = await Auth.findOne({
            where: {
                email,
                password: hashedPassword
            }
        })
        console.log(auth);
        var token = null
        if (auth) {
            token = jwt.sign({ id: auth.get("user_Id") }, SECRET)
        }
        return token
    } catch (error) {
        throw error
    }
}

export async function updatePassword(newPassword, userId) {
    const hashedPassword = getSHA256ofString(newPassword)

    try {
        return await Auth.update({ password: hashedPassword }, {
            where: {
                user_Id: userId
            }
        })
    } catch (e) {
        throw e
    }
}

