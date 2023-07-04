from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.views import APIView
from myapp.models import *
from .serializers import myUserSerializer, myUserSerializerUpdate
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import random, string, os, jwt, operator
from datetime import datetime
from itertools import chain
from django.db.models import F
import copy, ast
from decimal import Decimal
import socket
from django.core.files.storage import default_storage
import collections, json, time
from collections.abc import Mapping

import requests

OK = "OK"
ERROR = "ERROR"
PENDING = "PENDING"
IP = '127.0.0.1:8000'

def querydict_to_dict(query_dict): #since using QueryDict.dict() returns only one element in list
    data = {}
    for key in query_dict.keys():
        v = query_dict.getlist(key)
        if len(v) == 1:
            v = v[0]
        data[key] = v
    return data


class UpdateNodeView(APIView):

	def post(self, request):

		data = request.data 
		node_id = data['node_id']
		node_description = data['node_description']


		node_obj = Node.objects.get(id = int(node_id))
		node_obj.description = node_description
		if 'node_summary' in data:
			node_obj.summary = data['node_summary']
		node_obj.save()

		return Response(OK)


class DuplicateRunView(APIView):

	def post(self, request):

		data = request.data 
		run_id = data['run_id']

		run_obj = Run.objects.get(id = run_id)

		images = run_obj.images_set.all()
		nodes = run_obj.node_set.all()
		files = run_obj.files_set.all()
		metadatas = run_obj.metadata_set.all()

		run_obj_new = Run.objects.create(project = run_obj.project, run_name = run_obj.run_name)

		for image in images:
		    image.pk = None
		    image.run = run_obj_new
		    image.save()

		for node in nodes:
		    node.pk = None
		    node.run = run_obj_new
		    node.save()

		for file in files:
			file.pk = None 
			file.run = run_obj_new
			file.save()

		for metadata in metadatas:
			metadata.pk = None 
			metadata.run = run_obj_new
			metadata.save()


		return Response(OK)


class UserInfoView(APIView):

	def post(self, request):
		print(request)

		# if request.user.payment_status == 0:
		# 	return Response(0)
		query_dict={'id': request.user.id, 'user_type': request.user.user_type,'name': request.user.name}

		return Response(query_dict)

class LoginView(APIView):

	def post(self, request):
		print("LOGIN")
		print(request.data)
		data = request.data
		URL = 'http://'+IP+'/api/token/'
		data={'username': data['username'], 'password': data['password']}
		tokens = requests.post(url = URL, data = data)
		token_data = tokens.json()

		if 'access' not in token_data:
			return Response(ERROR)

		Headers = { 'Authorization' : 'JWT ' + token_data['access'] }

		user_info = requests.post('http://'+IP+'/api/user_info', headers=Headers)
		user_info_data = user_info.json()

		if user_info_data == 0:
			return Response(PENDING)

		token_data.update(user_info_data)

		return Response(token_data)


class SignupView(APIView):
	serializer_class = myUserSerializer
	
	def post(self, request):
		data=request.data
		data._mutable = True

		key = str(int(time.time())) + ''.join(random.choices(string.ascii_uppercase + string.ascii_lowercase, k=10))

		usr_obj = myUser.objects.create_user(username = data['username'], password =  data['password'], email = data['email'], key = key)

		return Response(OK)


class PythonLoginView(APIView):

	def post(self, request):
		data = request.data.dict()
		if myUser.objects.filter(username = data['username'], key = data['key']).exists():
			return Response(1)

		return Response(0)


class CreateProjectView(APIView):

	def post(self, request):
		data=request.data
		project_obj_new = Project.objects.create(name=data["project_name"])
		ProjectUser.objects.create(user = request.user, project = project_obj_new)

		return Response(OK)

