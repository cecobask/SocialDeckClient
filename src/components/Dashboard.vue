<template>
  <b-container v-if="currentUser">
    <vue-topprogress ref="topProgress"/>
    <b-row align-h="center">
      <b-col md="6">
        <div class="createPost">
          <b-form-group label-size="lg" label="Create a post" label-for="postMessage">
            <b-form-textarea
              v-model.trim="createForm.message"
              id="postMessage"
              rows="3"
              max-rows="6"
              placeholder="Enter message here...">
            </b-form-textarea>
            <b-button pill variant="primary" @click="createPost" :disabled="!createForm.message" style="margin: 10px" id="createPost">
              PUBLISH
            </b-button>
          </b-form-group>
        </div>
        <b-input-group v-if="allPosts.length" class="mt-3" style="margin-bottom: 10px">
          <template v-slot:append>
            <b-dropdown variant="outline-secondary">
              <template v-slot:button-content>
                &#x1f50d;
              </template>
              <b-dropdown-item @click="searchBy='message'">message</b-dropdown-item>
              <b-dropdown-item @click="searchBy='creatorFullName'">name</b-dropdown-item>
            </b-dropdown>
          </template>
          <b-form-input v-model="searchQuery" placeholder="Search posts..."/>
        </b-input-group>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col md="8" id="postsFeed">
        <PostsFeed :posts="filteredPosts"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import createPost from '@/graphql/Post/createPost.graphql'
import PostsFeed from '@/components/PostsFeed'

export default {
  name: 'Dashboard',
  data: function () {
    return {
      createForm: {
        message: ''
      },
      searchQuery: '',
      searchBy: 'message'
    }
  },
  components: {
    'PostsFeed': PostsFeed
  },
  async created () {
    if (!this.$store.state.posts) {
      await this.$store.dispatch('fetchAllPosts')
      await this.$store.dispatch('fetchUserPosts')
    }
  },
  methods: {
    createPost: function () {
      this.$refs.topProgress.start()
      this.$apollo.mutate({
        mutation: createPost,
        variables: {
          message: this.createForm.message,
          links: [{
            url: 'https://github.com/'
          }]
        }
      })
        .then(() => {
          this.createForm.message = null
          this.$store.dispatch('fetchAllPosts')
          this.$store.dispatch('fetchUserPosts')
          this.$refs.topProgress.done()
        })
        .catch(({ graphQLErrors }) => {
          console.log(graphQLErrors)
          this.createForm.message = null
          this.$refs.topProgress.done()
        })
    }
  },
  computed: {
    ...mapState(['currentUser']),
    ...mapGetters(['allPosts']),
    filteredPosts () {
      const allPosts = this.$store.getters.allPosts
      return this.searchQuery
        ? allPosts.filter(post => post[this.searchBy].toLowerCase().includes(this.searchQuery.toLocaleLowerCase()))
        : this.$store.getters.allPosts
    }
  }
}
</script>

<style scoped>

</style>
