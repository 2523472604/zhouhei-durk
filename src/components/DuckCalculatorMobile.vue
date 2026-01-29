<script setup lang="ts">
import { ref } from 'vue'
import { showSuccessToast } from 'vant'

const BUCKET_WEIGHT = 4
const FRAME_WEIGHT = 1
const WATER_BUFFER = 1.5
const CHILI_BUFFER = 100

const oldSoupWithBucket = ref<number | string>('')
const goodsWithFrame = ref<number | string>('')
const potNumber = ref<number | string>('')
const activeTab = ref(0)

const waterNeeded = ref<any>(null)
const seasoningAmounts = ref<any>(null)

const handleCalculate = async () => {
  try {
    await formRef.value?.validate()
  } catch (error) {
    return
  }

  if (!oldSoupWithBucket.value || !goodsWithFrame.value) {
    return
  }

  const oldSoupNum = Number(oldSoupWithBucket.value)
  const goodsFrameNum = Number(goodsWithFrame.value)

  const oldSoupWeight = oldSoupNum - BUCKET_WEIGHT
  const goodsWeight = goodsFrameNum - FRAME_WEIGHT
  
  const goodsWeightInJin = goodsWeight * 2
  const consumedWaterBeforeConversion = goodsWeightInJin * 0.2
  const consumedWater = consumedWaterBeforeConversion / 2
  
  const oldSoupWeightInJin = oldSoupWeight * 2
  const waterToAdd = (25 - oldSoupWeightInJin) / 2
  
  const totalWater = consumedWater + waterToAdd + oldSoupNum
  const totalWaterWithBuffer = totalWater + WATER_BUFFER
  
  const consumedWaterInJin = consumedWater * 2
  const waterToAddInJin = waterToAdd * 2
  const materialTotal = consumedWaterInJin + waterToAddInJin + goodsWeightInJin
  
  waterNeeded.value = {
    consumedWater: consumedWater.toFixed(2),
    waterToAdd: waterToAdd.toFixed(2),
    totalWater: totalWater.toFixed(2),
    waterBuffer: WATER_BUFFER.toFixed(1),
    totalWaterWithBuffer: totalWaterWithBuffer.toFixed(2),
    oldSoupWeightInJin: oldSoupWeightInJin.toFixed(2),
    goodsWeight: goodsWeight.toFixed(2),
    goodsWeightInJin: goodsWeightInJin.toFixed(2),
    consumedWaterBeforeConversion: consumedWaterBeforeConversion.toFixed(2),
    consumedWaterInJin: consumedWaterInJin.toFixed(2),
    waterToAddInJin: waterToAddInJin.toFixed(2),
    materialTotal: materialTotal.toFixed(2)
  }

  if (potNumber.value !== '' && potNumber.value !== null) {
    const potNum = Number(potNumber.value)
    if (!isNaN(potNum) && potNum > 0) {
      let chiliAmount = 0
      let pepperAmount = 0
      
      if (potNum === 1) {
        chiliAmount = materialTotal * 6
        pepperAmount = materialTotal * 2.5
      } else if (potNum === 2) {
        chiliAmount = materialTotal * 5
        pepperAmount = materialTotal * 2
      } else if (potNum === 3) {
        chiliAmount = materialTotal * 3
        pepperAmount = materialTotal * 1
      } else {
        chiliAmount = materialTotal * 6
        pepperAmount = materialTotal * 2.5
      }
      
      const chiliWithBuffer = chiliAmount + CHILI_BUFFER
      
      const saltAmount = materialTotal * 4
      const msgAmount = materialTotal * 5.5
      const chickenAmount = materialTotal * 7
      const sugarAmount = materialTotal * 42
      const maltoseAmount = materialTotal * 8
      
      seasoningAmounts.value = {
        chili: chiliAmount.toFixed(1),
        chiliBuffer: CHILI_BUFFER.toFixed(0),
        chiliWithBuffer: chiliWithBuffer.toFixed(1),
        pepper: pepperAmount.toFixed(1),
        salt: saltAmount.toFixed(1),
        msg: msgAmount.toFixed(1),
        chicken: chickenAmount.toFixed(1),
        sugar: sugarAmount.toFixed(1),
        maltose: maltoseAmount.toFixed(1),
        potNumber: potNum
      }
    }
  } else {
    seasoningAmounts.value = null
  }
  showSuccessToast('计算完成');
}