class CreateNodeView(APIView):

	def post(self, request):
		print(request.data)

		data = request.data

		user_obj = request.user

		if not Run.objects.filter(id=int(data["run_id"])).exists():
			return Response(-2)
		run_obj = Run.objects.get(id=int(data["run_id"]))

		if int(data['node_type']) == 0:
			node_obj = Node.objects.create(run = run_obj, description='Click to Edit', node_type = 0, dataset_node = 1)
		elif int(data['node_type']) == 1:
			node_obj = Node.objects.create(run = run_obj, description='Click to Edit', node_type = 0)
		elif int(data['node_type']) == 2:
			node_obj = Node.objects.create(run = run_obj, description='Click to Edit', node_type = 1)
		elif int(data['node_type']) == 3:
			node_obj = Node.objects.create(run = run_obj, description='Click to Edit', node_type = 2)
		elif int(data['node_type']) == 5:
			node_obj = Node.objects.create(run = run_obj, description='Click to Edit', node_type = 5)
		else:
			pass
				
		return Response(node_obj.id)


class NodeDeleteView(CreateAPIView):

	def post(self, request):
		data = request.data
		node_id = int(data['node_id'])

		node_obj = Node.objects.get(id = node_id)
		node_obj.delete()

		return Response(OK)


class CreateRunView(APIView):

	def initial_nodes(self, user_obj, run_obj):
		objective_node = Node.objects.create(run = run_obj, name="Objective", description = "", node_type = 5)
		data_node = Node.objects.create(run = run_obj, name="Datasets", description = "", node_type = 0, dataset_node = 1)
		csv_node = Node.objects.create(run = run_obj, name="CSV", description = "", node_type = 0, csv_node=1)
		hyperparameter_node = Node.objects.create(run = run_obj, name="Variables", description = "", node_type = 0)
	
		method1_node = Node.objects.create(run = run_obj, name="Method", description = "Method", node_type = 1)

		results_node = Node.objects.create(run = run_obj, name="Results", description = "", node_type = 2)
		
		return

	def post(self, request):
		data=request.data

		project_obj = Project.objects.get(id = data['project_id'])
		run_obj_new = Run.objects.create(project = project_obj, run_name=data["run_name"])
		self.initial_nodes(request.user, run_obj_new)

		return Response(OK)



class AddMetadataView(APIView):

	def post(self, request):
		data = querydict_to_dict(request.data)

		if not myUser.objects.filter(username = data['username'], key = data['key']).exists():
			return Response(0)

		user_obj = myUser.objects.get(username = data['username'], key = data['key'])

		if Run.objects.filter(id=int(data["run_id"])).exists():
			run_obj = Run.objects.get(id=int(data["run_id"]))
			if Metadata.objects.filter(run = run_obj).exists():
				metadata_obj = Metadata.objects.get(run = run_obj)
				metadata_obj.installed_packages = data['installed_packages']
				metadata_obj.system_information = data['system_information']
				metadata_obj.save()
			else:
				metadata_obj = Metadata.objects.create(run = run_obj, installed_packages = data['installed_packages'], system_information = data['system_information'] )

		else:
			return Response(0)

		return Response(OK)


class AddResultsView(APIView):

	def post(self, request):
		data = querydict_to_dict(request.data)

		if not myUser.objects.filter(username = data['username'], key = data['key']).exists():
			return Response(0)

		user_obj = myUser.objects.get(username = data['username'], key = data['key'])

		if Run.objects.filter(id=int(data["run_id"])).exists():
			run_obj = Run.objects.get(id=int(data["run_id"]))

			if Node.objects.filter(run = run_obj, name = data["node_name"]).exists():
				node_obj = Node.objects.get(run = run_obj, name = data["node_name"])
			else:
				node_obj = Node.objects.create(run = run_obj, name=data["node_name"], description = "", node_type = 2)

			description = node_obj.description 
			print(description)

			if isinstance(ast.literal_eval(data['results_dict']), Mapping):
				if len(description) == 0:
					description = ast.literal_eval(data['results_dict'])	
				else:
					description = ast.literal_eval(description)
					description.update(ast.literal_eval(data['results_dict']))


				print(description)
				node_obj.description = description
				node_obj.save()	
			else:
				Response(ERROR)

		return Response(OK)


