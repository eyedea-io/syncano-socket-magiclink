import * as S from '@eyedea/syncano'

interface Args {
  email: String
}

class Generate extends S.Endpoint {
  async run(
    {response, data}: S.Core,
    {args}: S.Context<Args>
  ) {
    const currentDate = 123
    data.magiclink.where('email', args.email)
      .firstOrFail().then(link => {
        if (link.validUntil > currentDate) {
          response.json({email: args.email, token: 'abcd'})
        } else {
          const linkUpdate = {
            valid_until: currentDate + 24,
            token: 'bdfa',
            email: args.email,
          }
          data.magiclink.update(link.id, linkUpdate).then(newLink => {
            response.json({email: newLink.email, token: newLink.token})
          })
        }
      }).catch(() => {
        const link = {
          valid_until: currentDate + 24,
          token: 'bdfa',
          email: args.email,
        }
        data.magiclink.create(link).then(newLink => {
          response.json({email: newLink.email, token: newLink.token})
        })
      })
  }

}

export default ctx => new Generate(ctx)
