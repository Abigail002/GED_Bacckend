import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

const PASSWORD_MIN_LENGTH = 4;
const PASSWORD_MAX_LENGTH = 180;

function passwordRules(confirm = true) {
  const passwordRules = [
    rules.minLength(PASSWORD_MIN_LENGTH),
    rules.maxLength(PASSWORD_MAX_LENGTH),
  ];
  if (confirm) {
    passwordRules.push(rules.confirmed("password_confirmation"));
  }
  return passwordRules;
}


export default class StoreUserValidator {
  constructor(protected ctx: HttpContextContract) { }
  public schema = schema.create({
    lastname: schema.string(),
    firstname: schema.string(),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email ' }),
    ]),
    username: schema.string([rules.unique({ table: 'users', column: 'username' })]),
    jeton: schema.string([rules.unique({ table: 'users', column: 'username' })]),
    password: schema.string({ trim: true }, passwordRules()),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  //public messages: CustomMessages = {}
  //public messages = customMessages();

}