class AddDatasetView(APIView):

	def post(self, request):
		data = querydict_to_dict(request.data)

		if not myUser.objects.filter(username = data['username'], key = data['key']).exists():
			return Response(0)

		user_obj = myUser.objects.get(username = data['username'], key = data['key'])

		if Run.objects.filter(id=int(data["run_id"])).exists():
			run_obj = Run.objects.get(id=int(data["run_id"]))

			if Node.objects.filter(run = run_obj, name = data["node_name"]).exists():
				node_obj = Node.objects.get(run = run_obj, name = data["node_name"])
			else:
				node_obj = Node.objects.create(run = run_obj, description="", name=data["node_name"], node_type = 0, dataset_node = 1)


			description = node_obj.description 

			if isinstance(ast.literal_eval(data['dataset_dict']), Mapping):
				if len(description) == 0:
					description = ast.literal_eval(data['dataset_dict'])	
				else:
					description = ast.literal_eval(description)
					description.update(ast.literal_eval(data['dataset_dict']))

				node_obj.description = description
				node_obj.save()	
			else:
				Response(ERROR)



		return Response(OK)



class AddKeyValueView(APIView):

	def post(self, request):
		data = querydict_to_dict(request.data)

		if Node.objects.filter(id = data["node_id"]).exists():
			node_obj = Node.objects.get(id = data["node_id"])
		else:
			Response(ERROR)


		description = node_obj.description 

		if isinstance({data['key']:data['value']}, Mapping):
			if len(description) == 0:
				description = {data['key']:data['value']}	
			else:
				description = ast.literal_eval(description)
				description.update({data['key']:data['value']})

			node_obj.description = description
			node_obj.save()	
		else:
			Response(ERROR)

		return Response(OK)


class AddCsvView(APIView):

	def post(self, request):
		data = querydict_to_dict(request.data)
		csv = {'columns list': data['columns_list'], 'isnull list': data['isnull_list'], 'isunique list': data['isunique_list'], 'dtypes list': data['dtypes_list'], 'size': data['size'], 'shape': data['shape']}


		if not myUser.objects.filter(username = data['username'], key = data['key']).exists():
			return Response(0)

		user_obj = myUser.objects.get(username = data['username'], key = data['key'])

		if Run.objects.filter(id=int(data["run_id"])).exists():
			run_obj = Run.objects.get(id=int(data["run_id"]))
			if Node.objects.filter(run = run_obj, name = data["node_name"]).exists():
				node_obj = Node.objects.get(run = run_obj, name = data["node_name"])
				node_obj.description = str(csv)
				node_obj.save()
			else:
				node_obj = Node.objects.create(run = run_obj, name=data["node_name"], description = str(csv), node_type = 0, csv_node = 1)

		return Response(OK)


class AddVariablesView(APIView):

	def post(self, request):
		data = querydict_to_dict(request.data)

		if not myUser.objects.filter(username = data['username'], key = data['key']).exists():
			return Response(0)

		user_obj = myUser.objects.get(username = data['username'], key = data['key'])

		if Run.objects.filter(id=int(data["run_id"])).exists():
			run_obj = Run.objects.get(id=int(data["run_id"]))

			if Node.objects.filter(run = run_obj, name = data["node_name"]).exists():
				node_obj = Node.objects.get(run = run_obj, name = data["node_name"])
			else:
				node_obj = Node.objects.create(run = run_obj, description="", name=data["node_name"], node_type = 0)


			description = node_obj.description 

			if isinstance(ast.literal_eval(data['variables_dict']), Mapping):
				if len(description) == 0:
					description = ast.literal_eval(data['variables_dict'])	
				else:
					description = ast.literal_eval(description)
					description.update(ast.literal_eval(data['variables_dict']))

				node_obj.description = description
				node_obj.save()	
			else:
				Response(ERROR)


class ToggleEnableView(CreateAPIView):

	def post(self, request):
		data = request.data

		if Project.objects.filter(id = int(data['project_id'])).exists(): #Get all runs for a projects
			project_obj = Project.objects.get(id = int(data['project_id']))

		if project_obj.enable == 1:
			project_obj.enable = 0
		else:
			project_obj.enable = 1

		project_obj.save()

		return Response(OK)


