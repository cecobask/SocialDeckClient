<template>
  <b-container v-if="currentUser">
    <b-row align-h="center">
      <b-col md="6">
          <div class="createPost">
            <b-form-group label-size="lg" label="Create a post" label-for="postMessage">
              <b-form-textarea
                v-model.trim="post.message"
                id="postMessage"
                rows="3"
                max-rows="6"
                placeholder="Enter message here...">
              </b-form-textarea>
              <b-button pill variant="primary" @click="createPost" :disabled="!post.message" id="submitButton">
                PUBLISH
              </b-button>
            </b-form-group>
          </div>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col md="8">
        <div v-if="!allPosts">
          <p class="no-results">There are currently no posts</p>
        </div>
        <div v-else>
          <b-card v-for="post in allPosts" :key="post._id" style="margin-bottom: 20px">
            <b-card-text>{{post.message | trimLength}}</b-card-text>
            <template v-slot:header>
              <h6 v-text="post.creatorFullName"/>
              <small class="text-muted" style="margin-left: 10px">{{post.createdTime | formatDate}}</small>
              <small v-if="post.updatedTime" class="text-muted" style="margin-left: 10px">
                updated: {{post.updatedTime | formatDate}}
              </small>
            </template>
            <template v-slot:footer>
              <button :disabled="userShared(post)" @click="sharePost(post._id)">
                <i class="fa fa-retweet" style="margin-right:2px"/>
                {{post.shares.length}}
              </button>
            </template>
          </b-card>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import createPost from '@/graphql/Post/createPost.graphql'
import sharePost from '@/graphql/Post/sharePost.graphql'

import moment from 'moment'

export default {
  name: 'Feed',
  data: function () {
    return {
      post: {
        message: ''
      }
    }
  },
  async created () {
    if (!this.$store.state.posts) await this.$store.dispatch('fetchAllPosts')
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
        .then(() => {
          this.post.message = null
          this.$store.dispatch('fetchAllPosts')
        })
        .catch(({ graphQLErrors }) => {
          console.log(graphQLErrors)
          this.post.message = null
        })
    },
    sharePost: function (_id) {
      this.$apollo.mutate({
        mutation: sharePost,
        variables: {
          postID: _id
        }
      })
        .then(() => {
          this.$store.dispatch('fetchAllPosts')
        })
        .catch(({ graphQLErrors }) => {
          console.log(graphQLErrors)
        })
    },
    userShared: function (post) {
      return post.shares.some(userID => this.$store.state.currentUser._id === userID ? 1 : 0)
    }
  },
  computed: {
    ...mapState(['currentUser']),
    ...mapGetters(['currentUserPosts', 'allPosts'])
  },
  filters: {
    formatDate (val) {
      return moment(val).fromNow()
    },
    trimLength (val) {
      if (val.length < 200) {
        return val
      }
      return `${val.substring(0, 200)}...`
    }
  }
}
</script>

<style scoped>
  #submitButton {
    margin: 10px;
  }
</style>
