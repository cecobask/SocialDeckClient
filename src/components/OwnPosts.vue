<template>
  <b-container style="padding-top: 15px">
    <v-dialog/>
    <b-row align-h="center" >
      <b-col md="8">
        <PostsFeed :posts="currentUserPosts"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import PostsFeed from '@/components/PostsFeed'
import { mapGetters } from 'vuex'

export default {
  name: 'OwnPosts',
  components: {
    'PostsFeed': PostsFeed
  },
  computed: {
    ...mapGetters(['currentUserPosts'])
  }
}
</script>

<style scoped>

</style>
