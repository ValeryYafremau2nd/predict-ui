<template>
  <div class="builder">
    <div class="odd-name">
      Event name: <InputText type="text" v-model="oddName" />
      <Button
        class="save-Button"
        @click="saveOdd($event, lines)"
        size="small"
        iconPos="right"
        icon="pi pi-envelope"
        label="Save"
      ></Button>
      <Button
        class="save-Button"
        @click="cancel()"
        iconPos="right"
        label="Cancel"
        icon="pi pi-delete-left"
        size="small"
        severity="contrast"
      ></Button>
    </div>
    <div class="builder-container">
      <EventBuilderLine
        v-bind:key="line.index"
        v-for="line in lines"
        :stats="stats"
        :types="types"
        :operators="operators"
        :preffixes="preffixes"
        :index="i"
        :line="line"
        :removeMethod="() => removeLine(line.index)"
        @line-changed="onChange"
        v-model="lineData"
      ></EventBuilderLine>
      <Button
        class="new-line-Button"
        icon="pi pi-plus"
        iconPos="right"
        label="Add new line"
        @click="addLine($event)"
      ></Button>
    </div>
  </div>
</template>

<style scoped>
.new-line-Button {
  float: center;
}
.builder {
  width: 100%;
}
.builder-container {
  text-align: center;
}
.odd-name {
  text-align: left;
  font-size: 20px;
  padding: 20px;
  margin-bottom: 10px;
  color: var(--text-color-contrast);
  border-bottom: solid 2px lightslategrey;
}
.save-Button {
  float: right;
  margin-left: 10px;
}
</style>

<script>
import { getUserId } from '@/services/user.service'
import { createUpdateEvent, getEvent, getEventOperations } from '@/services/api.service'
import EventBuilderLine from '../../components/events/EventBuilderLine.vue'
import { EVENT_LINE, EVENT_LINE_ADDITIONAL } from '../../constants/event.constants.js'

export default {
  components: { EventBuilderLine },
  data() {
    return {
      lineId: 0,
      oddName: '',
      stats: [],
      types: [],
      operators: [],
      preffixes: [],
      lines: [],
      savedLines: [],
      id: null
    }
  },
  methods: {
    cancel() {
      if (!window.confirm('Do you want to cancel all changes?')) return
      this.$router.push('/events')
    },
    onChange(data) {
      this.lines[data.index] = { ...data }
    },
    addLine() {
      this.lines.push({
        index: this.lines[this.lines.length - 1].index + 1,
        ...EVENT_LINE
      })
    },
    setLines(lines) {
      this.lines = lines
    },
    setName(name) {
      this.oddName = name
    },
    setId(id) {
      this.id = id
    },
    setMode(mode) {
      if (mode == 'create') {
        this.mode = 'create'
      } else {
        this.mode = 'edit'
      }
    },
    async saveOdd(ev, lines) {
      await createUpdateEvent(this.id, this.oddName, lines, getUserId())
      this.$router.push('/events')
    },
    getLine(index, type, value, preffix, operator, stat) {
      line = { type }
      if (index != 0) line.operator = operator
      if (type == 'value') {
        line.value = value
      } else if (type == 'stat') {
        line.preffix = preffix
        line.stat = stat
      }
      return line
    },
    removeLine(index) {
      this.lines = this.lines.filter((line) => line.index != index)
    },
    setBuilderParams(params) {
      this.stats = params.stats
      this.types = params.types
      this.operators = params.operators
      this.preffixes = params.preffixes
    },
    setEditMode(lines, params) {
      this.setBuilderParams(params)
      this.setName(lines.name)
      this.setLines(lines.lines)
      this.setMode(lines.mode)
      this.setId(lines._id)
    }
  },
  async beforeRouteEnter(to, from, next) {
    let customOdd = {
      data: {
        lines: [
          {
            index: 0,
            ...EVENT_LINE
          },
          {
            index: 1,
            ...EVENT_LINE_ADDITIONAL
          }
        ],
        name: '',
        mode: 'create',
        _id: null
      }
    }
    if (to.params.id) {
      customOdd = await getEvent(to.params.id)
    }
    const data = await getEventOperations()
    next((vm) => vm.setEditMode(customOdd.data, data))
  }
}
</script>
