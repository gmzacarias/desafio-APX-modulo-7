import { User, Auth } from "../models"
import { getSHA256ofString, updatePassword } from "./auth-controller"


export async function createUser(data) {
    const { email, password, userName } = data
    try {
        const newUser = await User.create({
            email,
            userName: userName,
        })
        let userId = newUser.get("id")
        const newAuthorization = await Auth.create({
            email,
            password: getSHA256ofString(password),
            user_id: userId
        })
        return userId
    } catch (error) {
        throw error
    }
}

export async function checkMail(email) {
    try {
        return await User.findOne({
            where: {
                email
            }
        })
    } catch (error) {
        throw error
    }
}

export async function updateUser(data, userId) {
    const updateData = {
        userName: data.userName,
        password: data.password
    }
    if (updateData.userName) {
        try {
            await User.update({ userName: updateData.userName }, {
                where: {
                    id: userId
                }
            })
        } catch (error) {
            throw error
        }
    }
    if (updateData.password) {
        try {
            await updatePassword(updateData.password, userId)
        } catch (error) {
            throw error
        }
    }
    return updateData
}

export async function getAllUsers() {
    try { return await User.findAll({}) } catch (error) {
        throw error
    }
}

