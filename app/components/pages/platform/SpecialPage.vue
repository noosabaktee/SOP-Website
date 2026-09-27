<script setup lang="ts">
import type { PageConfig } from '~/types/platform'
const props = defineProps<{ page: PageConfig; routePath: string }>()
const { showToast } = useToast()
</script>
<template>
  <ActivitiesPage v-if="page.type === 'calendar-list'" :page="page" :route-path="routePath" />
  <KanbanPage v-else-if="page.type === 'kanban'" :page="page" :route-path="routePath" />
  <AgingPage v-else-if="page.type === 'aging'" :page="page" :route-path="routePath" />
  <DocumentEditorPage v-else-if="page.type === 'document-editor'" :page="page" :route-path="routePath" />
  <ProjectDashboardPage v-else-if="page.type === 'project-dashboard'" :page="page" />
  <PlanningPage v-else-if="page.type === 'planning'" :page="page" :route-path="routePath" />
  <GanttPage v-else-if="page.type === 'gantt'" :page="page" :route-path="routePath" />
  <ProgressPage v-else-if="page.type === 'progress'" :page="page" :route-path="routePath" />
  <ProfitabilityPage v-else-if="page.type === 'profitability'" :page="page" :route-path="routePath" />
  <ReportPage v-else-if="page.type === 'report'" :page="page" :route-path="routePath" />
  <StatementPage v-else-if="page.type === 'statement'" :page="page" :route-path="routePath" />
  <JournalPage v-else-if="page.type === 'journal'" :page="page" :route-path="routePath" />
  <GridPage v-else-if="page.type === 'closing'" :page="page" :route-path="routePath" />
  <CompanyFormPage v-else-if="page.type === 'company-form'" :page="page" :route-path="routePath" />
  <MeetingFormPage v-else-if="page.type === 'meeting-form'" :page="page" :route-path="routePath" />
  <UsersMatrixPage v-else-if="page.type === 'users-matrix'" :page="page" :route-path="routePath" />
  <WorkflowPage v-else-if="page.type === 'workflow'" :page="page" :route-path="routePath" />
  <SettingsPage v-else-if="['integrations','notifications','backup','parameters'].includes(page.type)" :page="page" />
  <GridPage v-else-if="page.type === 'documents'" :page="page" :route-path="routePath" />
  <section v-else>
    <PageActions primary-label="Save" :hide-import="true" @create="showToast(`${page.title} saved.`)" />
    <section class="platform-card settings-form"><label class="platform-field"><span>Title</span><input :value="page.title"></label><label class="platform-field full"><span>Description</span><textarea rows="5" :value="page.description"/></label></section>
  </section>
</template>
