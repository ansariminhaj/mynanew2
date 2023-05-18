from django.urls import path
from .views import *

urlpatterns = [
	path('user_info', UserInfoView.as_view()),
	path('login', LoginView.as_view()),
	path('signup/', SignupView.as_view()),
	path('profile', ProfileView.as_view()),
	path('profile_update', ProfileUpdateView.as_view()),
	path('edit_profile', EditProfileView.as_view()),
	path('province_list=<country>', ProvinceListView.as_view()),
	path('city_list=<province>', CityListView.as_view()),
	path('get_all_user_info', GetAllUserInfoView.as_view()),
	path('set_payment_status', SetPaymentStatusView.as_view()),
	

	path('python_login', PythonLoginView.as_view()),
	path('get_projects', GetProjectsView.as_view()),
	path('get_runs', GetRunsView.as_view()),
	path('create_project', CreateProjectView.as_view()),
	path('create_run', CreateRunView.as_view()),
	path('get_nodes', GetNodesView.as_view()),
	path('create_node', CreateNodeView.as_view()),
	path('send_code', SendCodeView.as_view()),
	path('update_node_info', UpdateNodeView.as_view()),
	path('submit_feedback', SetFeedbackView.as_view()),
	path('get_admin_metrics', AdminPanelMetricsView.as_view()),
	path('get_admin_feedback', AdminPanelFeedbackView.as_view()),
	path('run_update', RunUpdateView.as_view()),
	path('run_delete', RunDeleteView.as_view()),
	path('node_delete', NodeDeleteView.as_view()),
	path('project_delete', ProjectDeleteView.as_view()),
	path('project_update', ProjectUpdateView.as_view()),
	path('project_share', ProjectShareView.as_view()),
	path('add_metadata', AddMetadataView.as_view()),
	path('add_results', AddResultsView.as_view()),
	path('add_datasets', AddDatasetsView.as_view()),
	path('add_csv', AddCsvView.as_view()),
	path('toggle_enable', ToggleEnableView.as_view())
]