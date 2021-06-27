<template>
  <panel>
    <div slot="title">{{$t('m.Frequently_Asked_Questions')}}</div>
    <div class="content markdown-body">
      <ul>
        <li>{{$t('m.Where_is_the_input_and_the_output')}} 
          <p>{{$t('m.Where_is_the_input_and_the_output_answer_part_1')}} <code>stdin</code> ('{{$t('m.Standard_Input')}}') {{$t('m.Where_is_the_input_and_the_output_answer_part_3')}} <code>stdout</code>
            ('{{$t('m.Standard_Output')}}') {{$t('m.Where_is_the_input_and_the_output_answer_part_5')}} <code>scanf</code> {{$t('m.Where_is_the_input_and_the_output_answer_part_6')}} <code>cin</code>
            {{$t('m.Where_is_the_input_and_the_output_answer_part_7')}} <code>printf</code> {{$t('m.Where_is_the_input_and_the_output_answer_part_8')}} <code>cout</code> {{$t('m.Where_is_the_input_and_the_output_answer_part_9')}} <code>{{$t('m.Runtime_Error')}}</code>.
          </p>
        </li>
        <li>「稳点」是什么？
          <p>「稳健 OnlineJudge」的稳点系统。
		        您可以通过签到、做题来获取稳点，到达一定稳点可以升级，并获得等级称号。
          </p>
          <p>稳点计算说明:
            <p>1、签到每次获得 <code>1</code> 稳点。在连续签到的第 <code>3、7、15、30、60、90、120、240、365</code> 天可以分别额外获得 <code>1、2、4、7、12、20、33、54、88</code> 稳点（没错，就是斐波那契数列）；</p>
            <p>2、每道题目，<strong>第一次 AC </strong>时根据难度（Low、Mid、High），可分别获得 <code>3、8、15</code> 稳点。</p>
          </p>
          <p>
            等级称号如下：
            <p>0 - 99 稳点: <Tag color="#636e72" style="margin-right:-15px;">小白兔</Tag></p>
            <p>100 - 199 稳点: <Tag color="primary" style="margin-right:-15px;">菜鸟</Tag></p>
            <p>200 - 499 稳点: <Tag color="#6c5ce7" style="margin-right:-15px;">键盘虾</Tag></p>
            <p>500 - 999 稳点: <Tag color="#1dd1a1" style="margin-right:-15px;">马农</Tag></p>
            <p>1000 - 4999 稳点: <Tag color="#ff9f43" style="margin-right:-15px;">牛人</Tag></p>
            <p>5000 - 9999 稳点: <Tag color="#ee5253" style="margin-right:-15px;">程序猿</Tag></p>
            <p>10000 - ∞ 稳点: <Tag color="#222f3e" style="margin-right:-15px;">攻城狮</Tag></p>
            <p>分别是0 - 6级（程序猿都是从 0 开始的嘛），每个等级都有自己的称号</p>
          </p>
        </li>
        <li>{{$t('m.What_is_the_meaning_of_submission_execution_time')}} 
        <p>{{$t('m.What_is_the_meaning_of_submission_execution_time_answer')}} 
        </p>
        </li>
        <li>{{$t('m.How_Can_I_use_CPP_Int64')}} 
          <p>{{$t('m.How_Can_I_use_CPP_Int64_answer_part_1')}}<code>long long</code> {{$t('m.How_Can_I_use_CPP_Int64_answer_part_2')}} <code>cin/cout</code> {{$t('m.or')}} <code>%lld</code>, {{$t('m.using')}}<code> __int64</code> {{$t('m.How_Can_I_use_CPP_Int64_answer_part_3')}} <code>{{$t('m.Compile_Error')}}</code>.</p>
        </li>
        <li>{{$t('m.Java_specifications')}}
          <p>{{$t('m.Java_specifications_answer_part_1')}} <code>Main</code> {{$t('m.Java_specifications_answer_part_2')}} <code>Main</code> {{$t('m.Java_specifications_answer_part_3')}}</p>
        </li>
        <li>{{$t('m.About_presentation_error')}}
          <p>{{$t('m.About_presentation_error_answer_part_1')}} <b>{{$t('m.last')}}</b> {{$t('m.About_presentation_error_answer_part_2')}} <code> {{$t('m.Wrong_Answer')}}</code>.</p>
        </li>
        <li>{{$t('m.How_to_report_bugs')}}
          <p>{{$t('m.How_to_report_bugs_answer_part_1')}} <a href="https://github.com/Harry-zklcdc/OnlineJudge">Github</a>
            {{$t('m.How_to_report_bugs_answer_part_2')}}
          </p>
        </li>
      </ul>
    </div>
  </panel>
</template>

<script>
</script>

<style lang="less" scoped>
  .content {
    font-size: 16px;
    margin: 0 50px 40px 50px;
    > ul {
      list-style: disc;
      li {
        font-size: 16px;
        margin-top: 20px;
        &:first-child {
          margin-top: 0;
        }
        p {
          font-size: 14px;
          margin-top: 5px;
        }
      }
    }
  }
</style>