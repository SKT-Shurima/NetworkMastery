<template>
  <div class="wide-table-container" :class="{ 'dark-mode': isDark }">
    <div v-if="title" class="table-title">{{ title }}</div>
    <div class="table-wrapper">
      <table class="wide-table">
        <thead v-if="headers.length > 0">
          <tr>
            <th v-for="(header, index) in headers" :key="index" :style="getColumnStyle(index)">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in rows" :key="rowIndex" class="table-row">
            <td v-for="(cell, cellIndex) in row" :key="cellIndex" :style="getColumnStyle(cellIndex)">
              <span v-html="cell"></span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="caption" class="table-caption">{{ caption }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

interface Props {
  title?: string
  caption?: string
  headers?: string[]
  rows: string[][]
  columnWidths?: string[]
  striped?: boolean
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  headers: () => [],
  striped: true,
  hover: true,
  columnWidths: () => []
})

const { isDark } = useData()

const getColumnStyle = (index: number) => {
  if (props.columnWidths && props.columnWidths[index]) {
    return { width: props.columnWidths[index] }
  }
  return {}
}
</script>

<style scoped>
.wide-table-container {
  margin: 2rem 0;
  width: 100%;
  max-width: none;
  overflow: visible;
}

.table-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
  text-align: center;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.dark-mode .table-wrapper {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  background: var(--vp-c-bg-alt);
}

.wide-table {
  width: 100%;
  min-width: 100%;
  border-collapse: collapse;
  table-layout: auto;
  font-size: 0.95rem;
  line-height: 1.6;
}

.wide-table thead th {
  background: linear-gradient(135deg, var(--vp-c-brand), var(--vp-c-brand-light));
  color: white;
  font-weight: 600;
  padding: 1rem 1.25rem;
  text-align: left;
  border: none;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
}

.wide-table thead th:first-child {
  border-top-left-radius: 12px;
}

.wide-table thead th:last-child {
  border-top-right-radius: 12px;
}

.wide-table tbody td {
  padding: 1rem 1.25rem;
  border: none;
  color: var(--vp-c-text-1);
  vertical-align: middle;
  transition: all 0.2s ease;
  position: relative;
}

.wide-table tbody tr {
  border-bottom: 1px solid var(--vp-c-divider-light);
  transition: all 0.2s ease;
}

.wide-table tbody tr:last-child {
  border-bottom: none;
}

.wide-table tbody tr:last-child td:first-child {
  border-bottom-left-radius: 12px;
}

.wide-table tbody tr:last-child td:last-child {
  border-bottom-right-radius: 12px;
}

/* Striped rows */
.wide-table tbody tr:nth-child(even) {
  background-color: var(--vp-c-bg-soft);
}

/* Hover effect */
.wide-table tbody tr:hover {
  background-color: var(--vp-c-brand-light);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.wide-table tbody tr:hover td {
  color: white;
}

/* Dark mode adjustments */
.dark-mode .wide-table thead th {
  background: linear-gradient(135deg, var(--vp-c-brand-dark), var(--vp-c-brand));
}

.dark-mode .wide-table tbody tr:nth-child(even) {
  background-color: var(--vp-c-bg-elv);
}

.dark-mode .wide-table tbody tr:hover {
  background-color: var(--vp-c-brand-darker);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.table-caption {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  text-align: center;
  font-style: italic;
}

/* Responsive design */
@media (max-width: 768px) {
  .wide-table-container {
    margin: 1rem -1rem;
  }
  
  .table-wrapper {
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
  
  .wide-table {
    font-size: 0.875rem;
  }
  
  .wide-table thead th,
  .wide-table tbody td {
    padding: 0.75rem 1rem;
  }
  
  .wide-table thead th {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .wide-table thead th,
  .wide-table tbody td {
    padding: 0.5rem 0.75rem;
  }
  
  .wide-table {
    font-size: 0.8rem;
  }
  
  .table-title {
    font-size: 1.25rem;
  }
}

/* Custom scrollbar for table wrapper */
.table-wrapper::-webkit-scrollbar {
  height: 6px;
}

.table-wrapper::-webkit-scrollbar-track {
  background: var(--vp-c-bg-soft);
  border-radius: 3px;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: var(--vp-c-brand);
  border-radius: 3px;
}

.table-wrapper::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-brand-dark);
}

/* Animation for table appearance */
@keyframes tableSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.wide-table-container {
  animation: tableSlideIn 0.6s ease-out;
}

/* Special styling for code in cells */
.wide-table :deep(code) {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.85em;
}

.dark-mode .wide-table :deep(code) {
  background: rgba(0, 0, 0, 0.3);
}

/* Links in tables */
.wide-table :deep(a) {
  color: inherit;
  text-decoration: underline;
  text-decoration-color: rgba(255, 255, 255, 0.5);
}

.wide-table :deep(a:hover) {
  text-decoration-color: white;
}
</style>