<template>
  <div class="userBodyReport">
    <div class="bodyBaseInfo">
      <div class="body_hight">
        <div class="body_title">身高</div>
        <div class="body_value">{{baseInfo.heigth}}cm</div>
      </div>
      <div class="body_weight">

        <div class="body_title">体重</div>
        <div class="body_value">{{(baseInfo.weight).toFixed(1)}}kg</div>
      </div>
      <div class="body_lost_weight">

        <div class="body_title">已减体重</div>
        <div class="body_value">{{(baseInfo.hasLostWeight).toFixed(1)}}kg</div>
      </div>
      <div class="body_weight_number">

        <div class="body_title">体重指数</div>
        <div class="body_value">{{baseInfo.bmi}}</div>
      </div>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="维度信息" name="first">
        <div style="height: 50px; line-height: 50px; font-size: 22px; font-weight: 600">维度信息图表</div>
        <!-- <div style="border: 1px solid #666666"> -->
        <el-radio-group v-model="bodyType" @change="bodyTypeChange">
          <el-radio-button label="胸围"></el-radio-button>
          <el-radio-button label="腰围"></el-radio-button>
          <el-radio-button label="臀围"></el-radio-button>
          <el-radio-button label="左上臂围"></el-radio-button>
          <el-radio-button label="右上臂围"></el-radio-button>
          <el-radio-button label="左小腿围"></el-radio-button>
          <el-radio-button label="右小腿围"></el-radio-button>
          <el-radio-button label="身高"></el-radio-button>
        </el-radio-group>
        <div class="selects">
          <div class="timeSelect" style="margin-left: 15px; margin-right: 15px">
            <!-- <el-date-picker v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker> -->
            <el-date-picker v-model="time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
          <el-select v-model="times" placeholder="请选择">
            <el-option v-for="item in timesOption" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="bodyChart" v-if="bodyTypeCharts">
          <user-body-chart :chartData="curBodyTypeChartData" :active="bodyType"> </user-body-chart>
        </div>
        <!-- </div> -->

        <!-- 列表 -->
        <div style="height: 50px; line-height: 50px; font-size: 22px; font-weight: 600">维度信息列表</div>
        <div class="userBodyTable" style="width: 1000px; margin-top: 20px; margin-bottom: 20px">
          <el-table ref="usertable" :data="parseUserBodyTable" style="width: 100%">
            <!-- <el-table-column label="用户ID" prop="userId">
        </el-table-column> -->
            <el-table-column label="日期" prop="createTime">
              <template slot-scope="scope">
                <div>
                  <div class="tableRow" style="width: 60px; text-align: center">
                    <span>{{scope.row.createTime.value}}</span>
                    <!-- <div :style="scope.row.createTime.fluctuation ==='-1' ? arrowDownStyle : arrowUpStyle">
                  </div> -->
                  </div>
                  <div style="width: 60px;text-align: center;font-size: 10px">{{scope.row.createTime.lable}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="bustGirth" label="胸围">
              <template slot-scope="scope">
                <div>
                  <div class="tableRow" style="width: 60px; text-align: center">
                    <span>{{scope.row.bustGirth.value}}</span>
                    <div :style="scope.row.bustGirth.fluctuation ==='-1' ? arrowDownStyle : arrowUpStyle">
                    </div>
                  </div>
                  <div style="width: 60px;text-align: center;font-size: 10px">{{scope.row.bustGirth.lable}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="waistGirth" label="腰围">
              <template slot-scope="scope">
                <div>
                  <div class="tableRow" style="width: 60px; text-align: center">
                    <span>{{scope.row.waistGirth.value}}</span>
                    <div :style="scope.row.waistGirth.fluctuation ==='-1' ? arrowDownStyle : arrowUpStyle">
                    </div>
                  </div>
                  <div style="width: 60px;text-align: center;font-size: 10px">{{scope.row.waistGirth.lable}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="hipGirth" label="臀围">
              <template slot-scope="scope">
                <div>
                  <div class="tableRow" style="width: 60px; text-align: center">
                    <span>{{scope.row.hipGirth.value}}</span>
                    <div :style="scope.row.hipGirth.fluctuation ==='-1' ? arrowDownStyle : arrowUpStyle">
                    </div>
                  </div>
                  <div style="width: 60px;text-align: center;font-size: 10px">{{scope.row.hipGirth.lable}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="leftUpperArmGirth" label="左上臂围">
              <template slot-scope="scope">
                <div>
                  <div class="tableRow" style="width: 60px; text-align: center">
                    <span>{{scope.row.leftUpperArmGirth.value}}</span>
                    <div :style="scope.row.leftUpperArmGirth.fluctuation ==='-1' ? arrowDownStyle : arrowUpStyle">
                    </div>
                  </div>
                  <div style="width: 60px;text-align: center;font-size: 10px">{{scope.row.leftUpperArmGirth.lable}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="rightUpperArmGirth" label="右上臂围">
              <template slot-scope="scope">
                <div>
                  <div class="tableRow" style="width: 60px; text-align: center">
                    <span>{{scope.row.rightUpperArmGirth.value}}</span>
                    <div :style="scope.row.rightUpperArmGirth.fluctuation ==='-1' ? arrowDownStyle : arrowUpStyle">
                    </div>
                  </div>
                  <div style="width: 60px;text-align: center;font-size: 10px">{{scope.row.rightUpperArmGirth.lable}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="leftCalfGirth" label="左小腿围">
              <template slot-scope="scope">
                <div>
                  <div class="tableRow" style="width: 60px; text-align: center">
                    <span>{{scope.row.leftCalfGirth.value}}</span>
                    <div :style="scope.row.leftCalfGirth.fluctuation ==='-1' ? arrowDownStyle : arrowUpStyle">
                    </div>
                  </div>
                  <div style="width: 60px;text-align: center;font-size: 10px">{{scope.row.leftCalfGirth.lable}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="rightCalfGirth" label="右小腿围">
              <template slot-scope="scope">
                <div>
                  <div class="tableRow" style="width: 60px; text-align: center">
                    <span>{{scope.row.rightCalfGirth.value}}</span>
                    <div :style="scope.row.rightCalfGirth.fluctuation ==='-1' ? arrowDownStyle : arrowUpStyle">
                    </div>
                  </div>
                  <div style="width: 60px;text-align: center;font-size: 10px">{{scope.row.rightCalfGirth.lable}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="heigthTall" label="身高">
              <template slot-scope="scope">
                <div>
                  <div class="tableRow" style="width: 60px; text-align: center">
                    <span>{{scope.row.heigthTall.value}}</span>
                    <div :style="scope.row.heigthTall.fluctuation ==='-1' ? arrowDownStyle : arrowUpStyle">
                    </div>
                  </div>
                  <div style="width: 60px;text-align: center;font-size: 10px">{{scope.row.heigthTall.lable}}</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <el-pagination :current-page="currentPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="curPageSize" :page-sizes="pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="curTotal">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="身体成分" name="second">
        <div style="height: 50px; line-height: 50px; font-size: 22px; font-weight: 600">身体成分</div>
        <el-radio-group v-model="currentBodyComponent" @change="bodyComponentChange">
          <el-radio-button label="体重"></el-radio-button>
          <el-radio-button label="体脂率"></el-radio-button>
          <el-radio-button label="BMI"></el-radio-button>
          <el-radio-button label="基础代谢率"></el-radio-button>
          <el-radio-button label="腰臀比"></el-radio-button>
          <el-radio-button label="水分含量"></el-radio-button>
          <el-radio-button label="肌肉含量"></el-radio-button>
        </el-radio-group>
        <div class="selects">
          <div class="timeSelect" style="margin-left: 15px; margin-right: 15px">
            <!-- <el-date-picker v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker> -->
            <el-date-picker v-model="time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
          <el-select v-model="times" placeholder="请选择">
            <el-option v-for="item in timesOption" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="bodyChart" v-if="bodyComponent && activeName === 'second'">
          <user-body-component :chartData="curBodyComponentChartData" :active="currentBodyComponent"> </user-body-component>
        </div>
        <div class="userComponentTable" style="width: 900px; margin-top: 20px; margin-bottom: 20px">
          <el-table ref="usertable" :data="parseBodyComponentTable" style="width: 100%">
            <el-table-column label="日期" prop="createTime.value">
            </el-table-column>
            <el-table-column prop="weight" label="体重">
              <template slot-scope="scope">
                <div>
                  <div class="tableRow" style="borderBottom: 1px solid black; width: 60px; text-align: center">
                    <span>{{scope.row.weight.value}}</span>
                    <div :style="scope.row.weight.fluctuation ==='-1' ? arrowDownStyle : arrowUpStyle">
                    </div>
                  </div>
                  <div style="width: 60px;text-align: center; font-size: 10px">{{scope.row.weight.lable}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="percentBodyfat" label="体脂率">
              <template slot-scope="scope">
                <div>
                  <div class="tableRow" style="borderBottom: 1px solid black; width: 60px; text-align: center">
                    <span>{{scope.row.percentBodyfat.value}}</span>
                    <div :style="scope.row.percentBodyfat.fluctuation ==='-1' ? arrowDownStyle : arrowUpStyle">
                    </div>
                  </div>
                  <div style="width: 60px;text-align: center;font-size: 10px">{{scope.row.percentBodyfat.lable}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="BMI">
              <template slot-scope="scope">
                <div>
                  <div class="tableRow" style="borderBottom: 1px solid black; width: 60px; text-align: center">
                    <span>{{scope.row.bmi.value}}</span>
                    <div :style="scope.row.bmi.fluctuation ==='-1' ? arrowDownStyle : arrowUpStyle">
                    </div>
                  </div>
                  <div style="width: 60px;text-align: center;font-size: 10px">{{scope.row.bmi.lable}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="kcal" label="基础代谢率">
              <template slot-scope="scope">
                <div>
                  <div class="tableRow" style="width: 60px; text-align: center">
                    <span>{{scope.row.kcal.value}}</span>
                    <div :style="scope.row.kcal.fluctuation ==='-1' ? arrowDownStyle : arrowUpStyle">
                    </div>
                  </div>
                  <div style="width: 60px;text-align: center;font-size: 10px">{{scope.row.kcal.lable}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="waistToHip" label="腰臀比">
              <template slot-scope="scope">
                <div>
                  <div class="tableRow" style="borderBottom: 1px solid black; width: 60px; text-align: center">
                    <span>{{scope.row.waistToHip.value}}</span>
                    <div :style="scope.row.waistToHip.fluctuation ==='-1' ? arrowDownStyle : arrowUpStyle">
                    </div>
                  </div>
                  <div style="width: 60px;text-align: center;font-size: 10px">{{scope.row.waistToHip.lable}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="fluid" label="水分含量">
              <template slot-scope="scope">
                <div>
                  <div class="tableRow" style="borderBottom: 1px solid black; width: 60px; text-align: center">
                    <span>{{scope.row.fluid.value}}</span>
                    <div :style="scope.row.fluid.fluctuation ==='-1' ? arrowDownStyle : arrowUpStyle">
                    </div>
                  </div>
                  <div style="width: 60px;text-align: center;font-size: 10px">{{scope.row.fluid.lable}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="muscle" label="肌肉含量">
              <template slot-scope="scope">
                <div>
                  <div class="tableRow" style="borderBottom: 1px solid black; width: 60px; text-align: center">
                    <span>{{scope.row.muscle.value}}</span>
                    <div :style="scope.row.muscle.fluctuation ==='-1' ? arrowDownStyle : arrowUpStyle">
                    </div>
                  </div>
                  <div style="width: 60px;text-align: center;font-size: 10px">{{scope.row.muscle.lable}}</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <el-pagination :current-page="currentPage1" @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :page-size="curPageSize1" :page-sizes="pageSizes1" layout="total, sizes, prev, pager, next, jumper" :total="curTotal1">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="体态评估" name="third">
        <el-table ref="multipleTable" :data="bodiesData" tooltip-effect="dark" style="width: 100%">
          <el-table-column label="日期" prop="time">
          </el-table-column>
          <el-table-column label="测量数据">
            <el-table-column  prop="one">
            </el-table-column>
            <el-table-column prop="two">
            </el-table-column>
            <el-table-column  prop="three">
            </el-table-column>
          </el-table-column>
          <el-table-column prop="four" label="对比结果">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 图表 -->

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import UserBodyChart from './BodyChart';

import UserBodyComponent from './BodyComponent';

// import moment from 'moment';

import * as Tools from '../utils';

import arrowDown from 'assets/arrowdown.svg';

import arrowUp from 'assets/arrowup.svg';

import { getPosturPage } from 'api/operation/users';

export default {
  props: {
    sex: {
      type: String,
      default: '男'
    }
  },
  components: {
    UserBodyChart,
    UserBodyComponent
  },
  data() {
    return {
      activeName: 'first',
      currentPage: 1,
      curPageSize: 10,
      pageSizes: [10, 20, 30, 40],
      curTotal: 0,
      currentPage1: 1,
      curPageSize1: 10,
      pageSizes1: [10, 20, 30, 40],
      curTotal1: 0,
      userBodyTable: [],
      userComponentTable: [],
      arrowDownStyle: {
        width: '12px',
        height: '12px',
        backgroundImage: `url(${arrowDown})`,
        backgroundSize: '100% 100%'
      },
      arrowUpStyle: {
        width: '12px',
        height: '12px',
        backgroundImage: `url(${arrowUp})`,
        backgroundSize: '100% 100%'
      },
      baseInfo: {
        heigth: 0,
        weight: 0,
        hasLostWeight: 0,
        bmi: 0
      },
      times: 10,
      timesOption: [
        {
          value: 10,
          label: '最近10次'
        },
        {
          value: 20,
          label: '最近20次'
        },
        {
          value: 30,
          label: '最近30次'
        }
      ],
      time: [],
      activeBodyComponent: 'weight',
      activeBodyType: 'bustGirth',
      bodyComponent: null, // 身体成分
      bodyTypeCharts: null, // 身体维度图表
      currentBodyComponent: '体重',
      bodyType: '胸围',
      bodiesData: []
    };
  },
  computed: {
    userId() {
      return this.$route.query.id;
    },
    curBodyTypeChartData() {
      let obj = {};
      obj.data = this.bodyTypeCharts[this.activeBodyType];
      obj.time = this.bodyTypeCharts.time;
      return obj;
    },
    curBodyComponentChartData() {
      let obj = {};
      obj.data = this.bodyComponent[this.activeBodyComponent];
      obj.time = this.bodyComponent.time;
      return obj;
    },
    parseUserBodyTable() {
      let target = [];
      this.userBodyTable.forEach((item, index) => {
        let keys = Object.keys(item);
        let obj = {};
        keys.forEach((key, keyindex) => {
          switch (key) {
            case 'createTime':
              obj[key] = {
                value: item[key],
                lable: ''
              };
              return;
            case 'bustGirth':
              obj[key] = {
                value: item[key],
                lable: '',
                fluctuation: this.userBodyTable[index + 1]
                  ? item[key] < this.userBodyTable[index + 1][key]
                    ? '-1'
                    : item[key] == this.userBodyTable[index + 1][key]
                      ? '0'
                      : '1'
                  : '0'
              };
              return;
            case 'waistGirth':
              obj[key] = {
                value: item[key],
                lable: '',
                fluctuation: this.userBodyTable[index + 1]
                  ? item[key] < this.userBodyTable[index + 1][key]
                    ? '-1'
                    : item[key] == this.userBodyTable[index + 1][key]
                      ? '0'
                      : '1'
                  : '0'
              };
              return;
            case 'hipGirth':
              // 依赖身高
              obj[key] = {
                value: item[key],
                lable: '',
                fluctuation: this.userBodyTable[index + 1]
                  ? item[key] < this.userBodyTable[index + 1][key]
                    ? '-1'
                    : item[key] == this.userBodyTable[index + 1][key]
                      ? '0'
                      : '1'
                  : '0'
              };
              return;
            case 'leftUpperArmGirth':
              obj[key] = {
                value: item[key],
                lable: '',
                fluctuation: this.userBodyTable[index + 1]
                  ? item[key] < this.userBodyTable[index + 1][key]
                    ? '-1'
                    : item[key] == this.userBodyTable[index + 1][key]
                      ? '0'
                      : '1'
                  : '0'
              };
              return;
            case 'rightUpperArmGirth':
              // 参数 水分, 体重, 性别
              obj[key] = {
                value: item[key],
                lable: '',
                fluctuation: this.userBodyTable[index + 1]
                  ? item[key] < this.userBodyTable[index + 1][key]
                    ? '-1'
                    : item[key] == this.userBodyTable[index + 1][key]
                      ? '0'
                      : '1'
                  : '0'
              };
              return;
            case 'leftCalfGirth':
              obj[key] = {
                value: item[key],
                lable: '',
                fluctuation: this.userBodyTable[index + 1]
                  ? item[key] < this.userBodyTable[index + 1][key]
                    ? '-1'
                    : item[key] == this.userBodyTable[index + 1][key]
                      ? '0'
                      : '1'
                  : '0'
              };
              return;
            case 'rightCalfGirth':
              obj[key] = {
                value: item[key],
                lable: '',
                fluctuation: this.userBodyTable[index + 1]
                  ? item[key] < this.userBodyTable[index + 1][key]
                    ? '-1'
                    : item[key] == this.userBodyTable[index + 1][key]
                      ? '0'
                      : '1'
                  : '0'
              };
              return;
            case 'heigthTall':
              obj[key] = {
                value: item[key],
                lable: '',
                fluctuation: this.userBodyTable[index + 1]
                  ? item[key] < this.userBodyTable[index + 1][key]
                    ? '-1'
                    : item[key] == this.userBodyTable[index + 1][key]
                      ? '0'
                      : '1'
                  : '0'
              };
              return;
          }
        });
        target.push(obj);
      });
      return target;
    },
    // 加工列表数据
    parseBodyComponentTable() {
      let target = [];
      this.userComponentTable.forEach((item, index) => {
        let keys = Object.keys(item);
        let obj = {};
        keys.forEach((key, keyindex) => {
          switch (key) {
            case 'createTime':
              obj[key] = {
                value: item[key],
                lable: ''
              };
              return;
            case 'kcal':
              obj[key] = {
                value: item[key],
                lable: '',
                fluctuation: this.userComponentTable[index + 1]
                  ? item[key] < this.userComponentTable[index + 1][key]
                    ? '-1'
                    : item[key] == this.userComponentTable[index + 1][key]
                      ? '0'
                      : '1'
                  : '0'
              };
              // console.log(
              //   this.userComponentTable[index + 1]
              //     ? this.userComponentTable[index + 1][key]
              //     : ''
              // );
              return;
            case 'bmi':
              obj[key] = {
                value: item[key],
                lable: Tools.verdictBMI(item[key]),
                fluctuation: this.userComponentTable[index + 1]
                  ? item[key] < this.userComponentTable[index + 1][key]
                    ? '-1'
                    : item[key] == this.userComponentTable[index + 1][key]
                      ? '0'
                      : '1'
                  : '0'
              };
              return;
            case 'weight':
              // 依赖身高
              obj[key] = {
                value: item[key],
                lable: Tools.verdictWeight(item['height'], item[key], this.sex),
                fluctuation: this.userComponentTable[index + 1]
                  ? item[key] < this.userComponentTable[index + 1][key]
                    ? '-1'
                    : item[key] == this.userComponentTable[index + 1][key]
                      ? '0'
                      : '1'
                  : '0'
              };
              return;
            case 'percentBodyfat':
              obj[key] = {
                value: item[key],
                lable: Tools.verdictPercentBodyfat(item[key], this.sex),
                fluctuation: this.userComponentTable[index + 1]
                  ? item[key] < this.userComponentTable[index + 1][key]
                    ? '-1'
                    : item[key] == this.userComponentTable[index + 1][key]
                      ? '0'
                      : '1'
                  : '0'
              };
              return;
            case 'fluid':
              // 参数 水分, 体重, 性别
              obj[key] = {
                value: item[key],
                lable: Tools.verdictFluid(item[key], item['weight'], this.sex),
                fluctuation: this.userComponentTable[index + 1]
                  ? item[key] < this.userComponentTable[index + 1][key]
                    ? '-1'
                    : item[key] == this.userComponentTable[index + 1][key]
                      ? '0'
                      : '1'
                  : '0'
              };
              return;
            case 'muscle':
              obj[key] = {
                value: item[key],
                lable: Tools.verdictMuscle(item[key], item['weight'], this.sex),
                fluctuation: this.userComponentTable[index + 1]
                  ? item[key] < this.userComponentTable[index + 1][key]
                    ? '-1'
                    : item[key] == this.userComponentTable[index + 1][key]
                      ? '0'
                      : '1'
                  : '0'
              };
              return;
            case 'waistToHip':
              obj[key] = {
                value: item[key],
                lable: Tools.verdictWaistToHip(item[key], this.sex),
                fluctuation: this.userComponentTable[index + 1]
                  ? item[key] < this.userComponentTable[index + 1][key]
                    ? '-1'
                    : item[key] == this.userComponentTable[index + 1][key]
                      ? '0'
                      : '1'
                  : '0'
              };
              return;
          }
        });
        target.push(obj);
      });
      // console.log(target);
      return target;
    }
  },
  watch: {
    activeBodyComponent(val) {
      // console.log(val)
    },
    bodyComponent(val) {
      // console.log('运动',val)
    },
    times() {
      this.fetchUserBodyComponentChart();
      this.fetchUserBodyDimensionChart();
    },
    time() {
      this.fetchUserBodyComponentChart();
      this.fetchUserBodyComponentTable();
      this.fetchUserBodyDimensionChart();
      this.fetchUserBodyDimensionTable();
    }
  },
  methods: {
    ...mapActions([
      'getUserBodyDimensionInfo',
      'getUserBodyBaseInfo',
      'getUserBodyComponent',
      'getUserTotalSportData',
      'getUserSportDataList',
      'getUserBodyDimensionTable',
      'getUserBodyComponentTable'
    ]),
    handleSizeChange(val) {
      this.curPageSize = val;
      this.fetchUserBodyDimensionTable();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchUserBodyDimensionTable();
    },
    handleSizeChange1(val) {
      this.curPageSize = val;
      this.fetchUserBodyComponentTable();
    },
    handleCurrentChange1(val) {
      this.currentPage = val;
      this.fetchUserBodyComponentTable();
    },
    filterTime() {
      let params = {};
      params.userId = this.userId;
      params.times = this.times;
      params.beginTime = this.time[0] + ' 00:00:00';
      params.endTime = this.time[1] + ' 23:59:59';
      return params;
    },
    setDefaultDate() {
      const end = moment().format('YYYY-MM-DD');
      const start = moment(end)
        .add(-30, 'days')
        .format('YYYY-MM-DD');
      this.time = [start, end];
    },
    mapUserBodyDimensionPagination(res) {
      this.currentPage = res.pageNum < 1 ? 1 : res.pageNum;
      this.curTotal = res.total;
      this.curPageSize = res.pageSize;
    },
    mapUserBodyComponentPagination(res) {
      this.currentPage1 = res.pageNum < 1 ? 1 : res.pageNum;
      this.curTotal1 = res.total;
      this.curPageSize1 = res.pageSize;
    },
    // 身体成分图表
    fetchUserBodyComponentChart() {
      this.getUserBodyComponent(this.filterTime())
        .then(res => {
          let bodyComponent = {};
          let keys = Object.keys(res);
          for (let index in keys) {
            bodyComponent[keys[index]] = JSON.parse(res[keys[index]]);
          }
          // console.log(bodyComponent);
          this.bodyComponent = bodyComponent;
        })
        .catch(error => {
          // console.log(error);
          this.$notify.error('获取身体成分信息失败');
        });
    },
    // 身体维度图表
    fetchUserBodyDimensionChart() {
      this.getUserBodyDimensionInfo(this.filterTime())
        .then(res => {
          let bodyType = {};
          let keys = Object.keys(res);
          for (let index in keys) {
            bodyType[keys[index]] = JSON.parse(res[keys[index]]);
          }
          // console.log(bodyComponent);
          this.bodyTypeCharts = bodyType;
        })
        .catch(error => {
          // console.log(error);
          this.bodyTypeCharts = [];
          this.$notify.error('获取身体维度信息失败');
        });
    },
    // 身体维度列表
    fetchUserBodyDimensionTable() {
      this.getUserBodyDimensionTable({
        userId: this.userId,
        page: this.currentPage,
        size: this.curPageSize,
        beginTime: this.time[0] + ' 00:00:00',
        endTime: this.time[1] + ' 23:59:59'
      }).then(res => {
        res.list.forEach((item, index) => {
          item.createTime = moment(item.createTime).format('YYYY-MM-DD');
        });
        // console.log(res);
        this.userBodyTable = res.list;
        this.mapUserBodyDimensionPagination(res);
      });
    },
    // 身体成分列表
    fetchUserBodyComponentTable() {
      this.getUserBodyComponentTable({
        userId: this.userId,
        page: this.currentPage,
        size: this.curPageSize,
        beginTime: this.time[0] + ' 00:00:00',
        endTime: this.time[1] + ' 23:59:59'
      }).then(res => {
        // console.log(res);
        res.list.forEach((item, index) => {
          item.createTime = moment(item.createTime).format('YYYY-MM-DD');
        });
        this.userComponentTable = res.list;
        this.mapUserBodyComponentPagination(res);
      });
    },
    bodyTypeChange(val) {
      switch (val) {
        case '胸围':
          this.activeBodyType = 'bustGirth';
          return;
          break;
        case '腰围':
          this.activeBodyType = 'waistGirth';
          return;
          break;
        case '臀围':
          this.activeBodyType = 'hipGirth';
          return;
          break;
        case '左上臂围':
          this.activeBodyType = 'leftUpperArmGirth';
          return;
          break;
        case '右上臀围':
          this.activeBodyType = 'rightUpperArmGirth';
          return;
          break;
        case '左小腿围':
          this.activeBodyType = 'leftCalfGirth';
          return;
          break;
        case '右小腿围':
          this.activeBodyType = 'rightCalfGirth';
          return;
          break;
        case '身高':
          this.activeBodyType = 'height';
          return;
          break;
        default:
          this.activeBodyType = 'bustGirth';
          return;
          break;
      }
    },
    bodyComponentChange(val) {
      switch (val) {
        case '体重':
          this.activeBodyComponent = 'weight';
          return;
          break;
        case '体脂率':
          this.activeBodyComponent = 'percentBodyfat';
          return;
          break;
        case 'BMI':
          this.activeBodyComponent = 'bmi';
          return;
          break;
        case '基础代谢率':
          this.activeBodyComponent = 'kcal';
          return;
          break;
        case '腰臀比':
          this.activeBodyComponent = 'waistToHip';
          return;
          break;
        case '肌肉含量':
          this.activeBodyComponent = 'muscle';
          return;
          break;
        case '水分含量':
          this.activeBodyComponent = 'fluid';
          return;
          break;
        default:
          this.activeBodyComponent = 'weight';
          return;
          break;
      }
    },
    mapFunctionName(key) {
      switch (key) {
        case 'bmi':
          return 'verdictBMI';
          break;
        case 'weight':
          return 'verdictWeight';
          break;
        case 'percentBodyfat':
          return 'verdictPercentBodyfat';
          break;
        case 'fluid':
          return 'verdictFluid';
          break;
        case 'muscle':
          return 'verdictMuscle';
          break;
        case 'waistToHip':
          return 'verdictWaistToHip';
          break;
      }
      return false;
    },
    // 获取体态评估
    fetchBody() {
      getPosturPage({userId: this.userId}).then( (res) => {
        let datas = [];
        let keys = Object.keys(res.data.data);
        for(let key of keys) {
          for(let item of res.data.data[key]) {
            datas.push(Object.assign({}, item, {time: key}))
          }
        }
        // console.log(datas);
        this.bodiesData = datas
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setDefaultDate();
      // 基本信息
      this.fetchBody();
      this.getUserBodyBaseInfo({ userId: this.userId })
        .then(res => {
          this.baseInfo = res;
        })
        .catch(error => {
          this.$notify.error('获取基本信息失败');
        });
      this.fetchUserBodyDimensionChart();
      // 身体维度列表
      this.fetchUserBodyDimensionTable();
      // 身体成分图表
      this.fetchUserBodyComponentChart();
      // 身体成分列表
      this.fetchUserBodyComponentTable();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/style/utils';

.userBodyReport {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
}
.selects {
  width: 100%;
  @include flexbox;
  @include align-items(center);
  padding: {
    top: 10px;
  }
}
.bodyBaseInfo {
  width: 100%;
  padding: {
    top: 20px;
    bottom: 30px;
  }
  @include flexbox;
  @include align-items(center);
  @include justify-content(space-around);
}

.body_value {
  font-size: 30px;
  font-weight: 600;
}

.bodyChart {
  width: 100%;
  height: 600px;
}
.tableRow {
  @include flexbox;
  @include justify-content(center);
  @include align-items(center);
}
</style>
