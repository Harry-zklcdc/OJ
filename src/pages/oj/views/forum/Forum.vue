<template>
  <div v-if="website.allow_forum_post" class="flex-container">
    <div id="forumpost-main">
      <!--ForumPost main-->
      <Panel :padding="40" shadow>
        <div slot="title">{{forumpost.title}}</div>
        <div id="forumpost-content" class="markdown-body" v-katex>
          <p class="title">{{$t('m.Forum_Content')}}</p>
          <p class="content" v-html="forumpost.content"></p>
        </div>
      </Panel>
      <!--ForumPost main end-->

      <!--Reply List main-->
      <Panel :padding="40" shadow style="margin-top: 20px;">
        <div slot="title">{{$t('m.Forum_Reply_List')}}</div>
        <div class="no-replys" v-if="!forumreplys.length" key="no-replys">
          <p>{{$t('m.Forum_No_Reply')}}</p>
        </div>
        <div style="margin-top: -30px; margin-bottom: 30px">
          <Card :padding="20" dis-hover v-for="reply in forumreplys"
                :key="reply.id"
                style="margin-top: 5px;">
            <p slot="title">
              <Tag v-if="reply.author.title" :color="reply.author.title_color" style="margin-top: -1px;">{{ reply.author.title }}</Tag>
              <Tag v-else :color="user_grade[reply.author.grade].color" style="margin-top: -1px;">{{ user_grade[reply.author.grade].name }}</Tag>
              <a @click="GoUserHome(reply.author.username)" style="">
                {{reply.author.username}}
              </a>
            </p>
            <p slot="extra">
              <Button v-if="visible || reply.author.username === user.username"
                      class="delete-Button" 
                      type="text"
                      @click="ConfirmDeleteForumReply = true, forumreplyID = reply.id">
                      {{$t('m.Forum_Delete')}}</Button>
              {{reply.create_time | localtime }} &emsp;&emsp;# {{reply.floor}}
            </p>
            <div id="forumreply-content" class="markdown-body" v-katex>
              <p class="content" v-html="reply.content"></p>
            </div>
          </Card>
          <Pagination :total="total" :page-size.sync="limit" :current.sync="page"
                    @on-change="getForumReplyList" show-sizer
                    @on-page-size-change="getForumReplyList(1)">
          </Pagination>
        </div>
        
      </Panel>
      <!--Reply List main end-->

      <!--Reply main-->
      <Card :padding="20" id="submit-reply" dis-hover>
        <div class="title">{{$t('m.Forum_Reply')}}</div>
        <div style="margin-left: 20px; margin-right: 20px;">
          <Simditor v-model="forumreply.content"></Simditor>
        </div>
        <Row type="flex" justify="space-between">
          <Col :span="12" style="margin-top: 20px;">
            <Button type="warning" icon="edit" :loading="submitting" @click="submitForumReply"
                          class="fl-right">
            <span v-if="submitting">{{$t('m.Submitting')}}</span>
            <span v-else>{{$t('m.Submit')}}</span>
            </Button>
          </Col>
        </Row>
      </Card>
      <!--Reply main end-->
    </div>

    <div id="right-column">
      <Card id="info">
        <div slot="title" class="header">
          <Icon type="md-information-circle"></Icon>
          <span class="card-title">{{$t('m.Forum_Post_Information')}}</span>
        </div>
        <ul>
          <li>
            <p>ID</p>
            <p>{{forumpost.id}}</p>
          </li>
          <li>
            <p>{{$t('m.By')}}</p>
            <p>{{forumpost.author.username}}</p>
          </li>
          <li>
            <p>{{$t('m.Sort')}}</p>
            <p>{{website.forum_sort[forumpost.sort - 1].name}}</p>
          </li>
          <li>
            <p>{{$t('m.Forum_Post_Time')}}</p>
            <p>{{forumpost.create_time | localtime }}</p>
          </li>
          <li>
            <p>{{$t('m.Forum_Last_Update_Time')}}</p>
            <p>{{forumpost.last_update_time | localtime }}</p>
          </li>
        </ul>
      </Card>
      <!--Edit / Top / Light / Nice / Delete-->
      <div class="VerticalMenu">
        <Card v-if="visible" :padding="0" dis-hover style="margin-top: 10px;">
          <ul>
            <li @click.stop="ForumPostControl(1)">
              <Icon type="md-create"></Icon>
              {{$t('m.Forum_Edit')}}
            </li>
            <li v-if="isSuperAdmin">
              <Icon type="md-flag" style="margin-left: 2px;"></Icon>
              &nbsp;{{$t('m.Forum_Top')}}
              <i-switch v-model="forumpost.is_top" @on-change="ForumPostControl(2)" style="margin-left: 10px;"></i-switch>
            </li>
            <li v-if="isSuperAdmin">
              <Icon type="ios-bulb" style="margin-left: 2px;"></Icon>
              &nbsp;{{$t('m.Forum_Light')}}
              <i-switch v-model="forumpost.is_light" @on-change="ForumPostControl(3)" style="margin-left: 10px;"></i-switch>
            </li>
            <li v-if="isSuperAdmin">
              <Icon type="md-star" style="margin-left: -1px;"></Icon>
              {{$t('m.Forum_Nice')}}
              <i-switch v-model="forumpost.is_nice" @on-change="ForumPostControl(4)" style="margin-left: 10px;"></i-switch>
            </li>
            <li class="delete" @click.stop="ForumPostControl(0)">
                <Icon type="md-trash" style="margin-left: 1px;"></Icon>
                {{$t('m.Forum_Delete')}}
            </li>
          </ul>
        </Card>
      </div>
    </div>
    <Modal
        v-model="ConfirmDeleteForumPost"
        :title="$t('m.Forum_Delete')"
        @on-ok="confirmDeletePost">
        <p>{{$t('m.Forum_ConfirmDelete')}}</p>
    </Modal>
    <Modal
        v-model="ConfirmDeleteForumReply"
        :title="$t('m.Forum_Delete')"
        @on-ok="confirmDeleteReply">
        <p>{{$t('m.Forum_ConfirmDelete')}}</p>
    </Modal>
  </div>

  <div v-else class="error404">
    <div class="error404-body-con">
      <Card>
        <div class="error404-body-con-title">4<span><Icon type="ios-navigate-outline"></Icon></span>4</div>
        <p class="error404-body-con-message">YOU&nbsp;&nbsp;LOOK&nbsp;&nbsp;LOST</p>
        <div class="error404-btn-con">
          <Button @click="goHome" size="large" style="width: 200px;" type="ghost">{{$t('m.Go_Home')}}</Button>
          <Button @click="backPage" size="large" style="width: 200px;margin-left: 40px;" type="primary">{{$t('m.Back')}}</Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import {types} from '../../../../store'
  import {FormMixin} from '@oj/components/mixins'
  import { USER_GRADE } from '@/utils/constants'
  import api from '@oj/api'
  import Simditor from '@oj/components/Simditor.vue'
  import Pagination from '@oj/components/Pagination'

  export default {
    name: 'forumpost',
    components: {
      Simditor,
      Pagination
    },
    mixins: [FormMixin],
    data () {
      return {
        forumpostID: '',
        submitting: false,
        forumpost: {
          title: '',
          content: '',
          author: {
            username: ''
          }
        },
        visible: false,
        ConfirmDeleteForumPost: false,
        ConfirmDeleteForumReply: false,
        forumreply: {
          fa_id: '',
          content: ''
        },
        forumreplys: [],
        limit: 10,
        page: 1,
        total: 0,
        routeName: '',
        user_grade: USER_GRADE,
        query: {
          page: 1
        }
      }
    },
    mounted () {
      this.$store.commit(types.CHANGE_CONTEST_ITEM_VISIBLE, {menu: false})
      this.init()
    },
    methods: {
      ...mapActions(['changeDomTitle']),
      init () {
        this.$Loading.start()
        this.forumpostID = this.$route.params.forumpostID
        api.getForum(this.forumpostID).then(res => {
          this.$Loading.finish()
          let forumpost = res.data.data
          this.changeDomTitle({title: forumpost.title})
          this.forumpost = forumpost
          if (this.isSuperAdmin) {
            this.visible = true
          }
          if (this.user.username === this.forumpost.author.username) {
            this.visible = true
          }
        }, () => {
          this.$Loading.error()
        })
        this.routeName = this.$route.name
        let query = this.$route.query
        this.query.page = parseInt(query.page) || 1
        if (this.query.page < 1) {
          this.query.page = 1
        }
        this.getForumReplyList(1)
      },
      ForumPostControl (method) {
        if (method === 1) {
          // Edit
          this.$router.push({name: 'Forum-post', query: {id: this.forumpostID}})
        }
        if (method === 2) {
          // Top
          this.submitforumpost(2)
        }
        if (method === 3) {
          // Light
          this.submitforumpost(3)
        }
        if (method === 4) {
          // Nice
          this.submitforumpost(4)
        }
        if (method === 0) {
          // Delete
          this.ConfirmDeleteForumPost = true
        }
      },
      confirmDeletePost () {
        api.deleteFourmPost(this.forumpostID).then(res => {
          this.$success('Success')
          this.$router.push({name: 'Forum-list'})
        })
      },
      submitforumpost (model) {
        if (this.isSuperAdmin === false) {
          this.$error('User does\'t have permission')
          return
        }
        if (this.website.allow_forum_post === false) {
          if (model === 2) { this.forumpost.is_top = !this.forumpost.is_top }
          if (model === 3) { this.forumpost.is_light = !this.forumpost.is_light }
          if (model === 4) { this.forumpost.is_nice = !this.forumpost.is_nice }
          this.$error(this.website.website_name + ' does\'t allow to post')
          return
        }
        let data = {
          id: this.forumpost.id,
          title: this.forumpost.title,
          content: this.forumpost.content,
          is_top: this.forumpost.is_top,
          is_light: this.forumpost.is_light,
          is_nice: this.forumpost.is_nice,
          sort: this.forumpost.sort
        }
        api.submitFourmPost(data).then(res => {
          this.$success('Success')
        }, () => {
          if (model === 2) this.forumpost.is_top = !this.forumpost.is_top
          if (model === 3) this.forumpost.is_light = !this.forumpost.is_light
          if (model === 4) this.forumpost.is_nice = !this.forumpost.is_nice
        })
      },
      getForumReplyList (page) {
        let offset = (this.page - 1) * this.limit
        this.query.page = page
        api.getForumReplyList(offset, this.limit, this.forumpostID, this.query).then(res => {
          this.total = res.data.data.total
          this.forumreplys = res.data.data.results
        })
      },
      submitForumReply () {
        if (this.forumreply.content.trim() === '') {
          this.$error('Reply can not be empty!')
          return
        }
        if (this.website.allow_forum_reply === false) {
          this.$error(this.website.website_name + ' does\'t allow to reply')
          return
        }
        this.submitting = true
        let data = {
          fa_id: this.forumpostID,
          content: this.forumreply.content
        }
        api.submitFourmReply(data).then(res => {
          this.submitting = false
          this.$success('Success')
          this.forumreply.content = ''
          this.forumreplys.unshift(res.data.data)
        }, () => {
          this.submitting = false
        })
      },
      confirmDeleteReply () {
        api.deleteFourmReply(this.forumreplyID).then(res => {
          this.$success('Success')
          this.getForumReplyList(this.page)
        })
      },
      GoUserHome (username) {
        this.$router.push(
          {
            name: 'user-home',
            query: {username: username}
          })
      },
      backPage () {
        this.$router.go(-1)
      },
      goHome () {
        this.$router.push({
          name: 'home'
        })
      }
    },
    computed: {
      ...mapGetters(['website', 'user', 'isSuperAdmin'])
    },
    watch: {
      '$route' () {
        this.init()
      }
    }
  }