class GetProjectsView(CreateAPIView):

	def post(self, request):
		data = request.data

		query_list = []

		projects_user = ProjectUser.objects.filter(user = request.user)
		projects_user = projects_user.values()
		for project_user in projects_user:
			project_obj = Project.objects.get(id = project_user['project_id'])
			query_list.append({'name': project_obj.name, 'id': project_obj.id, 'enable': project_obj.enable, 'project_date': project_obj.date})


		return Response(query_list)

class GetRunsView(CreateAPIView):

	def post(self, request):
		data = request.data
		query_dict = {}
		query_list = []


		if Project.objects.filter(id = int(data['project_id'])).exists(): #Get all runs for a projects
			project_obj_exists = Project.objects.get(id = int(data['project_id']))

			if ProjectUser.objects.filter(user = request.user, project = project_obj_exists).exists():
				runs = Run.objects.filter(project = project_obj_exists)
				runs = runs.values()
				for run in runs:
					query_list.append({'run_name': run['run_name'], 'id': run['id'], 'run_date': run['run_date']})
		else: # This is a run
			pass

		query_dict = {'runs': query_list}
		return Response(query_dict)



class GetNodesView(CreateAPIView):

	def post(self, request):
		data=request.data
		query_list=[]
		print(data['run_id'])

		if Run.objects.filter(id = data['run_id']).exists():

			run_obj = Run.objects.get(id = data['run_id'])
			all_run_nodes = Node.objects.filter(run = run_obj)
			all_run_nodes = all_run_nodes.values()
			if Metadata.objects.filter(run = run_obj).exists():
				metadata_obj = Metadata.objects.get(run = run_obj)
				installed_packages = metadata_obj.installed_packages
				system_information = metadata_obj.system_information
			else:
				system_information = '["Metadata Not Saved"]'
				installed_packages = '["Metadata Not Saved"]'

			for node in all_run_nodes:
				if node['node_type'] == 0 or node['node_type'] == 2: #Input
					try:
						input_dict = ast.literal_eval(node['description'])
					except:
						input_dict = ""
				else:
					input_dict = node['description']

				query_list.append({'id': node['id'], 'name': node['name'], 'description': input_dict, 'node_type' : node['node_type'], 'csv_node': node['csv_node'], 'dataset_node': node['dataset_node'], 'date': node['date'], 'node_summary': node['summary']})
		
			file_objs = Files.objects.filter(run = run_obj)

			query_list.sort(key=lambda x:x['date'])

			files_list = []

			for file_obj in file_objs:
				files_list.append('http://127.0.0.1:8000/media/'+str(file_obj.file.name))
				#files_list.append('https://www.mynacode.com/media/'+str(file_obj.file.name))


			image_objs = Images.objects.filter(run = run_obj)

			images_list = []

			for image_obj in image_objs:
				images_list.append('http://127.0.0.1:8000/media/'+str(image_obj.image.name))
				#images_list.append('https://www.mynacode.com/media/'+str(image_obj.image.name))

			
			query = {'nodes': query_list, 'installed_packages': installed_packages, 'system_info': system_information, 'files_list': files_list, 'images_list': images_list}
			return Response(query)

		return Response(ERROR)


class SetFeedbackView(APIView):

	def post(self, request):
		data = querydict_to_dict(request.data)

		if not myUser.objects.filter(id=request.user.id).exists():
			return Response(ERROR)

		user_obj = myUser.objects.get(id=request.user.id)
		Feedback.objects.create(user = user_obj, feedback = data['feedback'])


		return Response(OK)


class RunUpdateView(CreateAPIView):

	def post(self, request):
		data = request.data
		run_id = int(data['run_id'])
		run_name = data['run_name']

		run_obj = Run.objects.get(id = run_id)
		run_obj.run_name = run_name
		run_obj.save()

		return Response(OK)

class RunDeleteView(CreateAPIView):

	def post(self, request):
		data = request.data
		run_id = int(data['run_id'])

		run_obj = Run.objects.get(id = run_id)
		run_obj.delete()

		return Response(OK)


