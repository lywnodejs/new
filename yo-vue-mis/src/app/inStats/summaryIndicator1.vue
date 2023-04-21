<template>
  <div class="summary-indicaotr">
    <div class="summary-indicaotr__search">
      <!-- <label class="summary-indicaotr__search--title">安全平台指标</label>
      <el-date-picker
        v-model="confirm_time"
        type="daterange"
        :picker-options="DATE_OPTIONS"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :clearable="false"
        align="right">
      </el-date-picker>
      <button class="btn btn-primary" @click="initInStats">确定</button> -->
    </div>
     <div calss="summary-indicaotr__content">
       <el-row>
        <el-col :span="24">
          <div class="summary-indicaotr__content--chart">
            <div class="summary-indicaotr__content--chart__header">
              <label>安全大盘指标</label>
            </div>
            <div class="summary-indicaotr__content--chart__content" id="oneChart">
              <table id="table-sparkline" class="table table-bordered">
                <thead>
                  <tr>
                    <th>战场</th>
                    <th>类别</th>
                    <th>指标</th>
                    <th>2018目标</th>
                    <th>1月</th>
                    <th>2月</th>
                    <th>3月</th>
                    <th>4月</th>
                    <th>5月</th>
                    <th>6月w1</th>
                    <th>6月w2</th>
                    <th>6月w3</th>
                    <th>6月w4</th>
                    <th>月趋势</th>
                    <th>周趋势</th>
                    <th>本周重点关注</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="vertical-align: middle" rowspan="15">全员</td>
                    <td style="vertical-align: middle" rowspan="6">违规事件</td>
                    <td>低危事件数量</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td width="110">
                      <div style="width: 60px" class="inlinesparkline">71, 78, 39, 66, 39, 66, 39, 66</div>
                    </td>
                    <td width="110">
                      <div style="width: 60px" class="inlinesparkline">71, 78, 39, 66</div>
                    </td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>高危事件数量</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>高危事件召回率</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>MTTD(h)</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>MTTR(h)</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>离职违规率</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td style="vertical-align: middle" rowspan="5">风险</td>
                    <td>合规通过率</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>LCA安装率</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>培训完成度</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>异常文件传输率</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>隐私信息查询率</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td style="vertical-align: middle" rowspan="2">体验</td>
                    <td>问题反馈数量</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>内网舆情数量</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td style="vertical-align: middle" rowspan="2">能力</td>
                    <td>IAM稳定性</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>IAM体验NPS</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td style="vertical-align: middle" rowspan="13">快捷</td>
                    <td style="vertical-align: middle" rowspan="7">违规事件</td>
                    <td>低危事件数量</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>高危事件数量</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>高危事件召回率</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>MTTD(h)</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>MTTR(h)</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>离职违规率</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>离职违规人数</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td style="vertical-align: middle" rowspan="6">风险</td>
                    <td>合规通过率</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>LCA安装率</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>LCA活跃度</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>培训完成度</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>异常文件传输率</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>隐私信息查询率</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td style="vertical-align: middle" rowspan="5">soda</td>
                    <td style="vertical-align: middle" rowspan="2">违规事件</td>
                    <td>离职违规率</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>离职违规人数</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                   <td style="vertical-align: middle" rowspan="3">风险</td>
                    <td>LCA安装率</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>LCA活跃度</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>培训完成度</td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </el-col>
      </el-row>
     </div>
  </div>
</template>

<script>
import $ from 'jquery'
import sparkline from 'jquery-sparkline'

export default {
  data() {
    return {}
  },
  mounted () {
    this.initEcharts()
  },
  methods: {
    initEcharts() {
      $('.inlinesparkline').sparkline('html', {type: 'line', width: '80px'})
    }
  }
}
</script>

<style lang="less">
  .summary-indicator {
    &__search {
      &--title {
        font-size: 16px;
        font-weight: bold;
        margin-right: 15px;
      }

      .el-radio+.el-radio {
        margin-left: 15px;
        margin-right: 15px;
      }
      margin-bottom: 15px;
    }

    &__content {
      &--chart {
        border: 1px solid #ddd;
        background-color: #fff;
        min-height: 450px;
        margin-bottom: 15px;

        &__header {
          border-bottom: 1px solid #ddd;
          line-height: 25px;
          padding: 5px 15px;
          font-size: 14px;
          font-weight: bold;
          display: flex;
          justify-content: space-between;
        }

        &__content {
          width: 100%;
          height: 400px;
        }
      }
    }
  }
</style>