</script>

<style lang="less" scoped>
  .card-title {
    margin-left: 8px;
  }

  .flex-container {
    #forumpost-main {
      flex: auto;
      margin-right: 18px;
    }
    #forumreply-main {
      flex: auto;
      margin-top: 5px;
    }
    #right-column {
      flex: none;
      width: 250px;
    }
  }

  #forumpost-content {
    margin-top: -50px;
    .title {
      font-size: 20px;
      font-weight: 400;
      margin: 25px 0 12px 0;
      color: #3091f2;
      .copy {
        padding-left: 8px;
      }
    }
    p.content {
      margin-left: 25px;
      margin-right: 20px;
      font-size: 15px
    }
  }

  #forumreply-content {
    .title {
      font-size: 20px;
      font-weight: 400;
      margin: 25px 0 12px 0;
      color: #3091f2;
      .copy {
        padding-left: 8px;
      }
    }
    p.content {
      margin-left: 25px;
      margin-right: 20px;
      font-size: 15px
    }
  }

  #submit-reply {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  #info {
    margin-bottom: 20px;
    ul {
      list-style-type: none;
      li {
        border-bottom: 1px dotted #e9eaec;
        margin-bottom: 10px;
        p {
          display: inline-block;
        }
        p:first-child {
          width: 90px;
        }
        p:last-child {
          float: right;
        }
      }
    }
  }

  .fl-right {
    float: right;
  }

  .no-replys {
    text-align: center;
    font-size: 16px;
  }

  .title {
    font-size: 21px;
    font-weight: 500;
    padding-top: 10px;
    padding-bottom: 20px;
    line-height: 30px;
    padding: 5px 15px;
    margin-bottom: 15px;
  }

  .VerticalMenu {
    li {
      border-bottom: 1px dotted #e9eaec;
      color: #495060;
      display: block;
      text-align: left;
      padding: 15px 20px;
      &:hover {
        background: #f8f8f9;
        border-left: 2px solid #5cadff;
        color: #2d8cf0;
      }
      & > .ivu-icon {
        font-size: 16px;
        margin-right: 8px;
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }

  .delete:hover  {
    background: #f8f8f9 !important;
    border-left: 2px solid #ed3f14 !important;
    color: #ed3f14 !important;
  }

  .delete-Button:hover  {
    color: #ed3f14 !important;
  }

  @keyframes error404animation {
    0% {
      transform: rotateZ(0deg);
    }
    20% {
      transform: rotateZ(-60deg);
    }
    40% {
      transform: rotateZ(-10deg);
    }
    60% {
      transform: rotateZ(50deg);
    }
    80% {
      transform: rotateZ(-20deg);
    }
    100% {
      transform: rotateZ(0deg);
    }
  }

  .error404 {
    &-body-con {
      width: 700px;
      height: 500px;
      margin: 0 auto;
      &-title {
        text-align: center;
        font-size: 240px;
        font-weight: 700;
        color: #2d8cf0;
        height: 260px;
        line-height: 260px;
        margin-top: 40px;
        span {
          display: inline-block;
          color: #19be6b;
          font-size: 230px;
          animation: error404animation 3s ease 0s infinite alternate;
        }
      }
      &-message {
        display: block;
        text-align: center;
        font-size: 30px;
        font-weight: 500;
        letter-spacing: 12px;
        color: #dddde2;
      }
    }
    &-btn-con {
      text-align: center;
      padding: 20px 0;
      margin-bottom: 40px;
    }
  }
</style>