const handleReset = () => {
  oldSoupWithBucket.value = ''
  goodsWithFrame.value = ''
  potNumber.value = ''
  waterNeeded.value = null
  seasoningAmounts.value = null
}

const activeNames = ref('')
const activeNames2 = ref('')
const activeNames3 = ref('')

const formRef = ref()

const oldSoupRules = [
  { required: true, message: '请输入老汤+桶的重量' },
  { pattern: /^\d+(\.\d+)?$/, message: '请输入有效的数字' },
  { 
    validator: (val: string) => {
      const num = Number(val)
      return num > BUCKET_WEIGHT
    }, 
    message: `重量必须大于桶重(${BUCKET_WEIGHT}kg)` 
  }
]

const goodsRules = [
  { required: true, message: '请输入货+框的重量' },
  { pattern: /^\d+(\.\d+)?$/, message: '请输入有效的数字' },
  { 
    validator: (val: string) => {
      const num = Number(val)
      return num > FRAME_WEIGHT
    }, 
    message: `重量必须大于框重(${FRAME_WEIGHT}kg)` 
  }
]

const potRules = [
  { pattern: /^\d+$/, message: '请输入有效的整数' },
  { 
    validator: (val: string) => {
      if (!val) return true
      const num = Number(val)
      return num >= 1 && num <= 10
    }, 
    message: '锅数范围为1-10' 
  }
]
</script>

