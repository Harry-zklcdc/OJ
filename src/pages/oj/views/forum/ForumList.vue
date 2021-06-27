<template>
  <Row v-if="website.allow_forum_post" type="flex" :gutter="18">
    <Col :span="19">
    <Panel shadow>
      <div slot="title">{{$t('m.Forum_List')}}</div>
      <div slot="extra">
        <ul class="filter">
          <li>
            <Input v-model="query.keyword"
                   @on-enter="filterByKeyword"
                   @on-click="filterByKeyword"
                   placeholder="keyword"
                   icon="ios-search"/>
          </li>
          <li>
            <Button type="info" @click="onReset">
              <Icon type="md-refresh"></Icon>
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
        <Button v-for="(sort, index) in website.forum_sort"
                :key="sort.name"
                @click="filterBySort(index + 1)"
                type="ghost"
                :disabled="query.sort === index + 1"
                shape="circle"
                class="tag-btn">{{sort.name}}
        </Button>
      </Panel>
      <Spin v-if="loadings.tag" fix size="large"></Spin>
      <VerticalMenu @on-click="handleRoute" style="margin-top: 10px;">
        <VerticalMenu-item :disabled="contestMenuDisabled"
                           :route="{name: 'Forum-post'}">
          <Icon type="md-create"></Icon>
          {{$t('m.Forum_Post')}}
        </VerticalMenu-item>
      </VerticalMenu>
    </Col>
  </Row>

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
            width: 600,
            render: (h, params) => {
              let top = ''
              let topmargin = ''
              let nice = ''
              let nicemargin = ''
              let light = {
                padding: '2px 0',
                overflowX: 'auto',
                textAlign: 'left'
              }
              if (params.row.is_top) {
                top = 'md-flag'
                topmargin = '0 0 0 8px'
              }
              if (params.row.is_nice) {
                nice = 'md-star'
                nicemargin = '0 2px 0 8px'
              }
              if (params.row.is_light) {
                light = {
                  padding: '2px 0',
                  overflowX: 'auto',
                  textAlign: 'left',
                  color: '#e74c3c'
                }
              }
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'large'
                  },
                  on: {
                    click: () => {
                      this.$router.push({name: 'Forum-details', params: {forumpostID: params.row.id}})
                    }
                  },
                  style: light
                }, params.row.title),
                h('Icon', {
                  props: {
                    type: nice,
                    size: '14',
                    color: '#f1c40f'
                  },
                  style: {
                    margin: nicemargin
                  }
                }),
                h('Icon', {
                  props: {
                    type: top,
                    size: '14'
                  },
                  style: {
                    margin: topmargin
                  }
                })
              ])
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
                    this.filterBySort(params.row.sort)
                  }
                },
                style: {
                  margin: '0 0 0 -22px'
                }
              }, this.website.forum_sort[params.row.sort - 1].name)
            }
          },
          {
            title: this.$i18n.t('m.Forum_Post_Time'),
            width: 180,
            render: (h, params) => {
              return h('span', {
                style: {
                  margin: '0 0 0 -5px'
                }
              }, time.utcToLocal(params.row.create_time))
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
                },
                style: {
                  margin: '0 0 0 -10px'
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
          sort: '',
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
        this.query.sort = query.sort || ''
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
      filterByKeyword () {
        this.query.page = 1
        this.pushRouter()
      },
      filterBySort (sortID) {
        this.query.sort = sortID
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
      ...mapGetters(['website', 'isAuthenticated'])
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