class ProjectUpdateView(CreateAPIView):

	def post(self, request):
		data = request.data
		project_id = int(data['project_id'])
		project_name = data['project_name']

		project_obj = Project.objects.get(id = project_id)
		project_obj.name = project_name
		project_obj.save()

		return Response(OK)


class ProjectDeleteView(CreateAPIView):

	def post(self, request):
		data = request.data
		project_id = int(data['project_id'])

		project_obj = Project.objects.get(id = project_id)
		project_obj.delete()

		return Response(OK)

class ProjectShareView(CreateAPIView):

	def post(self, request):
		data = request.data

		user_obj = myUser.objects.get(username=data['user_name'])

		if Project.objects.filter(id = int(data['project_id'])).exists():
			project_obj_exists = Project.objects.get(id = int(data['project_id']))

		if ProjectUser.objects.filter(user = user_obj, project = project_obj_exists).exists():
			pass
		else:
			ProjectUser.objects.create(user = user_obj, project = project_obj_exists)

		return Response(OK)




class ProfileView(APIView):

	def post(self, request):
		user=myUser.objects.get(id=request.user.id)

		query={}

		query['name'] = user.name 

		if user.image:
			query['image'] = "http://"+IP+"/media/"+user.image.name 
		else:
			query['image'] = "http://"+IP+"/media/no_image.png"

		query['email'] = user.email 
		query['username'] = user.username 
		query['key'] = user.key
		if user.account_type == 1:
			query['account_type'] = 'Basic Non-Commercial Personal/Academic'

		return Response(query)

class EditProfileView(APIView):

	def post(self, request):
		user=myUser.objects.get(id=request.user.id)
		student=Student.objects.get(user=request.user.id)
		querylist = []
		
		universities=University.objects.all()
		degrees=Degree.objects.all()
		programs=Program.objects.all()
		countries=Country.objects.all()

		query={}

		universities = universities.values()
		degrees = degrees.values()
		programs = programs.values()
		countries = countries.values()

		university_list = []
		degree_list = []
		program_list = []
		country_list = []
		
		query['email'] = user.email
		query['phone'] = user.phone
		query['name'] = user.name

		if user.image:
			query['image'] = "http://"+IP+"/media/"+user.image.name
		else:
			pass
		
		querylist.append(query)
		query={}

		if student.program:
			query['program'] = student.program.name

		if student.degree:
			query['degree'] = student.degree.name

		if student.university:
			query['university'] = student.university.name

		if student.year:
			query['year'] = student.year

		if student.country:
			query['country'] = student.country.name

		if student.province:
			query['province'] = student.province.name

		if student.city:
			query['city'] = student.city.name

		querylist.append(query)

		for query in universities:
			university_list.append(query)

		for query in degrees:
			degree_list.append(query)

		for query in programs:
			program_list.append(query)

		for query in countries:
			if query['name'] == 'Canada' or query['name'] == 'United States':
				country_list.append(query['name'])


		querylist.append(university_list)
		querylist.append(degree_list)
		querylist.append(program_list)
		querylist.append(country_list)

		
		return Response(querylist)

class ProfileUpdateView(APIView):
	serializer_class = myUserSerializer
	def post(self, request):
		data=request.data

		user = request.user

		if Program.objects.filter(name=data['program']).exists():
			program_obj = Program.objects.get(name=data['program'])
		else:
			program_obj = Program.objects.get(name='Not Listed')
		data['program'] = program_obj.id

		if Degree.objects.filter(name=data['degree']).exists():
			degree_obj = Degree.objects.get(name=data['degree'])
		else:
			degree_obj = Degree.objects.get(name='Not Listed')
		data['degree'] = degree_obj.id

		if University.objects.filter(name=data['university']).exists():
			university_obj = University.objects.get(name=data['university'])
		else:
			university_obj = University.objects.get(name='Not Listed')
		data['university'] = university_obj.id

		myUser.objects.filter(id=user.id).update(name = data['name'], email = data['email'], phone = data['phone'])

		try:
			usr_obj = myUser.objects.get(id=user.id)
			usr_obj.image = request.FILES['image']
			usr_obj.save() 
		except:
			pass


		return Response(OK)
		

