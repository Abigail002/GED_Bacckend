import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreUserValidator from 'App/Validators/Auth/StoreUserValidator'
import User from 'App/Models/User'

export default class UsersController {
    public async register({ request, response }: HttpContextContract) {

        const payload = await request.validate(StoreUserValidator)

        const user = await User.create(payload)
        return response.created(user) // 201 CREATED
    }

    //Show all users
    public async index({ response }: HttpContextContract) {
        const users = await User.all()
        return response.ok(users)
    }

    //Search for a user
    public async search({ params, response }: HttpContextContract) {
        console.log(params);
        const data = await User.findBy("username", params.username);

        return response.ok(data)
    }

    //   login function
    public async login({ request, response, auth }: HttpContextContract) {
        const password = await request.input('password')
        const email = await request.input('email')

        try {
            const token = await auth.use('api').attempt(email, password, {
                expiresIn: '2 days',
            })
            return token.toJSON()
        } catch {
            return response
                .status(400)
                .send({ error: { message: 'User with provided credentials could not be found' } })
        }
    }

    //   logout function
    public async logout({ auth, response }: HttpContextContract) {
        await auth.logout()
        return response.status(200)
    }

    //Delete a user
    public async delete({ request, response, auth }: HttpContextContract) {
        //const password = await request.input('password')
        const email = await request.input('email')

        const data = await User.findBy("email", email);

        if(!data){
            return response.notFound({error: {message: "User not found"}});
        }

        await data.delete();
        return response.ok({error: {message: "User successfully deleted"}});
    }
}
