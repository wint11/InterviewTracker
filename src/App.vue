<template>
  <div id="app">
    <!-- 拖拽区域 -->
    
    
    <div class="widget-container">
      <!-- 紧凑头部 -->
      <div class="widget-header">
        <div class="title-row">
          <div class="title-section">
            <span class="widget-title">📅 面试管理</span>
            <button @click="showAddDialog = true" class="add-btn-header">+</button>
          </div>
          <div class="window-controls">
            <button class="control-btn" @click="minimizeWindow">−</button>
            <button class="control-btn close" @click="closeWindow">×</button>
          </div>
        </div>
      </div>

      <div class="widget-content">
        <!-- 横向统计数据 -->
        <div class="horizontal-stats">
          <div class="stat-block" :class="{ active: filterStatus === 'all' }" @click="setFilter('all')">
            <div class="stat-number" style="color: #4facfe">{{ totalInterviews }}</div>
            <div class="stat-label">总数</div>
          </div>
          <div class="stat-block" :class="{ active: filterStatus === 'pending' }" @click="setFilter('pending')">
            <div class="stat-number" style="color: #f39c12">{{ pendingInterviews }}</div>
            <div class="stat-label">待面试</div>
          </div>
          <div class="stat-block" :class="{ active: filterStatus === 'completed' }" @click="setFilter('completed')">
            <div class="stat-number" style="color: #27ae60">{{ completedInterviews }}</div>
            <div class="stat-label">已完成</div>
          </div>
          <div class="stat-block" :class="{ active: filterStatus === 'today' }" @click="setFilter('today')">
             <div class="stat-number" style="color: #e74c3c">{{ todayInterviews }}</div>
             <div class="stat-label">今日</div>
           </div>
        </div>



        <!-- 紧凑面试列表 -->
        <div class="widget-list">
          <div v-if="filteredInterviews.length === 0" class="empty-state">
            <div class="empty-text">暂无面试</div>
          </div>
          <div v-else class="interview-items">
            <div
              v-for="interview in filteredInterviews"
              :key="interview.id"
              class="interview-item-compact"
              :class="`status-${getInterviewStatus(interview)}`"
            >
              <div class="company-name">{{ interview.company }}</div>
              <div class="interview-info">
                <span class="interview-type">{{ getInterviewTypeText(interview.type) }}</span>
                <span class="datetime">{{ formatTimeRange(interview.startTime, interview.endTime) }}</span>
              </div>
              <div class="status-indicator" :class="`status-${getInterviewStatus(interview)}`">
                {{ getStatusText(getInterviewStatus(interview)) }}
              </div>
              <div class="item-actions">
                <button class="action-btn" @click="editInterview(interview)">✏️</button>
                <button class="action-btn delete" @click="deleteInterview(interview.id)">🗑️</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑面试对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingInterview ? '编辑面试' : '添加面试'"
      width="280px"
      @close="resetForm"
      class="compact-dialog"
    >
      <div class="form-container">
        <el-form :model="interviewForm" :rules="formRules" ref="formRef" label-width="50px" size="small">
          <el-form-item label="企业" prop="company">
            <el-input v-model="interviewForm.company" placeholder="企业名称" size="small" />
          </el-form-item>
          <el-form-item label="月份" prop="month">
            <el-select v-model="interviewForm.month" placeholder="选择月份" size="small" style="width: 100%">
              <el-option v-for="month in 12" :key="month" :label="`${month}月`" :value="month" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期" prop="day">
            <el-select v-model="interviewForm.day" placeholder="选择日期" size="small" style="width: 100%">
              <el-option v-for="day in getDaysInMonth(interviewForm.month)" :key="day" :label="`${day}日`" :value="day" />
            </el-select>
          </el-form-item>
          <el-form-item label="开始" prop="startTime">
            <div style="display: flex; gap: 8px; width: 100%;">
              <el-input-number 
                v-model="interviewForm.startHour" 
                :min="0" 
                :max="23" 
                :step="1" 
                size="small" 
                style="width: 50%;" 
                placeholder="时"
                controls-position="right"
              />
              <el-input-number 
                v-model="interviewForm.startMinute" 
                :min="0" 
                :max="55" 
                :step="5" 
                size="small" 
                style="width: 50%;" 
                placeholder="分"
                controls-position="right"
              />
            </div>
          </el-form-item>
          <el-form-item label="结束" prop="endTime">
            <div style="display: flex; gap: 8px; width: 100%;">
              <el-input-number 
                v-model="interviewForm.endHour" 
                :min="0" 
                :max="23" 
                :step="1" 
                size="small" 
                style="width: 50%;" 
                placeholder="时"
                controls-position="right"
              />
              <el-input-number 
                v-model="interviewForm.endMinute" 
                :min="0" 
                :max="55" 
                :step="5" 
                size="small" 
                style="width: 50%;" 
                placeholder="分"
                controls-position="right"
              />
            </div>
          </el-form-item>
          <el-form-item label="形式" prop="type">
            <el-select v-model="interviewForm.type" placeholder="面试形式" size="small" style="width: 100%">
              <el-option label="线上" value="online" />
              <el-option label="线下" value="offline" />
              <el-option label="电话" value="phone" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAddDialog = false" size="small">取消</el-button>
          <el-button type="primary" @click="saveInterview" size="small">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'

