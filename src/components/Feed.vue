<template>
  <b-container>
      <b-col sm="4">
        <div class="profile">
          <h5>{{ currentUser.firstName }} {{ currentUser.lastName }}</h5>
          <div class="createPost">
            <label for="postMessage">Create a post</label>
            <form @submit.prevent>
              <textarea v-model.trim="post.message" id="postMessage"/>
              <button @click="createPost" :disabled="!post.message">PUBLISH</button>
            </form>
          </div>
        </div>
      </b-col>
      <b-col sm="8">
        <div v-if="!posts">
          <p class="no-results">There are currently no posts</p>
        </div>
      </b-col>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'
import createPost from '@/graphql/Post/createPost.graphql'

export default {
  name: 'Feed',
  data () {
    return {
      post: {
        message: ''
      },
      posts: []
    }
  },
  methods: {
    createPost: function () {
      this.$apollo.mutate({
        mutation: createPost,
        variables: {
          message: this.post.message,
          links: [{
            url: 'https://github.com/'
          }]
        }
      })
        .then(res => {
          console.log(res.data.createPost)
        })
        .catch(({ graphQLErrors }) => {
          console.log(graphQLErrors)
        })
    }
  },
  computed: {
    ...mapState(['currentUser'])
  }
}
</script>

<style scoped>

</style>
