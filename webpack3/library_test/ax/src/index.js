import BaseModel from './print.js';

export function axlog() {
  console.log('axaxaxaxaa')
}

export default class BizModel extends BaseModel {
  constructor(options = {}) {
    super(options);
    this.b = "b";
    this.init();
  }
}
// let a = new BaseModel();
// a.init();
// console.log(BizModel)
// let b = new BizModel();
// console.log(b.a)
// console.log(b.b)