<template>
  <panel>
    <div slot="title">{{$t('m.Frequently_Asked_Questions')}}</div>
    <div class="content markdown-body">
      <ul>
        <li>怎么做到「输入、输出」？
          <p>您的程序应该从<code>键盘</code>(标准输入)读取输入，并输出在<code>屏幕</code>(标准输出)。
            举个栗子，您可以在「C语言」使用<code>scanf</code>，或者在「C++」中使用<code>cin</code>读取键盘所输入的内容，并且在「C语言」使用<code>printf</code>，或者在「C++」使用<code>cout</code>在屏幕上输出内容。
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
            <p>100 - 199 稳点: <Tag color="blue" style="margin-right:-15px;">菜鸟</Tag></p>
            <p>200 - 499 稳点: <Tag color="#6c5ce7" style="margin-right:-15px;">键盘虾</Tag></p>
            <p>500 - 999 稳点: <Tag color="#1dd1a1" style="margin-right:-15px;">马农</Tag></p>
            <p>1000 - 4999 稳点: <Tag color="#ff9f43" style="margin-right:-15px;">牛人</Tag></p>
            <p>5000 - 9999 稳点:<Tag color="#ee5253" style="margin-right:-15px;">程序猿</Tag></p>
            <p>10000 - ∞ 稳点: <Tag color="#222f3e" style="margin-right:-15px;">攻城狮</Tag></p>
          </p>
        </li>
        <li>「时间限制」意味着什么？
          <p>「稳健 OnlineJudge」会使用不同的输入文件多次测试代码。
		        如果代码在每个输入文件的时限内给出了正确的答案，则显示的执行时间是每个测试用例所花费的最大时间。
            否则，执行时间就没有意义了。
          </p>
        </li>
        <li>要怎么在 C++ 中使用「64位整形」？
          <p>您应该声明为<code>long</code>并与<code>cin/cout</code>或<code>%lld</code>一起使用，使用<code>64位整形</code>可能会导致<code>「Compile Error」</code>。</p>
        </li>
        <li>「Java程序」有什么规范?
          <p>所有程序都必须以一个静态「main类」开始，在<code>Main类</code>中。不要使用公共类，即使是<code>Main类</code>也必须是非公共的类以避免编译错误。
		        可以使用使用「缓冲I/O」以避免由于异常刷新而超出时间限制。
		      </p>
        </li>
        <li>怎么知道程序的编译错误？
          <p>「稳健 OnlineJudge」是没有办法输出编译错误的。「判题机」会自动读入您的程序所输出的内容，并和正确答案比较。
		        如果您的程序与正确的输出不同，结果将是<code>Wrong Answer</code>。
		      </p>
        </li>
        <li>要怎么反馈这个「Online Judge」的BUG？
          <p>「OnlineJudge」是开源的，您可以在<a href="https://github.com/Harry-zklcdc/OJ"> Github </a>中提交「issue」。
            并提供有关bug的详细信息（如env，version ..），这将帮助我们解决这个bug。
            当然，我们很高兴合并您的「pull」请求。
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