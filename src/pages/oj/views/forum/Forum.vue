<template>
  <div class="flex-container">
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
              <a @click="GoUserHome(reply.author.username)">
                {{reply.author.username}}
              </a>
            </p>
            <p slot="extra">{{reply.create_time | localtime }} &emsp;&emsp;# {{reply.floor}}</p>
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
                          :disabled="forumpostSubmitDisabled || submitted"
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
          <Icon type="information-circled"></Icon>
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
            <p>{{$t('m.Forum_Post_Time')}}</p>
            <p>{{forumpost.create_time | localtime }}</p>
          </li>
          <li>
            <p>{{$t('m.Forum_Last_Update_Time')}}</p>
            <p>{{forumpost.last_update_time | localtime }}</p>
          </li>
        </ul>
      </Card>
      <VerticalMenu v-if="is_author" @on-click="handleRoute" style="margin-top: 10px;">
        <VerticalMenu-item :disabled="contestMenuDisabled"
                           :route="{name: 'Forum-post', query: {id: forumpostID}}">
          <Icon type="edit"></Icon>
          {{$t('m.Forum_Edit')}}
        </VerticalMenu-item>
      </VerticalMenu>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import {types} from '../../../../store'
  import {FormMixin} from '@oj/components/mixins'
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
        is_author: false,
        forumreply: {
          fa_id: '',
          content: ''
        },
        forumreplys: [],
        limit: 10,
        page: 1,
        total: 0,
        routeName: '',
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
          if (this.user.username === this.forumpost.author.username) {
            this.is_author = true
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
      handleRoute (route) {
        this.$router.push(route)
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
        this.submitting = true
        let data = {
          fa_id: this.forumpostID,
          content: this.forumreply.content,
          is_top: false
        }
        api.submitFourmReply(data).then(res => {
          this.submitting = false
          this.$success('Success')
        })
      },
      GoUserHome (username) {
        this.$router.push(
          {
            name: 'user-home',
            query: {username: username}
          })
      }
    },
    computed: {
      ...mapGetters(['user', 'isAdminRole'])
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
</style>

