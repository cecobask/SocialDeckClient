<template>
  <div v-if="!posts.length">
    <p class="no-results">There are currently no posts</p>
  </div>
  <div v-else>
    <vue-topprogress ref="topProgress"/>
    <v-dialog/>
    <b-card v-for="post in posts" :key="post._id" style="margin-bottom: 20px">
      <b-card-text v-if="post.message.length < 200" class="postCard">{{post.message}}</b-card-text>
      <b-card-text v-else class="postCard">{{post.message | trimLength}}
        <a href="javascript:{}" @click="loadFullPost(post._id)" id="showMore">Show full post</a>
      </b-card-text>
      <b-modal :id="post._id+'display'" :title="post.creatorFullName" header-bg-variant="dark"
               header-text-variant="light" hide-footer>
        <b-form-textarea
          class="postCard"
          readonly
          :rows="post.message.length/45"
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
          <span :id="post._id+'delete'">
            <b-button :disabled="true" class="postActionButton" variant="danger">
              <i class="fa fa-trash"/>
            </b-button>
          </span>
          <b-tooltip :target="post._id+'delete'" triggers="hover">Can only be deleted by owner!</b-tooltip>
          <span :id="post._id+'edit'">
            <b-button :disabled="true" class="postActionButton" variant="primary">
              <i class="fa fa-edit"/>
            </b-button>
          </span>
          <b-tooltip :target="post._id+'edit'" triggers="hover">Can only be edited by owner!</b-tooltip>
        </template>
        <template v-else>
          <b-button @click="deletePost(post._id)" class="postActionButton" variant="danger">
            <i class="fa fa-trash"/>
          </b-button>
          <b-button class="postActionButton" variant="primary" v-b-modal="post._id" @click="populateForm(post)">
            <i class="fa fa-edit"/>
          </b-button>
        </template>
        <b-modal :id="post._id" title="Edit post" header-bg-variant="dark" header-text-variant="light"
                 modal-ok="publish">
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
</template>

<script>
import sharePost from '@/graphql/Post/sharePost.graphql'
import deletePostById from '@/graphql/Post/deletePostById.graphql'
import updatePost from '@/graphql/Post/updatePost.graphql'
import moment from 'moment'

export default {
  name: 'PostsFeed',
  data: function () {
    return {
      editForm: {
        message: ''
      }
    }
  },
  props: ['posts'],
  methods: {
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
          this.$store.dispatch('fetchUserPosts')
          this.$refs.topProgress.done()
        })
        .catch(({ graphQLErrors }) => {
          this.$refs.topProgress.done()
          console.log(graphQLErrors)
        })
    },
    userShared: function (post) {
      if (this.$store.state.currentUser && post) {
        return post.shares.some(userID => this.$store.state.currentUser._id === userID ? 1 : 0)
      }
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
                  this.$store.dispatch('fetchUserPosts')
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
      if (this.$store.state.currentUser && post) {
        return post.creatorID === this.$store.state.currentUser._id
      }
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
          this.$store.dispatch('fetchUserPosts')
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