class CountryListView(APIView):
	
	def post(self, request):
		query_list = []
		countries = Country.objects.all()
		countries = countries.values()
		for query in countries:
			if query['name'] == 'Canada' or query['name'] == 'United States':
				query_list.append(query['name'])

		return Response(query_list)

class ProvinceListView(APIView):
	
	def post(self, request, country):
		country = self.kwargs['country']
		country_id = Country.objects.get(name=country)
		query_list = []
		provinces = Region.objects.filter(country=country_id)
		provinces = provinces.values()
		for query in provinces:
			query_list.append(query['name'])

		return Response(query_list)

class CityListView(APIView):
	
	def post(self, request, province):
		province = self.kwargs['province']
		province_id = Region.objects.get(name=province)
		query_list = []
		cities = City.objects.filter(region=province_id)
		cities = cities.values()
		for query in cities:
			query_list.append(query['name'])

		return Response(query_list)


class GetAllUserInfoView(APIView):

	def post(self, request):
		data=request.data

		querylist = []

		user_objs = myUser.objects.all()

		for user_obj in user_objs:

			if user_obj.payment_proof:
				payment_proof = "http://"+IP+"/media/"+user_obj.payment_proof.name
			else:
				payment_proof = None

			querylist.append({'id':user_obj.id, 'name': user_obj.name, 'email': user_obj.email, 'phone': user_obj.phone, 'payment_status': user_obj.payment_status, 'payment_proof': payment_proof})

		return Response(querylist)


class UploadFilesView(APIView):

	def post(self, request):
		print(request.data)
		print(request.FILES)

		try:
			run_obj = Run.objects.get(id=request.data['run_id'])
			file_obj = Files.objects.create(run = run_obj, file = request.FILES.get('file'))
		except:
			pass


		return Response(OK)


class UploadImagesView(APIView):

	def post(self, request):
		print(request.data)
		print(request.FILES)

		try:
			run_obj = Run.objects.get(id=request.data['run_id'])
			image_obj = Images.objects.create(run = run_obj, image = request.FILES.get('image'))
		except:
			pass


		return Response(OK)


class UploadPytorchWeightsView(APIView):

	def post(self, request):
		print(request.data)
		print(request.FILES)
		data = querydict_to_dict(request.data)

		if not myUser.objects.filter(username = data['username'], key = data['key']).exists():
			return Response(0)

		try:
			run_obj = Run.objects.get(id=request.data['run_id'])
			run_obj.weights = request.FILES.get('state_dict')
			run_obj.network = request.FILES.get('network')
			run_obj.save() 
		except:
			pass

		return Response(OK)


class GetPytorchWeightsView(APIView):

	def post(self, request):
		print(request.data)
		data = querydict_to_dict(request.data)

		if not myUser.objects.filter(username = data['username'], key = data['key']).exists():
			return Response(0)

		run_obj = Run.objects.get(id=request.data['run_id'])

		#return Response({'weights': 'https://www.mynacode.com/media/'+run_obj.weights.name, 'network': 'https://www.mynacode.com/media/'+run_obj.network.name})

		return Response({'weights': 'http://'+IP+'/media/'+run_obj.weights.name, 'network': 'http://'+IP+'/media/'+run_obj.network.name})



class AdminPanelMetricsView(APIView):

	def post(self, request):

		user_count = myUser.objects.all().count()
		projects_count = Project.objects.all().count()

		return Response({'user_count': user_count, 'projects_count': projects_count})


class AdminPanelFeedbackView(APIView):

	def post(self, request):

		count = request.data['count']
		index = count*3
		querylist = []
 
		feedback = Feedback.objects.all()[index:index+3]
		for fb in feedback:
			query = {'id': fb.id, 'username': fb.user.username, 'feedback': fb.feedback, 'date': fb.feedback_date}
			querylist.append(query)


		return Response(querylist)






	

