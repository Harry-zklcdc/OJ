<template>
  <div class="view">
    <Panel :title="$t('m.SMTP_Config')">
      <el-form label-position="left" label-width="70px" :model="smtp">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('m.Server')" required>
              <el-input v-model="smtp.server" placeholder="SMTP Server Address"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('m.Port')" required>
              <el-input type="number" v-model="smtp.port" placeholder="SMTP Server Port"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('m.Email')" required>
              <el-input v-model="smtp.email" placeholder="Account Used To Send Email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('m.Password')" label-width="90px" required>
              <el-input v-model="smtp.password" type="password" placeholder="SMTP Server Password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="TLS">
              <el-switch
                v-model="smtp.tls">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button type="primary" @click="saveSMTPConfig">Save</el-button>
      <el-button type="warning" @click="testSMTPConfig"
                 v-if="saved" :loading="loadingBtnTest">Send Test Email</el-button>
    </Panel>

    <Panel :title="$t('m.Website_Config')">
      <el-form label-position="left" label-width="100px" ref="form" :model="websiteConfig">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('m.Base_Url')" required>
              <el-input v-model="websiteConfig.website_base_url" placeholder="Website Base Url"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Name')" required>
              <el-input v-model="websiteConfig.website_name" placeholder="Website Name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Shortcut')" required>
              <el-input v-model="websiteConfig.website_name_shortcut" placeholder="Website Name Shortcut"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('m.Footer')" required>
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="websiteConfig.website_footer"
                        placeholder="Website Footer HTML"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-col :span="6">
              <el-form-item :label="$t('m.Allow_Register')" label-width="150px">
                <el-switch
                  v-model="websiteConfig.allow_register"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('m.Submission_List_Show_All')" label-width="150px">
                <el-switch
                  v-model="websiteConfig.submission_list_show_all"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('m.Allow_Forum')" label-width="150px">
                <el-popover placement="top" trigger="hover" style="margin-left: -62px; margin-right: 56px;">
                  <p>{{$t('m.Allow_Forum_FAQ')}}</p>
                  <i slot="reference" class="el-icon-fa-question-circle import-user-icon"></i>
                </el-popover>
                <el-switch
                  v-model="websiteConfig.allow_forum_post"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('m.Allow_Reply')" label-width="150px">
                <el-switch
                  v-model="websiteConfig.allow_forum_reply"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <div>
              <el-form-item v-for="(forum_sort, index) in websiteConfig.forum_sort" :key="$t('m.Sort') + index">
                <Accordion :title="$t('m.Sort') + (index + 1)" style="margin-left: -100px;">
                  <el-button type="warning" size="small" icon="el-icon-delete" slot="header" @click="deleteSort(index)">
                    Delete
                  </el-button>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item :label="$t('m.Sort_Name')" required>
                        <el-input
                          :placeholder="$t('m.Sort_Name')"
                          v-model="forum_sort.name">
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item :label="$t('m.Sort_Permission')" required>
                        <el-select v-model="forum_sort.permission" placeholder="All">
                          <el-option label="All" value="All"></el-option>
                          <el-option label="Super Admin" value="Super Admin"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </Accordion>
              </el-form-item>
            </div>
            <div class="add-sample-btn">
              <button type="button" class="add-sorts" @click="addSort()"><i class="el-icon-plus"></i>{{$t('m.Add_Sort')}}
              </button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <save @click.native="saveWebsiteConfig" style="margin-top: 20px;"></save>
    </Panel>

    <Panel :title="$t('About Us Config')">
      <div>
        <el-form label-position="top">
          <el-form-item>
            <Simditor v-model="aboutus.content"></Simditor>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <save type="primary" @click.native="saveAboutUs"></save>
        </span>
      </div>
    </Panel>
  </div>
</template>

<script>
  import Accordion from '../../components/Accordion'
  import Simditor from '../../components/Simditor.vue'
  import api from '../../api.js'

  export default {
    name: 'Conf',
    components: {
      Simditor,
      Accordion
    },
    data () {
      return {
        init: false,
        saved: false,
        loadingBtnTest: false,
        smtp: {
          server: 'smtp.example.com',
          port: 25,
          password: '',
          email: 'email@example.com',
          tls: true
        },
        websiteConfig: {},
        // 当前关于我们id
        currentAboutUsId: 1,
        aboutus: {
          id: 1,
          content: ''
        },
        onit: false
      }
    },
    mounted () {
      api.getSMTPConfig().then(res => {
        if (res.data.data) {
          this.smtp = res.data.data
        } else {
          this.init = true
          this.$warning('Please setup SMTP config at first')
        }
      })
      api.getWebsiteConfig().then(res => {
        this.websiteConfig = res.data.data
      }).catch(() => {
      })
      api.getAboutUsList().then(res => {
        if (res.data.data) {
          this.aboutus = res.data.data
        } else {
          this.onit = true
        }
      }).catch(() => {
      })
    },
    methods: {
      saveSMTPConfig () {
        if (!this.init) {
          api.editSMTPConfig(this.smtp).then(() => {
            this.saved = true
          }, () => {
          })
        } else {
          api.createSMTPConfig(this.smtp).then(() => {
            this.saved = true
          }, () => {
          })
        }
      },
      testSMTPConfig () {
        this.$prompt('Please input your email', '', {
          inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          inputErrorMessage: 'Error email format'
        }).then(({value}) => {
          this.loadingBtnTest = true
          api.testSMTPConfig(value).then(() => {
            this.loadingBtnTest = false
          }, () => {
            this.loadingBtnTest = false
          })
        }).catch(() => {
        })
      },
      saveWebsiteConfig () {
        api.editWebsiteConfig(this.websiteConfig).then(() => {
        }).catch(() => {
        })
      },
      addSort () {
        this.websiteConfig.forum_sort.push({name: '', permission: 'All'})
      },
      deleteSort (index) {
        this.websiteConfig.forum_sort.splice(index, 1)
      },
      saveAboutUs (data) {
        if (this.onit === false) {
          api.updateAboutUs(this.aboutus).then(() => {
            data = {
              id: this.currentAboutUsId,
              content: this.aboutus.content
            }
          }, () => {
          })
        } else {
          api.createAboutUs(this.aboutus).then(() => {
            data = {
              id: this.currentAboutUsId,
              content: this.aboutus.content
            }
          }, () => {
          })
        }
        api.getAboutUsList().then(res => {
          this.aboutus = res.data.data
          this.onit = false
        }).catch(() => {
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .add-sorts {
      width: 100%;
      background-color: #fff;
      border: 1px dashed #aaa;
      outline: none;
      cursor: pointer;
      color: #666;
      height: 35px;
      font-size: 14px;
      &:hover {
        background-color: #f9fafc;
      }
      i {
        margin-right: 10px;
      }
    }
</style>