<template>
  <div class="mobile-calculator">
      <van-nav-bar title="🦆 鸭货计算器" fixed placeholder />
      
      <div class="content-wrapper">
      <van-form ref="formRef">
        <van-cell-group inset class="input-group">
          <van-field
            v-model="oldSoupWithBucket"
            name="oldSoupWithBucket"
            type="number"
            label="老汤+桶重量"
            placeholder="请输入重量"
            :rules="oldSoupRules"
          >
            <template #button>
              <span class="unit-text">kg</span>
            </template>
          </van-field>
          
          <van-field
            v-model="goodsWithFrame"
            name="goodsWithFrame"
            type="number"
            label="货+框重量"
            placeholder="请输入重量"
            :rules="goodsRules"
          >
            <template #button>
              <span class="unit-text">kg</span>
            </template>
          </van-field>
          
          <van-field
            v-model="potNumber"
            name="potNumber"
            type="digit"
            label="第几锅"
            placeholder="请输入锅数（可选）"
            :rules="potRules"
          >
            <template #button>
              <span class="unit-text">锅</span>
            </template>
          </van-field>
        </van-cell-group>
      </van-form>

      <div class="button-group">
        <van-button type="primary" size="large" block @click="handleCalculate">
          开始计算
        </van-button>
        <van-button type="default" size="large" @click="handleReset" style="margin-top: 10px;">
            重置数据
          </van-button>
      </div>

      <div v-if="waterNeeded" class="results-section">
        <van-tabs v-model:active="activeTab" sticky offset-top="46px">
          <van-tab title="💧 补水量">
            <div class="tab-content">
              <van-grid :column-num="2" :border="false" class="info-grid">
                <van-grid-item>
                  <div class="grid-card">
                    <div class="card-label">老汤重量</div>
                    <div class="card-value">{{ waterNeeded.oldSoupWeightInJin }}</div>
                    <div class="card-unit">斤</div>
                  </div>
                </van-grid-item>
                <van-grid-item>
                  <div class="grid-card">
                    <div class="card-label">货物净重</div>
                    <div class="card-value">{{ waterNeeded.goodsWeight }}</div>
                    <div class="card-unit">kg</div>
                  </div>
                </van-grid-item>
                <van-grid-item>
                  <div class="grid-card">
                    <div class="card-label">消耗水</div>
                    <div class="card-value">{{ waterNeeded.consumedWater }}</div>
                    <div class="card-unit">kg</div>
                  </div>
                </van-grid-item>
                <van-grid-item>
                  <div class="grid-card">
                    <div class="card-label">补水量</div>
                    <div class="card-value">{{ waterNeeded.waterToAdd }}</div>
                    <div class="card-unit">kg</div>
                  </div>
                </van-grid-item>
              </van-grid>

              <van-notice-bar
                left-icon="volume-o"
                :scrollable="false"
                class="result-notice"
              >
                <template #default>
                  <div class="notice-content">
                    <span>理论补水到：</span>
                    <strong class="highlight-value">{{ waterNeeded.totalWater }} kg</strong>
                  </div>
                </template>
              </van-notice-bar>

              <van-notice-bar
                left-icon="info-o"
                :scrollable="false"
                wrapable
                class="result-notice success"
                color="#07c160"
                background="#f0f9ff"
              >
                <template #default>
                  <div class="notice-content">
                    <span>💧实际补水到（含缓冲）：</span>
                    <strong class="highlight-value" style="color: #07c160;">{{ waterNeeded.totalWaterWithBuffer }} kg</strong>
                  </div>
                </template>
              </van-notice-bar>

              <van-cell-group inset style="margin-top: 12px; margin-bottom: 16px;">
                <van-cell title="💡 缓冲说明" :border="false">
                  <template #label>
                    <div style="font-size: 12px; color: #969799; line-height: 1.6; margin-top: 4px;">
                      补水量已增加{{ waterNeeded.waterBuffer }}kg缓冲，用于撇浮沫和拌素菜使用
                    </div>
                  </template>
                </van-cell>
              </van-cell-group>

              <van-collapse v-model="activeNames" accordion style="margin-top: 16px;">
                <van-collapse-item title="📝 查看计算步骤" name="1">
                  <van-steps direction="vertical" :active="5">
                    <van-step>
                      <h4>计算老汤重量</h4>
                      <p>{{ oldSoupWithBucket }} - {{ BUCKET_WEIGHT }} = <strong>{{ (Number(oldSoupWithBucket) - BUCKET_WEIGHT).toFixed(2) }} kg</strong></p>
                    </van-step>
                    <van-step>
                      <h4>计算货物净重</h4>
                      <p>{{ goodsWithFrame }} - {{ FRAME_WEIGHT }} = <strong>{{ waterNeeded.goodsWeight }} kg</strong></p>
                      <p class="step-note">转换为斤：{{ waterNeeded.goodsWeight }} × 2 = {{ waterNeeded.goodsWeightInJin }} 斤</p>
                    </van-step>
                    <van-step>
                      <h4>计算消耗水</h4>
                      <p>{{ waterNeeded.goodsWeightInJin }} × 20% = {{ waterNeeded.consumedWaterBeforeConversion }} 斤</p>
                      <p class="step-note">转换为kg：{{ waterNeeded.consumedWaterBeforeConversion }} ÷ 2 = <strong>{{ waterNeeded.consumedWater }} kg</strong></p>
                    </van-step>
                    <van-step>
                      <h4>计算补水量</h4>
                      <p>(25 - {{ waterNeeded.oldSoupWeightInJin }}) ÷ 2 = <strong>{{ waterNeeded.waterToAdd }} kg</strong></p>
                    </van-step>
                    <van-step>
                      <h4>计算总水量</h4>
                      <p>{{ waterNeeded.consumedWater }} + {{ waterNeeded.waterToAdd }} + {{ oldSoupWithBucket }} = <strong class="final-result">{{ waterNeeded.totalWater }} kg</strong></p>
                    </van-step>
                  </van-steps>
                </van-collapse-item>
              </van-collapse>
            </div>
          </van-tab>

          <van-tab title="🥘 卤货材料">
            <div class="tab-content">
              <van-grid :column-num="3" :border="false" class="info-grid">
                <van-grid-item>
                  <div class="grid-card">
                    <div class="card-label">消耗水</div>
                    <div class="card-value">{{ waterNeeded.consumedWaterInJin }}</div>
                    <div class="card-unit">斤</div>
                  </div>
                </van-grid-item>
                <van-grid-item>
                  <div class="grid-card">
                    <div class="card-label">补水量</div>
                    <div class="card-value">{{ waterNeeded.waterToAddInJin }}</div>
                    <div class="card-unit">斤</div>
                  </div>
                </van-grid-item>
                <van-grid-item>
                  <div class="grid-card">
                    <div class="card-label">货物净重</div>
                    <div class="card-value">{{ waterNeeded.goodsWeightInJin }}</div>
                    <div class="card-unit">斤</div>
                  </div>
                </van-grid-item>
              </van-grid>

              <van-notice-bar
                left-icon="fire-o"
                :scrollable="false"
                class="result-notice warning"
              >
                <template #default>
                  <div class="notice-content">
                    <span>卤货材料总重：</span>
                    <strong class="highlight-value">{{ waterNeeded.materialTotal }} 斤</strong>
                  </div>
                </template>
              </van-notice-bar>

              <van-collapse v-model="activeNames2" accordion>
                <van-collapse-item title="📝 查看计算步骤" name="1">
                  <van-steps direction="vertical" :active="4">
                    <van-step>
                      <h4>消耗水转换为斤</h4>
                      <p>{{ waterNeeded.consumedWater }} × 2 = <strong>{{ waterNeeded.consumedWaterInJin }} 斤</strong></p>
                    </van-step>
                    <van-step>
                      <h4>补水量转换为斤</h4>
                      <p>{{ waterNeeded.waterToAdd }} × 2 = <strong>{{ waterNeeded.waterToAddInJin }} 斤</strong></p>
                    </van-step>
                    <van-step>
                      <h4>货物净重（已为斤）</h4>
                      <p><strong>{{ waterNeeded.goodsWeightInJin }} 斤</strong></p>
                    </van-step>
                    <van-step>
                      <h4>计算材料总重</h4>
                      <p>{{ waterNeeded.consumedWaterInJin }} + {{ waterNeeded.waterToAddInJin }} + {{ waterNeeded.goodsWeightInJin }} = <strong class="final-result">{{ waterNeeded.materialTotal }} 斤</strong></p>
                    </van-step>
                  </van-steps>
                </van-collapse-item>
              </van-collapse>
            </div>
          </van-tab>

          <van-tab title="🌶️ 调料用量">
            <div class="tab-content">
              <div v-if="seasoningAmounts">
                <van-tag type="primary" size="large" class="pot-tag">
                  第 {{ seasoningAmounts.potNumber }} 锅
                </van-tag>

                <van-divider>🌶️ 变化调料</van-divider>
                
                <van-cell-group inset>
                  <van-cell title="辣椒理论用量" :value="`${seasoningAmounts.chili} g`" icon="fire-o" />
                  <van-cell 
                    title="辣椒实际用量" 
                    :value="`${seasoningAmounts.chiliWithBuffer} g`" 
                    icon="fire-o"
                    label="已含100g缓冲"
                  />
                  <van-cell title="花椒用量" :value="`${seasoningAmounts.pepper} g`" icon="fire-o" />
                </van-cell-group>

                <van-divider>🧂 固定调料（每锅均为）</van-divider>
                
                <van-cell-group inset>
                  <van-cell title="盐用量" :value="`${seasoningAmounts.salt} g`" />
                  <van-cell title="味精用量" :value="`${seasoningAmounts.msg} g`" />
                  <van-cell title="鸡精用量" :value="`${seasoningAmounts.chicken} g`" />
                  <van-cell title="砂糖用量" :value="`${seasoningAmounts.sugar} g`" />
                  <van-cell title="麦芽糖用量" :value="`${seasoningAmounts.maltose} g`" />
                </van-cell-group>

                <van-notice-bar
                  left-icon="info-o"
                  :scrollable="false"
                  wrapable
                  class="info-notice"
                >
                  <strong>📌 注意：</strong>以上为每锅用量。三锅一循环，往复如此。辣椒和花椒每锅用量不同，其他调料每锅均为固定用量。
                </van-notice-bar>

                <van-collapse v-model="activeNames3" accordion>
                  <van-collapse-item title="📝 查看计算说明" name="1">
                    <div class="seasoning-formula">
                      <h4>基础数据</h4>
                      <p>卤货材料总重 = <strong>{{ waterNeeded.materialTotal }} 斤</strong></p>
                      
                      <h4>辣椒用量（第{{ seasoningAmounts.potNumber }}锅）</h4>
                      <p v-if="seasoningAmounts.potNumber === 1">{{ waterNeeded.materialTotal }} × 6 = <strong>{{ seasoningAmounts.chili }} g</strong></p>
                      <p v-else-if="seasoningAmounts.potNumber === 2">{{ waterNeeded.materialTotal }} × 5 = <strong>{{ seasoningAmounts.chili }} g</strong></p>
                      <p v-else-if="seasoningAmounts.potNumber === 3">{{ waterNeeded.materialTotal }} × 3 = <strong>{{ seasoningAmounts.chili }} g</strong></p>
                      <p v-else>{{ waterNeeded.materialTotal }} × 6 = <strong>{{ seasoningAmounts.chili }} g</strong></p>
                      
                      <h4>花椒用量（第{{ seasoningAmounts.potNumber }}锅）</h4>
                      <p v-if="seasoningAmounts.potNumber === 1">{{ waterNeeded.materialTotal }} × 2.5 = <strong>{{ seasoningAmounts.pepper }} g</strong></p>
                      <p v-else-if="seasoningAmounts.potNumber === 2">{{ waterNeeded.materialTotal }} × 2 = <strong>{{ seasoningAmounts.pepper }} g</strong></p>
                      <p v-else-if="seasoningAmounts.potNumber === 3">{{ waterNeeded.materialTotal }} × 1 = <strong>{{ seasoningAmounts.pepper }} g</strong></p>
                      <p v-else>{{ waterNeeded.materialTotal }} × 2.5 = <strong>{{ seasoningAmounts.pepper }} g</strong></p>
                      
                      <h4>其他调料（每锅固定）</h4>
                      <p>盐 = {{ waterNeeded.materialTotal }} × 4 = {{ seasoningAmounts.salt }} g</p>
                      <p>味精 = {{ waterNeeded.materialTotal }} × 5.5 = {{ seasoningAmounts.msg }} g</p>
                      <p>鸡精 = {{ waterNeeded.materialTotal }} × 7 = {{ seasoningAmounts.chicken }} g</p>
                      <p>砂糖 = {{ waterNeeded.materialTotal }} × 42 = {{ seasoningAmounts.sugar }} g</p>
                      <p>麦芽糖 = {{ waterNeeded.materialTotal }} × 8 = {{ seasoningAmounts.maltose }} g</p>
                    </div>
                  </van-collapse-item>
                </van-collapse>
              </div>
              <van-empty v-else description="请先输入第几锅" />
            </div>
          </van-tab>
        </van-tabs>
      </div>

      <van-empty v-else description="请输入数据开始计算" />
    </div>
  </div>