// 响应式数据
const interviews = ref([])
const showAddDialog = ref(false)
const editingInterview = ref(null)
const searchKeyword = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const formRef = ref()
const filterStatus = ref('all') // 筛选状态: 'all', 'pending', 'completed', 'cancelled'

// 表单数据
const interviewForm = ref({
  company: '',
  month: '',
  day: '',
  startHour: '',
  startMinute: '',
  endHour: '',
  endMinute: '',
  type: '',
  status: 'pending'
})

// 表单验证规则
const formRules = {
  company: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
  month: [{ required: true, message: '请选择月份', trigger: 'change' }],
  day: [{ required: true, message: '请选择日期', trigger: 'change' }],
  startHour: [{ required: true, message: '请选择开始小时', trigger: 'change' }],
  startMinute: [{ required: true, message: '请选择开始分钟', trigger: 'change' }],
  endHour: [{ required: true, message: '请选择结束小时', trigger: 'change' }],
  endMinute: [
    { required: true, message: '请选择结束分钟', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        const { startHour, startMinute, endHour, endMinute } = interviewForm.value
        if (startHour !== '' && startMinute !== '' && endHour !== '' && endMinute !== '') {
          const startTime = startHour * 60 + startMinute
          const endTime = endHour * 60 + endMinute
          if (endTime <= startTime) {
            callback(new Error('结束时间必须晚于开始时间'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  type: [{ required: true, message: '请选择面试形式', trigger: 'change' }]
}

// 获取面试实际状态（根据时间自动判断）
const getInterviewStatus = (interview) => {
  if (interview.status === 'cancelled') {
    return 'cancelled'
  }
  
  const now = dayjs()
  const endTime = dayjs(interview.endTime)
  
  if (now.isAfter(endTime)) {
    return 'completed'
  } else {
    return 'pending'
  }
}

// 计算属性
const totalInterviews = computed(() => interviews.value.length)
const pendingInterviews = computed(() => interviews.value.filter(i => getInterviewStatus(i) === 'pending').length)
const completedInterviews = computed(() => interviews.value.filter(i => getInterviewStatus(i) === 'completed').length)
const cancelledInterviews = computed(() => interviews.value.filter(i => i.status === 'cancelled').length)
const todayInterviews = computed(() => {
  const today = dayjs().format('YYYY-MM-DD')
  return interviews.value.filter(i => {
    if (!i.startTime) return false
    return dayjs(i.startTime).format('YYYY-MM-DD') === today
  }).length
})

// 筛选后的面试列表
const filteredInterviews = computed(() => {
  let filtered = interviews.value
  
  // 状态筛选
  if (filterStatus.value === 'pending') {
    filtered = filtered.filter(i => getInterviewStatus(i) === 'pending')
  } else if (filterStatus.value === 'completed') {
    filtered = filtered.filter(i => getInterviewStatus(i) === 'completed')
  } else if (filterStatus.value === 'cancelled') {
    filtered = filtered.filter(i => i.status === 'cancelled')
  } else if (filterStatus.value === 'today') {
    const today = dayjs().format('YYYY-MM-DD')
    filtered = filtered.filter(i => {
      if (!i.startTime) return false
      return dayjs(i.startTime).format('YYYY-MM-DD') === today
    })
  }
  
  // 关键词搜索
  if (searchKeyword.value) {
    filtered = filtered.filter(i => 
      i.company.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  
  // 类型筛选
  if (typeFilter.value) {
    filtered = filtered.filter(i => i.type === typeFilter.value)
  }
  
  return filtered.sort((a, b) => {
    const aTime = a.startTime ? new Date(a.startTime) : new Date(0)
    const bTime = b.startTime ? new Date(b.startTime) : new Date(0)
    return aTime - bTime
  })
})

// 筛选功能
const setFilter = (status) => {
  filterStatus.value = status
}

// 获取指定月份的天数
const getDaysInMonth = (month) => {
  if (!month) return 31
  const year = new Date().getFullYear()
  return new Date(year, month, 0).getDate()
}

// 方法
const minimizeWindow = () => {
  console.log('Minimize button clicked', window.electronAPI);
  if (window.electronAPI && window.electronAPI.minimize) {
    window.electronAPI.minimize();
  } else {
    console.error('electronAPI.minimize not available');
  }
}

const closeWindow = () => {
  console.log('Close button clicked', window.electronAPI);
  if (window.electronAPI && window.electronAPI.close) {
    window.electronAPI.close();
  } else {
    console.error('electronAPI.close not available');
  }
}

const formatDateTime = (datetime) => {
  return dayjs(datetime).format('YYYY年MM月DD日 HH:mm')
}

const formatTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return '时间待定'
  const start = dayjs(startTime)
  const end = dayjs(endTime)
  
  if (start.format('YYYY-MM-DD') === end.format('YYYY-MM-DD')) {
    // 同一天
    return `${start.format('MM/DD HH:mm')}-${end.format('HH:mm')}`
  } else {
    // 跨天
    return `${start.format('MM/DD HH:mm')}-${end.format('MM/DD HH:mm')}`
  }
}

const getStatusText = (status) => {
  const statusMap = {
    pending: '待面试',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

const getInterviewTypeText = (type) => {
  const typeMap = {
    online: '线上',
    offline: '线下',
    phone: '电话'
  }
  return typeMap[type] || type
}

const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    completed: 'success',
    cancelled: 'danger'
  }
  return typeMap[status] || 'info'
}

const resetForm = () => {
  interviewForm.value = {
    company: '',
    month: '',
    day: '',
    startHour: '',
    startMinute: '',
    endHour: '',
    endMinute: '',
    type: '',
    status: 'pending'
  }
  editingInterview.value = null
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

const saveInterview = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    // 合并月份、日期和时间
    const year = new Date().getFullYear()
    const month = String(interviewForm.value.month).padStart(2, '0')
    const day = String(interviewForm.value.day).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    const startTime = `${String(interviewForm.value.startHour).padStart(2, '0')}:${String(interviewForm.value.startMinute).padStart(2, '0')}`
    const endTime = `${String(interviewForm.value.endHour).padStart(2, '0')}:${String(interviewForm.value.endMinute).padStart(2, '0')}`
    const startDateTime = `${dateStr} ${startTime}:00`
    const endDateTime = `${dateStr} ${endTime}:00`
    
    const interviewData = {
      company: interviewForm.value.company,
      startTime: startDateTime,
      endTime: endDateTime,
      type: interviewForm.value.type,
      status: interviewForm.value.status
    }
    
    if (editingInterview.value) {
      // 编辑模式
      const index = interviews.value.findIndex(i => i.id === editingInterview.value.id)
      if (index !== -1) {
        interviews.value[index] = {
          ...interviewData,
          id: editingInterview.value.id
        }
      }
      ElMessage.success('面试信息更新成功！')
    } else {
      // 新增模式
      const newInterview = {
        ...interviewData,
        id: Date.now()
      }
      interviews.value.push(newInterview)
      ElMessage.success('面试添加成功！')
    }
    
    saveToLocalStorage()
    showAddDialog.value = false
    resetForm()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const editInterview = (interview) => {
  editingInterview.value = interview
  
  // 拆分日期和时间
  const startDateTime = dayjs(interview.startTime)
  const endDateTime = dayjs(interview.endTime)
  
  interviewForm.value = {
    company: interview.company,
    month: startDateTime.month() + 1, // dayjs月份从0开始，需要+1
    day: startDateTime.date(),
    startHour: startDateTime.hour(),
    startMinute: startDateTime.minute(),
    endHour: endDateTime.hour(),
    endMinute: endDateTime.minute(),
    type: interview.type,
    status: interview.status
  }
  
  showAddDialog.value = true
}

const deleteInterview = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个面试安排吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    interviews.value = interviews.value.filter(i => i.id !== id)
    saveToLocalStorage()
    ElMessage.success('删除成功！')
  } catch {
    // 用户取消删除
  }
}

const markCompleted = (id) => {
  const interview = interviews.value.find(i => i.id === id)
  if (interview) {
    interview.status = 'completed'
    saveToLocalStorage()
    ElMessage.success('已标记为完成！')
  }
}

const sendReminder = (interview) => {
  // 模拟发送提醒
  const timeRange = formatTimeRange(interview.startTime, interview.endTime)
  const message = `面试提醒：您有一场${interview.company}的${getInterviewTypeText(interview.type)}面试，时间：${timeRange}。请准时参加！`
  
  ElMessage({
    message: `提醒已设置\n内容：${message}`,
    type: 'success',
    duration: 5000,
    showClose: true
  })
  
  // 在实际应用中，这里应该调用提醒API
  console.log('设置提醒:', message)
}

const saveToLocalStorage = () => {
  localStorage.setItem('interviews', JSON.stringify(interviews.value))
}

const loadFromLocalStorage = () => {
  const saved = localStorage.getItem('interviews')
  if (saved) {
    interviews.value = JSON.parse(saved)
  }
}

// 检查即将到来的面试并发送提醒
const checkUpcomingInterviews = () => {
  const now = dayjs()
  const upcoming = interviews.value.filter(interview => {
    if (interview.status !== 'pending' || !interview.startTime) return false
    const interviewTime = dayjs(interview.startTime)
    const timeDiff = interviewTime.diff(now, 'hour')
    return timeDiff > 0 && timeDiff <= 24 // 24小时内的面试
  })
  
  if (upcoming.length > 0) {
    ElMessage({
      message: `您有 ${upcoming.length} 场面试即将到来，请注意查看！`,
      type: 'warning',
      duration: 5000
    })
  }
}

// 生命周期
onMounted(() => {
  loadFromLocalStorage()
  checkUpcomingInterviews()
  
  // 每小时检查一次即将到来的面试
  setInterval(checkUpcomingInterviews, 60 * 60 * 1000)
})
</script>

<style scoped>
#app {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: transparent;
}

.drag-area {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 30px;
  -webkit-app-region: drag;
  z-index: 1000;
}

.widget-container {
  width: 100%;
  height: 100vh;
  background: #000000;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #ffffff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.widget-header {
  background: #000000;
  border-bottom: 1px solid #333333;
  border-radius: 12px 12px 0 0;
  padding: 8px 16px;
  -webkit-app-region: drag;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.widget-title {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.add-btn-header {
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: #333333;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s ease;
  -webkit-app-region: no-drag;
}

.add-btn-header:hover {
  background: #555555;
  transform: scale(1.1);
}

.window-controls {
  display: flex;
  gap: 8px;
  -webkit-app-region: no-drag;
}

.control-btn {
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.control-btn.close:hover {
  background: #e74c3c;
}

.widget-content {
  flex: 1;
  padding: 16px;
  overflow-y: hidden;
  background: #000000;
  display: flex;
  flex-direction: column;
}

.horizontal-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat-block {
  background: #000000;
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-block:hover {
  background: #111111;
  border-color: #555555;
  transform: translateY(-2px);
}

.stat-block.active {
  background: rgba(79, 172, 254, 0.2);
  border-color: #4facfe;
  box-shadow: 0 0 10px rgba(79, 172, 254, 0.3);
}

.stat-number {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #cccccc;
  opacity: 0.8;
}

.action-bar {
  margin-bottom: 16px;
}

.add-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.widget-list {
  flex: 1;
  overflow-y: auto;
  height: 0;
  min-height: 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.widget-list::-webkit-scrollbar {
  width: 6px;
}

.widget-list::-webkit-scrollbar-track {
  background: transparent;
}

.widget-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.widget-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: rgba(255, 255, 255, 0.6);
}

.empty-text {
  font-size: 14px;
  margin-top: 10px;
}

.interview-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.interview-item-compact {
  background: #000000;
  border: 1px solid #333333;
  border-radius: 6px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
}

.interview-item-compact:hover {
  background: #111111;
  border-color: #555555;
}

.interview-item-compact .company-name {
  font-weight: 600;
  font-size: 13px;
  color: #ffffff;
  min-width: 80px;
  flex-shrink: 0;
}

.interview-item-compact .interview-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.interview-item-compact .interview-type {
  font-size: 11px;
  color: #888888;
}

.interview-item-compact .datetime {
  font-size: 11px;
  color: #cccccc;
}

.interview-item-compact .status-indicator {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 500;
  white-space: nowrap;
}

.interview-item-compact .status-indicator.status-pending {
  background: rgba(241, 196, 15, 0.2);
  color: #f1c40f;
}

.interview-item-compact .status-indicator.status-completed {
  background: rgba(39, 174, 96, 0.2);
  color: #27ae60;
}

.interview-item-compact .status-indicator.status-cancelled {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.interview-item-compact .item-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.interview-item-compact .action-btn {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.2s ease;
}

.interview-item-compact .action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.interview-item-compact .action-btn.delete:hover {
  background: rgba(231, 76, 60, 0.3);
}

.interview-item {
  background: #000000;
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s ease;
}

.interview-item:hover {
  background: #111111;
  border-color: #555555;
  transform: translateX(4px);
}

.interview-item.status-pending {
  border-left: 3px solid #f39c12;
}

.interview-item.status-completed {
  border-left: 3px solid #27ae60;
}

.interview-item.status-cancelled {
  border-left: 3px solid #e74c3c;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.company-name {
  font-weight: 600;
  font-size: 14px;
  color: #ffffff;
}

.item-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 12px;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.action-btn.delete:hover {
  background: rgba(231, 76, 60, 0.2);
}

.item-details {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
}

.interview-type {
  font-size: 13px;
  color: #cccccc;
  grid-column: 1;
}

.datetime {
  font-size: 11px;
  color: #888888;
  grid-column: 1;
}

.status-indicator {
  grid-column: 2;
  grid-row: 1 / 3;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  text-align: center;
  font-weight: 500;
}

.status-indicator.status-pending {
  background: rgba(243, 156, 18, 0.2);
  color: #f39c12;
  border: 1px solid rgba(243, 156, 18, 0.3);
}

.status-indicator.status-completed {
  background: rgba(39, 174, 96, 0.2);
  color: #27ae60;
  border: 1px solid rgba(39, 174, 96, 0.3);
}

.status-indicator.status-cancelled {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.3);
}

.more-indicator {
  text-align: center;
  padding: 12px;
  color: #888888;
  font-size: 12px;
  font-style: italic;
}

/* 紧凑对话框样式 */
.compact-dialog {
  --el-dialog-padding-primary: 12px;
}

.compact-dialog .el-dialog__header {
  padding: 12px 16px 8px 16px;
}

.compact-dialog .el-dialog__body {
  padding: 8px 16px;
}

.compact-dialog .el-dialog__footer {
  padding: 8px 16px 12px 16px;
}

.compact-dialog .el-form-item {
  margin-bottom: 12px;
}

.compact-dialog .el-form-item__label {
  font-size: 12px;
  line-height: 28px;
}

.compact-dialog .el-input__inner,
.compact-dialog .el-select__wrapper {
  height: 28px;
  line-height: 28px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.form-container {
  padding: 0;
}

/* 下拉选择器高层级显示 */
.el-popper {
  z-index: 9999 !important;
}

.form-container {
  background: rgba(30, 30, 30, 0.9);
  border-radius: 8px;
  padding: 20px;
}

/* Element Plus 深色主题覆盖 */
:deep(.el-dialog) {
  background: rgba(20, 20, 20, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-dialog__header) {
  background: rgba(30, 30, 30, 0.8) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-dialog__title) {
  color: #ffffff !important;
}

:deep(.el-dialog__body) {
  background: rgba(15, 15, 15, 0.9) !important;
  color: #ffffff !important;
}

:deep(.el-form-item__label) {
  color: #cccccc !important;
}

:deep(.el-input__wrapper) {
  background: rgba(40, 40, 40, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-input__inner) {
  color: #ffffff !important;
  background: transparent !important;
}

:deep(.el-select .el-input__wrapper) {
  background: rgba(40, 40, 40, 0.8) !important;
}

:deep(.el-textarea__inner) {
  background: rgba(40, 40, 40, 0.8) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-button) {
  background: rgba(40, 40, 40, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
}

/* 隐藏滚动条 */
.widget-content::-webkit-scrollbar {
  display: none;
}

.widget-content {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>