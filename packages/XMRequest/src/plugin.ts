class XMRequestPluginSets {
  private resultHandler = (res: any) => res
  private result(handler: (res: any) => void) {
    this.resultHandler = handler
  }
  public get hooks() {
    return {
      result: this.result,
    }
  }
  constructor() {
    this.result = this.result.bind(this)
  }
  public emitResultHandler(res: any) {
    return this.resultHandler(res)
  }
}

export type XMRequestPluginT = XMRequestPluginSets

export default new XMRequestPluginSets()
