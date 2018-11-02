import * as S from '@eyedea/syncano'

interface Args {
  // name: string
}

class Endpoint extends S.Endpoint {
  async run(
    {response, data}: S.Core,
    {args}: S.Context<Args>
  ) {
    response.json({})
  }

}

export default ctx => new Endpoint(ctx)
