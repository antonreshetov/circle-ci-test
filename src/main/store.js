import { homedir } from 'os'

const Store = require('electron-store')

const store = new Store({
  schema: {
    bounds: {
      type: 'object',
      default: null
    },
    sidebarWidth: {
      type: 'number',
      default: null
    },
    snippetListWidth: {
      type: 'number',
      default: null
    },
    selectedFolderId: {
      type: 'string',
      default: null
    },
    selectedFolderIds: {
      type: 'string',
      default: null
    },
    selectedSnippetId: {
      type: 'string',
      default: null
    },
    snippetsSort: {
      type: 'string',
      default: 'updateAt'
    },
    storagePath: {
      //
      type: 'string',
      default: homedir() + '/massCode2'
    },
    theme: {
      //
      type: 'string',
      default: 'dark'
    },
    allowAnalytics: {
      type: 'boolean',
      default: true
    },
    install: {
      type: 'string',
      default: null
    },
    preferences: {
      type: 'object',
      properties: {
        storagePath: {
          type: 'string',
          default: homedir() + '/massCode2'
        },
        interface: {
          type: 'object',
          properties: {
            theme: {
              type: 'string',
              default: 'dark'
            }
          }
        },
        assistant: {
          type: 'object',
          properties: {
            enable: {
              type: 'boolean',
              default: true
            },
            shortcut: {
              type: 'string',
              default: 'Option+S'
            }
          }
        }
      }
    }
  }
})

// store.delete('preferences')

if (!store.get('preferences')) {
  store.set('preferences', {
    interface: {},
    assistant: {}
  })
}

console.log(store.get('properties.storagePath'))
// console.log(store.store)

export default store
