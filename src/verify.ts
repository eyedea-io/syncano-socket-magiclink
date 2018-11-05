import * as S from '@eyedea/syncano'

interface Args {
  email: String,
  token: String
}

class Verify extends S.Endpoint {
  async run(
    {response, data}: S.Core,
    {args}: S.Context<Args>
  ) {
    data.magiclink.where([['email', args.email], ['token', args.token]])
    .firstOrFail()
    .then(link => {
      const currentDate = new Date()
      if (currentDate < new Date(link.validUntil)) {
        response.json({
          'message': 'Token is valid',
          'email': link.email,
          'token': link.token,
        }, 200)
      } else  {
        response.json({'message': 'Token expired'}, 403)
      }
    }).catch(err => {
      response.json({'message': 'There is no magic link for given arguments.'}, 403)
    })
  }

}

export default ctx => new Verify(ctx)
