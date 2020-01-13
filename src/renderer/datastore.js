import Store from 'nedb'
import path from 'path'
import { remote } from 'electron'
import electronStore from '../main/store'
// import store from '../renderer/store'
import fs from 'fs-extra'
import merge from 'merge-deep'
import shortid from 'shortid'
import { homedir } from 'os'

function promisifyNedb (instance) {
  const methods = ['insert', 'find', 'findOne', 'count', 'update', 'remove']

  methods.forEach(m => {
    instance[m + 'Async'] = function (query, ...args) {
      return new Promise((resolve, reject) => {
        this[m](query, ...args, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })
    }
  })

  return instance
}

class DataStore {
  constructor () {
    // this._defaultPath = homedir() + '/massCode'
    this._storedPath = electronStore.get('storagePath')
    this._path = this._storedPath || this._defaultPath

    this.init()
  }

  init () {
    this.snippets = promisifyNedb(
      new Store({
        autoload: true,
        filename: path.join(this._path, '/snippets.db')
      })
    )
    this.tags = promisifyNedb(
      new Store({
        autoload: true,
        filename: path.join(this._path, '/tags.db')
      })
    )
    // this.masscode = new Store({
    //   autoload: true,
    //   filename: path.join(this._path, '/masscode.db')
    // })

    this.masscode = promisifyNedb(
      new Store({
        autoload: true,
        filename: path.join(this._path, '/masscode.db')
      })
    )
  }

  updatePath () {
    this._storedPath = electronStore.get('storagePath')
    this._path = this._storedPath || this._defaultPath
    this.init()
  }

  import (from) {
    electronStore.set('storagePath', from)
    this.updatePath()
  }

  async move (to) {
    try {
      await fs.move(this._path, to, { overwrite: true })
      electronStore.set('storagePath', to)
      await this.masscode.updateAsync(
        { _id: 'preferences' },
        { 'storage.path': to }
      )

      this.updatePath()
    } catch (err) {
      console.error(err)
    }
  }
}

const db = new DataStore()

async function setDefaultValues () {
  const app = {
    bounds: {},
    sidebarWidth: 180,
    snippetListWidth: 220,
    selectedFolderId: null,
    selectedFolderIds: null,
    selectedSnippetId: null,
    snippetsSort: 'updateAt',
    install: null,
    _id: 'app'
  }

  const preferences = {
    allowAnalytics: true,
    assistant: {
      enable: true,
      shortcut: 'Option+S'
    },
    interface: {
      theme: 'dark'
    },
    _id: 'preferences'
  }

  const folders = {
    list: [
      {
        id: shortid(),
        name: 'Default',
        open: false,
        defaultLanguage: 'text'
      }
    ],
    _id: 'folders'
  }

  db.masscode.findOne({ _id: 'preferences' }, (err, doc) => {
    if (err) return
    if (!doc) {
      db.masscode.insert(preferences)
    } else {
      const merged = merge({}, preferences, doc)
      db.masscode.update({ _id: 'preferences' }, merged)
    }
  })
  db.masscode.findOne({ _id: 'app' }, (err, doc) => {
    if (err) return
    if (!doc) {
      db.masscode.insert(app)
    } else {
      const merged = merge({}, app, doc)
      db.masscode.update({ _id: 'app' }, merged)
    }
  })
  db.masscode.insert(folders)
}

setDefaultValues()

export default db
