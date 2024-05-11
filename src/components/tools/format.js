import '@/utils/dates';

export default {
  methods: {
    /**
     * 格式化bool类型
     */
    formatBool(row, column) {
      let value = row[column.property]
      return value === true ? "是" : "否"
    },
    /**
     * 格式化时间
     */
    formatDate(row, column) {
      let value = row[column.property]
      value = this.formatSingleDate(value)
      return value
    },
    formatObject(row, column) {
      let value = row[column.property]
      value = JSON.stringify(value)
      return value
    },
    /**
     * 格式化时间
     */
    formatSingleDate(value) {
      if (undefined != value && value.indexOf('T') > 0) {
        let dateObject = new Date(value);
        return Date.formatDate(dateObject)
      }
      return value
    },
    /**
     * 格式化list
     */
    formatValue(row, column, listName) {
      if (Object.keys(row).length === 0) {
        return
      }
      let list = this[listName]
      // 兼容子文档元素
      let propertys = column.property.split('.')
      let value = row;
      propertys.forEach(property => {
        value = value[property]
      });
      if (undefined == list || undefined == value || list.length < 1) {
        return value
      }
      let matchObj = list.find((obj) => obj.value == value)
      if (matchObj) {
        return matchObj.name
      } else {
        return value
      }
    },
    /**
     * 删除参数对象的空属性值
     */
    deleteNullParam(obj) {
      return Object.keys(obj)
        .filter((k) => obj[k] != null)
        .filter((k) => obj[k] !== "")
        .reduce((a, k) => ({ ...a, [k]: obj[k] }), {});
    },
    /**
     * 模糊化处理手机号
     */
    formatMobile(row, column) {
      let value = row[column.property]
      if (value) {
        return value.toString().replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
      }
      return value
    }
  },
}
