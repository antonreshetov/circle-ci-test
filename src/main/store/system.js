const Store = require('electron-store')

const defaults = {
  a: 'aaaaa',
  c: 'ccccc',
  b: {
    a: 'baaaaaa',
    z: 'sasasa',
    w: 'sdsdsds'
  }
}

const system = new Store({
  name: 'system',

  // defaults,

  schema: {
    a: {
      type: 'string',
      default: 'a'
    },
    c: {
      type: 'string',
      default: 'c'
    },
    b: {
      type: 'object',
      properties: {
        a: {
          type: 'string',
          default: 'ba'
        },
        b: {
          type: 'string',
          default: 'bb'
        }
      }
    }
  }
})

system.clear()

// system.set('b', {})

console.log(system.get('a'))
console.log(system.get('b.a'))
// system.set('b.a', 'new value')

// console.log(system.get('b.a'))

export default system
