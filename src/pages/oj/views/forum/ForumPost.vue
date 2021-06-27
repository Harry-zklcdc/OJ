<template>
  <div v-if="website.allow_forum_post" class="flex-container">
    <div id="forumpost-main">
      <!--Post main-->
      <Card :padding="20" id="submit-reply" dis-hover>
        <div class="title">{{$t('m.Forum_Post')}}</div>
        <Form ref="forumpost" :model="forumpost" :rules="ruleValidate" inline style="margin-left: 20px; margin-right: 20px; width: 100%;">
          <FormItem :label="$t('m.Sort')" prop="sort">
            <Select v-model="forumpost.sort" size="large" style="width:200px; margin-right: 20px;">
              <Option v-for="(sort, index) in website.forum_sort" :value="index + 1" :key="sort.name">{{ sort.name }}</Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('m.Forum_Title')" prop="title">
            <Input v-model="forumpost.title" placeholder="Title" size="large" style="width: 600px"></Input>
          </FormItem>
        </Form>
        <Form ref="forumpost" :model="forumpost" :rules="ruleValidate" style="margin-left: 20px; margin-right: 20px; width: 100%;">
          <FormItem :label="$t('m.Forum_Content')" prop="content">
            <div style="margin-top: 35px; margin-right: 40px;">
              <Simditor v-model="forumpost.content"></Simditor>
            </div>
          </FormItem>
        </Form>
        <Row type="flex" justify="space-between">
          <Col :span="12" style="margin-top: 20px; margin-left: 45px;">
            <Button type="warning" icon="md-create" :loading="submitting" @click="submitforumpost"
                          :disabled="forumpostSubmitDisabled"
                          class="fl-right">
            <span v-if="submitting">{{$t('m.Submitting')}}</span>
            <span v-else>{{$t('m.Submit')}}</span>
            </Button>
          </Col>
        </Row>
      </Card>
      <!--Post main end-->
    </div>
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
  import {mapGetters} from 'vuex'
  import {types} from '../../../../store'
  import {FormMixin} from '@oj/components/mixins'
  import api from '@oj/api'
  import utils from '@/utils/utils'
  import Simditor from '@oj/components/Simditor.vue'

  export default {
    name: 'forumpost',
    components: {
      Simditor
    },
    mixins: [FormMixin],
    data () {
      return {
        submitting: false,
        forumpost: {
          id: '',
          title: '',
          content: '',
          sort: 0
        },
        ruleValidate: {
          sort: [
            { required: true, message: 'The Sort cannot be empty', trigger: 'blur' }
          ],
          title: [
            { required: true, message: 'The Title cannot be empty', trigger: 'blur' }
          ],
          content: [
            { required: true, message: 'The Content cannot be empty', trigger: 'blur' }
          ]
        },
        limit: 20,
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
      init () {
        this.$Loading.start()
        if (this.$route.query.id) {
          this.forumpost.id = this.$route.query.id
          api.getForum(this.forumpost.id).then(res => {
            this.$Loading.finish()
            let forumpost = res.data.data
            this.forumpost = forumpost
          }, () => {
            this.$Loading.error()
          })
        } else {
          this.forumpost.id = -1
        }
        this.$Loading.finish()
      },
      pushRouter () {
        this.$router.push({
          name: 'Forum-list',
          query: utils.filterEmptyValue(this.query)
        })
      },
      submitforumpost () {
        if (this.website.allow_forum_post === false) {
          this.$error(this.website.website_name + ' does\'t allow to post')
          return
        }
        if (this.website.forum_sort[this.forumpost.sort - 1].permission === 'Super Admin' && this.isSuperAdmin === false) {
          this.$error(this.website.forum_sort[this.forumpost.sort - 1].name + ' does\'t allow you to post')
          return
        }
        if (this.forumpost.title.trim() === '') {
          this.$error('Title can not be empty!')
          return
        }
        if (this.forumpost.content.trim() === '') {
          this.$error('Reply can not be empty!')
          return
        }
        this.submitting = true
        let data = {
          id: this.forumpost.id,
          title: this.forumpost.title,
          content: this.forumpost.content,
          is_top: false,
          is_light: false,
          is_nice: false,
          sort: this.forumpost.sort
        }
        api.submitFourmPost(data).then(res => {
          this.submitting = false
          this.$success('Success')
          this.$router.push({name: 'Forum-details', params: {forumpostID: res.data.data.id}})
        }, () => {
          this.submitting = false
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
      ...mapGetters(['website', 'isSuperAdmin'])
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
    #forumpost-main {
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

  #forumpost-content {
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

