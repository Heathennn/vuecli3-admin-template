  <template>
  <div class="table">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="日期">
      </el-table-column>
      <el-table-column prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="address">
      </el-table-column>
    </el-table>
  </div>

</template>

  <script>
export default {
  data() {
    return {
      tableData: [
      ]
    };
  }
};
</script>
<style lang="scss">
 .table{
   margin-top: 30px;
   width: 100%;
 }
</style>
