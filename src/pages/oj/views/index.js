import ProblemList from './problem/ProblemList.vue'
import Logout from './user/Logout.vue'
import UserHome from './user/UserHome.vue'
import About from './help/About.vue'
import FAQ from './help/FAQ.vue'
import AboutUs from './help/AboutUs.vue'
import NotFound from './general/404.vue'
import Home from './general/Home.vue'
import Announcements from './general/Announcements.vue'
import IDE from './ide/ide.vue'
import ForumList from './forum/ForumList.vue'
import ForumPost from './forum/ForumPost.vue'

// Grouping Components in the Same Chunk
const SubmissionList = () => import(/* webpackChunkName: "submission" */ '@oj/views/submission/SubmissionList.vue')
const SubmissionDetails = () => import(/* webpackChunkName: "submission" */ '@oj/views/submission/SubmissionDetails.vue')

const ACMRank = () => import(/* webpackChunkName: "userRank" */ '@oj/views/rank/ACMRank.vue')
const OIRank = () => import(/* webpackChunkName: "userRank" */ '@oj/views/rank/OIRank.vue')
const ExperienceRank = () => import(/* webpackChunkName: "userRank" */ '@oj/views/rank/ExperienceRank.vue')

const ApplyResetPassword = () => import(/* webpackChunkName: "password" */ '@oj/views/user/ApplyResetPassword.vue')
const ResetPassword = () => import(/* webpackChunkName: "password" */ '@oj/views/user/ResetPassword.vue')

const Problem = () => import(/* webpackChunkName: "Problem" */ '@oj/views/problem/Problem.vue')

const Forum = () => import(/* webpackChunkName: "Forum" */ '@oj/views/forum/Forum.vue')

export {
  Home, NotFound, Announcements,
  Logout, UserHome, About, FAQ, AboutUs,
  ProblemList, Problem,
  ACMRank, OIRank, ExperienceRank,
  SubmissionList, SubmissionDetails,
  ApplyResetPassword, ResetPassword,
  IDE, Forum, ForumList, ForumPost
}
/* 组件导出分为两类, 一类常用的直接导出，另一类诸如Login, Logout等用懒加载,懒加载不在此处导出
 *   在对应的route内加载
 *   见https://router.vuejs.org/en/advanced/lazy-loading.html
 */