</template>

<style scoped>
.mobile-calculator {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 20px;
}

.content-wrapper {
  padding: 16px;
}

.input-group {
  margin-bottom: 16px;
}

.unit-text {
  color: #969799;
  font-size: 14px;
  padding: 0 8px;
}

.button-group {
  margin: 16px 0;
}

.reset-button-wrapper {
  text-align: right;
  padding: 8px 16px 0;
}

.results-section {
  margin-top: 16px;
}

.tab-content {
  padding: 16px;
  background: #f7f8fa;
}

.info-grid {
  margin-bottom: 16px;
}

.grid-card {
  padding: 8px 4px;
  text-align: center;
}

.card-label {
  font-size: 11px;
  color: #969799;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #323233;
  margin-bottom: 4px;
}

.card-unit {
  font-size: 12px;
  color: #969799;
}

.result-notice {
  margin: 16px 0;
  border-radius: 8px;
}

.result-notice.warning {
  background: #fff7e6;
  color: #ed6a0c;
}

.notice-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 15px;
}

.highlight-value {
  font-size: 18px;
  font-weight: bold;
  color: #07c160;
}

.result-notice.warning .highlight-value {
  color: #ed6a0c;
}

.pot-tag {
  display: block;
  text-align: center;
  margin: 16px auto;
  padding: 8px 20px;
  font-size: 16px;
}

.info-notice {
  margin: 16px 0;
  background: #ecf9ff;
  color: #1989fa;
}

.step-note {
  font-size: 12px;
  color: #969799;
  margin-top: 4px;
  padding-left: 8px;
  border-left: 2px solid #ebedf0;
}

.final-result {
  color: #07c160;
  font-size: 16px;
}

.seasoning-formula {
  padding: 12px;
}

.seasoning-formula h4 {
  margin: 16px 0 8px 0;
  font-size: 14px;
  color: #323233;
}

.seasoning-formula p {
  margin: 6px 0;
  font-size: 13px;
  color: #646566;
  line-height: 1.6;
}

:deep(.van-step__title) {
  font-size: 14px;
  font-weight: 500;
}

:deep(.van-step__line) {
  background: #ebedf0;
}

:deep(.van-collapse-item__content) {
  padding: 12px 16px;
  background: #fff;
}

:deep(.van-cell-group--inset) {
  margin: 16px 0;
}

:deep(.van-cell) {
  font-size: 14px;
}

:deep(.van-cell__value) {
  font-weight: 500;
  color: #323233;
}
</style>
