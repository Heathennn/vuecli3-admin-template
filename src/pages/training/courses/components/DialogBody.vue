<template>
  <el-dialog :title="isCreate ? '新建' : '编辑'" :visible.sync="dialogVisible" width="50%" center :before-close="handleClose">
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmUpdate">确 定</el-button>
        </span>
      </el-dialog>
</template>

<script>
export default {
  props: {
    isCreate: {
      type: Boolean,
      default: false
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    selectedBodies: {
      type: Array,
      default: []
    }
  },
  methods: {
    confirmUpdate() {
      
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
