import * as S from '@eyedea/syncano'
import * as crypto from 'crypto'

interface Args {
  email: String
}

class Generate extends S.Endpoint {
  async run(
    {response, data, users}: S.Core,
    {args}: S.Context<Args>
  ) {
    if (args.email) {
      users.create({'username': args.email, 'password': 'dupa.8', 'email': args.email})
    }

    const currentDate = new Date()
    users.where('email', args.email)
      .firstOrFail().then(user => {
        data.magiclink.where('email', user.email)
          .firstOrFail().then(link => {
            if (new Date(link.validUntil) > currentDate) {
              response.json({
                message: `Token exists and it is valid until: ${link.validUntil}.`,
                email: args.email,
                token: link.token,
              }, 200)
            } else {
              const linkUpdate = {
                validUntil: new Date(currentDate.setDate(currentDate.getDate() + 1)),
                token: crypto.randomBytes(16).toString('hex'),
                email: args.email,
              }
              data.magiclink.update(link.id, linkUpdate).then(newLink => {
                response.json({
                  message: 'Old token was outdated, generated a new one.',
                  email: newLink.email,
                  token: newLink.token,
                }, 200)
              })
            }
          }).catch(() => {

            const link = {
              validUntil: new Date(currentDate.setDate(currentDate.getDate() + 1)),
              token: crypto.randomBytes(16).toString('hex'),
              email: args.email,
            }
            data.magiclink.create(link).then(newLink => {
              response.json({
                message: 'Generated a new token.',
                email: newLink.email,
                token: newLink.token,
              }, 200)
            })
          })
      })
      .catch(() => {
        response.json({'message': 'Please provide a valid email adress.'}, 400)
      })
  }

}

export default ctx => new Generate(ctx)
