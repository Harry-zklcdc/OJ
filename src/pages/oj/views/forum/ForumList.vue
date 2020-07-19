<template>
  <Row type="flex" :gutter="18">
    <Col :span=19>
    <Panel shadow>
      <div slot="title">{{$t('m.Forum_List')}}</div>
      <div slot="extra">
        <ul class="filter">
          <li>
            <Input v-model="query.keyword"
                   @on-enter="filterByKeyword"
                   @on-click="filterByKeyword"
                   placeholder="keyword"
                   icon="ios-search-strong"/>
          </li>
          <li>
            <Button type="info" @click="onReset">
              <Icon type="refresh"></Icon>
              {{$t('m.Reset')}}
            </Button>
          </li>
        </ul>
      </div>
      <Table style="width: 100%; font-size: 16px;"
             :columns="problemTableColumns"
             :data="ForumList"
             :loading="loadings.table"
             disabled-hover></Table>
    </Panel>
    <Pagination :total="total" :page-size="limit" @on-change="pushRouter" :current.sync="query.page"></Pagination>

    </Col>

    <Col :span="5">
      <Panel :padding="10">
        <div slot="title" class="taglist-title">{{$t('m.Sort')}}</div>
        <br>
        <Button v-for="tag in tagList"
                :key="tag.name"
                @click="filterByTag(tag.name)"
                type="ghost"
                :disabled="query.tag === tag.name"
                shape="circle"
                class="tag-btn">{{tag.name}}>
        </Button>
      </Panel>
      <Spin v-if="loadings.tag" fix size="large"></Spin>
      <VerticalMenu @on-click="handleRoute" style="margin-top: 10px;">
        <VerticalMenu-item :disabled="contestMenuDisabled"
                           :route="{name: 'Forum-post'}">
          <Icon type="edit"></Icon>
          {{$t('m.Forum_Post')}}
        </VerticalMenu-item>
      </VerticalMenu>
    </Col>
  </Row>
</template>

<script>
  import { mapGetters } from 'vuex'
  import api from '@oj/api'
  import utils from '@/utils/utils'
  import time from '@/utils/time'
  import { ProblemMixin } from '@oj/components/mixins'
  import Pagination from '@oj/components/Pagination'

  export default {
    name: 'ForumList',
    mixins: [ProblemMixin],
    components: {
      Pagination
    },
    data () {
      return {
        tagList: [],
        problemTableColumns: [
          {
            title: this.$i18n.t('m.Forum_Title'),
            width: 800,
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'large'
                },
                on: {
                  click: () => {
                    this.$router.push({name: 'Forum-details', params: {forumpostID: params.row.id}})
                  }
                },
                style: {
                  padding: '2px 0',
                  overflowX: 'auto',
                  textAlign: 'left',
                  width: '100%'
                }
              }, params.row.title)
            }
          },
          {
            title: this.$i18n.t('m.Sort'),
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'large'
                },
                on: {
                  click: () => {
                    this.$router.push({name: 'Forum-details', params: {forumpostID: params.row.id}})
                  }
                }
              }, params.row.sort)
            }
          },
          {
            title: this.$i18n.t('m.Forum_Post_Time'),
            render: (h, params) => {
              return h('span', time.utcToLocal(params.row.create_time))
            }
          },
          {
            title: this.$i18n.t('m.By'),
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'large'
                },
                on: {
                  click: () => {
                    this.$router.push(
                      {
                        name: 'user-home',
                        query: {username: params.row.author.username}
                      })
                  }
                }
              }, params.row.author.username)
            }
          }
        ],
        ForumList: [],
        limit: 20,
        total: 0,
        loadings: {
          table: true,
          tag: false
        },
        routeName: '',
        query: {
          keyword: '',
          page: 1
        }
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init (simulate = false) {
        this.routeName = this.$route.name
        let query = this.$route.query
        this.query.keyword = query.keyword || ''
        this.query.page = parseInt(query.page) || 1
        if (this.query.page < 1) {
          this.query.page = 1
        }
        this.getForumList()
      },
      pushRouter () {
        this.$router.push({
          name: 'Forum-list',
          query: utils.filterEmptyValue(this.query)
        })
      },
      getForumList () {
        let offset = (this.query.page - 1) * this.limit
        this.loadings.table = true
        api.getForumList(offset, this.limit, this.query).then(res => {
          this.loadings.table = false
          this.total = res.data.data.total
          this.ForumList = res.data.data.results
          if (this.isAuthenticated) {
            this.addStatusColumn(this.problemTableColumns, res.data.data.results)
          }
        }, res => {
          this.loadings.table = false
        })
      },
      getTagList () {
        api.getProblemTagList().then(res => {
          this.tagList = res.data.data.sort((a, b) => {
            return a.name.localeCompare(b.name)
          })
          this.loadings.tag = false
        }, res => {
          this.loadings.tag = false
        })
      },
      filterByKeyword () {
        this.query.page = 1
        this.pushRouter()
      },
      handleTagsVisible (value) {
        if (value) {
          this.problemTableColumns.push(
            {
              title: this.$i18n.t('m.Tags'),
              align: 'center',
              render: (h, params) => {
                let tags = []
                params.row.tags.forEach(tag => {
                  tags.push(h('Tag', {}, tag))
                })
                return h('div', {
                  style: {
                    margin: '8px 0'
                  }
                }, tags)
              }
            })
        } else {
          this.problemTableColumns.splice(this.problemTableColumns.length - 1, 1)
        }
      },
      onReset () {
        this.$router.push({name: 'Forum-list'})
      },
      handleRoute (route) {
        this.$router.push(route)
      }
    },
    computed: {
      ...mapGetters(['isAuthenticated'])
    },
    watch: {
      '$route' (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.init(true)
        }
      },
      'isAuthenticated' (newVal) {
        if (newVal === true) {
          this.init()
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .taglist-title {
    margin-left: -10px;
    margin-bottom: -10px;
  }

  .tag-btn {
    margin-right: 5px;
    margin-bottom: 10px;
  }

  #pick-one {
    margin-bottom: 10px;
  }
</style>
