<template>
  <b-container v-if="currentUser">
    <vue-topprogress ref="topProgress"/>
    <v-dialog/>
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
            <b-button pill variant="primary" @click="createPost" :disabled="!createForm.message" style="margin: 10px">
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
            <b-card-text v-if="post.message.length < 200" class="postCard">{{post.message}}</b-card-text>
            <b-card-text v-else class="postCard">{{post.message | trimLength}}
              <a href="javascript:{}" @click="loadFullPost(post._id)">Show full post</a>
            </b-card-text>
            <b-modal :id="post._id+'display'" :title="post.creatorFullName" header-bg-variant="dark" header-text-variant="light" hide-footer>
              <b-form-textarea
                class="postCard"
                readonly
                :rows="post.message.length/50"
                v-model="post.message"
                no-resize>
              </b-form-textarea>
            </b-modal>
            <template v-slot:header>
              <h6 v-text="post.creatorFullName"/>
              <small class="text-muted">{{post.createdTime | formatDate}}</small>
              <small v-if="post.updatedTime" class="text-muted" style="margin-left: 5px">
                (updated {{post.updatedTime | formatDate}})
              </small>
            </template>
            <template v-slot:footer>
              <b-button :disabled="userShared(post)" @click="sharePost(post._id)" class="postActionButton">
                <i class="fa fa-retweet"/>
                {{post.shares.length}}
              </b-button>
              <template v-if="!userIsOwner(post)">
                <b-button :disabled="true" class="postActionButton" variant="danger"
                          v-b-tooltip.hover title="Can only be deleted by owner!">
                  <i class="fa fa-trash"/>
                </b-button>
                <b-button :disabled="true" class="postActionButton" variant="primary"
                          v-b-tooltip.hover title="Can only be edited by owner!">
                  <i class="fa fa-edit"/>
                </b-button>
              </template>
              <template v-else>
                <b-button @click="deletePost(post._id)" class="postActionButton" variant="danger">
                  <i class="fa fa-trash"/>
                </b-button>
                <b-button class="postActionButton" variant="primary" v-b-modal="post._id" @click="populateForm(post)">
                  <i class="fa fa-edit"/>
                </b-button>
              </template>
              <b-modal :id="post._id" title="Edit post" header-bg-variant="dark" header-text-variant="light" modal-ok="publish">
                <b-form-textarea
                  v-model="editForm.message"
                  rows="3"
                  max-rows="6">
                </b-form-textarea>
                <template v-slot:modal-footer="{ cancel }">
                  <b-button variant="success" @click="editPost(post)">
                    PUBLISH
                  </b-button>
                  <b-button variant="danger" @click="cancel()">
                    CANCEL
                  </b-button>
                </template>
              </b-modal>
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
import deletePostById from '@/graphql/Post/deletePostById.graphql'
import updatePost from '@/graphql/Post/updatePost.graphql'
import moment from 'moment'

export default {
  name: 'Feed',
  data: function () {
    return {
      createForm: {
        message: ''
      },
      editForm: {
        message: ''
      }
    }
  },
  async created () {
    if (!this.$store.state.posts) await this.$store.dispatch('fetchAllPosts')
    this.$root.$emit('bv::enable::tooltip', 'deleteButton')
    this.$root.$emit('bv::hide::tooltip')
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
          this.$refs.topProgress.done()
        })
        .catch(({ graphQLErrors }) => {
          console.log(graphQLErrors)
          this.createForm.message = null
          this.$refs.topProgress.done()
        })
    },
    sharePost: function (_id) {
      this.$refs.topProgress.start()
      this.$apollo.mutate({
        mutation: sharePost,
        variables: {
          postID: _id
        }
      })
        .then(() => {
          this.$store.dispatch('fetchAllPosts')
          this.$refs.topProgress.done()
        })
        .catch(({ graphQLErrors }) => {
          this.$refs.topProgress.done()
          console.log(graphQLErrors)
        })
    },
    userShared: function (post) {
      return post.shares.some(userID => this.$store.state.currentUser._id === userID ? 1 : 0)
    },
    deletePost: function (_id) {
      this.$modal.show('dialog', {
        title: 'Alert!',
        text: 'You are about to delete a post!',
        buttons: [
          {
            title: 'Confirm',
            default: true,
            handler: () => {
              this.$refs.topProgress.start()
              this.$apollo.mutate({
                mutation: deletePostById,
                variables: {
                  _id: _id
                }
              })
                .then(() => {
                  this.$store.dispatch('fetchAllPosts')
                  this.$refs.topProgress.done()
                })
                .catch(({ graphQLErrors }) => {
                  console.log(graphQLErrors)
                  this.$refs.topProgress.done()
                })
              this.$modal.hide('dialog')
            }
          }
        ]
      })
    },
    userIsOwner: function (post) {
      return post.creatorID === this.$store.state.currentUser._id
    },
    editPost: function (post) {
      this.$refs.topProgress.start()
      this.$apollo.mutate({
        mutation: updatePost,
        variables: {
          postID: post._id,
          message: this.editForm.message,
          links: [{
            url: 'https://github.com/'
          }]
        }
      })
        .then(() => {
          this.$store.dispatch('fetchAllPosts')
          this.$bvModal.hide(post._id)
          this.$refs.topProgress.done()
        })
        .catch(({ graphQLErrors }) => {
          console.log(graphQLErrors)
          this.$bvModal.hide(post._id)
          this.$refs.topProgress.done()
        })
    },
    populateForm: function (post) {
      this.$bvModal.show(post._id)
      this.editForm.message = post.message
    },
    loadFullPost: function (postID) {
      this.$bvModal.show(postID + 'display')
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
  .postActionButton {
    margin-right: 5px;
  }
  .postCard {
    white-space: pre-wrap;
    text-align: justify
  }
</style>
