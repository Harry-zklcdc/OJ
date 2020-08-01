<template>
  <div class="flex-container">
    <div id="forumpost-main">
      <!--Post main-->
      <Card :padding="20" id="submit-reply" dis-hover>
        <div class="title">{{$t('m.Forum_Post')}}</div>
        <Form ref="forumpost" :model="forumpost" :rules="ruleValidate" inline style="margin-left: 20px; margin-right: 20px; width: 100%;">
          <FormItem :label="$t('m.Sort')" prop="sort">
            <Select v-model="forumpost.sort" size="large" style="width:200px; margin-right: 20px;" @change="console.log(forumpost.sort)">
              <Option v-for="sort in website.forum_sort" :value="sort.id" :key="sort.name">{{ sort.name }}</Option>
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
            <Button type="warning" icon="edit" :loading="submitting" @click="submitforumpost"
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
      }
    },
    computed: {
      ...mapGetters(['website'])
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
</style>

