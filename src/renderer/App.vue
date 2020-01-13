<template>
  <div
    id="app"
    :data-theme="app.theme"
  >
    <div class="app-title-bar" />
    <RouterView />
  </div>
</template>

<script>
import shortid from 'shortid'
import { mapGetters, mapState } from 'vuex'
import { defaultLibraryQuery } from '@/util/helpers'
import '@/datastore'
import '@/lib/ipcRenderer'

export default {
  name: 'App',

  data () {
    return {
      init: false
    }
  },

  computed: {
    ...mapState(['app']),
    ...mapGetters('folders', ['selectedIds'])
  },

  created () {
    this.initState()
  },

  methods: {
    async initState () {
      await this.setDefaultDataStore()

      const app = await this.$db.masscode.findOneAsync({ _id: 'app' })
      const preferences = await this.$db.masscode.findOneAsync({
        _id: 'preferences'
      })
      console.log(app)
      console.log(preferences)

      const storagePath = this.$electronStore.get('storagePath')

      this.$store.commit('app/SET_STORAGE_PATH', storagePath)

      console.log(storagePath)

      // const snippetListWidth = this.$electronStore.get('snippetListWidth')
      // const sidebarWidth = this.$electronStore.get('sidebarWidth')
      // const selectedFolderId = this.$electronStore.get('selectedFolderId')
      // const selectedSnippetId = this.$electronStore.get('selectedSnippetId')
      // const theme = this.$electronStore.get('theme')
      // const snippetsSort = this.$electronStore.get('snippetsSort')

      if (app.snippetListWidth) {
        this.$store.commit('app/SET_SNIPPET_LIST_WIDTH', app.snippetListWidth)
      }

      if (app.sidebarWidth) {
        this.$store.commit('app/SET_SIDEBAR_WIDTH', app.sidebarWidth)
      }

      if (app.selectedFolderId) {
        this.$store.dispatch('folders/setSelectedFolder', app.selectedFolderId)

        const defaultQuery = { folderId: { $in: this.selectedIds } }
        const query = defaultLibraryQuery(defaultQuery, app.selectedFolderId)

        this.$store.dispatch('snippets/getSnippets', query)
      } else {
        this.$store.dispatch('snippets/getSnippets', { folderId: null })
      }

      if (app.selectedSnippetId) {
        this.$db.snippets.findOne(
          { _id: app.selectedSnippetId },
          (err, doc) => {
            if (err) return
            if (doc) {
              this.$store.dispatch('snippets/setSelected', doc)
            }
          }
        )
      }

      // if (pretheme) {
      this.$store.dispatch('app/setTheme', preferences.interface.theme)
      // }

      // if (snippetsSort) {
      this.$store.dispatch('snippets/setSort', app.snippetsSort)
      // }

      this.$store.commit('app/SET_INIT', true)
    },
    async setDefaultDataStore () {
      // const defaultFolder = {
      //   list: [
      //     {
      //       id: shortid(),
      //       name: 'Default',
      //       open: false,
      //       defaultLanguage: 'text'
      //     }
      //   ],
      //   _id: 'folders'
      // }

      // this.$db.masscode.findOne({ _id: 'settings' }, (err, doc) => {
      //   if (err) return

      //   if (!doc) {
      //     this.$db.masscode.insert(defaultSettings)
      //     this.$db.masscode.update({ _id: 'settings' }, { $set: { 'preferences.assistant.enable': false } })
      //   }
      // })

      // this.$db.masscode.insert([defaultFolder], (err, doc) => {
      //   if (err) return
      //   this.$store.dispatch('folders/getFolders')
      // })

      await this.$store.dispatch('folders/getFolders')
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main';

.app-title-bar {
  position: absolute;
  top: 0;
  width: 100%;
  height: var(--title-bar-height);
  -webkit-user-select: none;
  -webkit-app-region: drag;
  z-index: 1010;
}
</style>
