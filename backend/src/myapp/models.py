from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from datetime import datetime

# Create your models here.

class myUser(AbstractUser):
	image= models.ImageField(upload_to='user_profile_pictures', blank=True, null=True, max_length=1000)
	name = models.CharField(max_length=150, null=True, blank=True, default='New User')
	key = models.CharField(max_length=150, null=True, blank=True, default='')
	email = models.EmailField(max_length=255, unique=False, blank=True, null=True)
	phone = models.CharField(max_length=15, null=True, blank=True)
	user_type = models.DecimalField(max_digits=2, decimal_places=0, null=True, default = 1) #1 student, 2 admin
	account_type = models.DecimalField(max_digits=2, decimal_places=0, null=True, default = 1)
	payment_status = models.DecimalField(max_digits=2, decimal_places=0, null=True, default=0) #0 pending, 1 not paid, 2 paid

	REQUIRED_FIELDS = ['name', 'email', 'phone', 'user_type']

class Project(models.Model):
	notes = models.TextField(null=True, blank=True)
	name = models.TextField(null=True, blank=True)
	date = models.DateTimeField(default=datetime.now, blank=True)
	latest_run_index = models.DecimalField(max_digits=6, decimal_places=0, null=True, default = 0)
	enable = models.DecimalField(max_digits=1, decimal_places=0, null=True, default = 1)
	outline_key = models.TextField(null=True, blank=True)
	directory = models.TextField(null=True, blank=True)


class ProjectUser(models.Model):
	project = models.ForeignKey(Project, on_delete=models.CASCADE, blank=True, null=True)
	user = models.ForeignKey(myUser, on_delete=models.CASCADE, blank=True, null=True)


class Run(models.Model):
	project = models.ForeignKey(Project, on_delete=models.CASCADE, blank=True, null=True)
	run_name = models.TextField(null=True, blank=True)
	run_date = models.DateTimeField(default=datetime.now, blank=True)

class Model(models.Model):
	run = models.ForeignKey(Run, on_delete=models.CASCADE, blank=True, null=True)
	model_path = models.TextField(null=True, blank=True)
	metric_name = models.TextField(null=True, blank=True)
	metric_value = models.TextField(null=True, blank=True)
	library = models.TextField(null=True, blank=True)
	track_dict = models.TextField(blank=True, null=True)


class Files(models.Model):
	run = models.ForeignKey(Run, on_delete=models.CASCADE, blank=True, null=True)
	file = models.FileField(upload_to ='files', null=True, blank=True)


class Node(models.Model):
	run = models.ForeignKey(Run, on_delete=models.CASCADE, blank=True, null=True)
	name = models.TextField(blank=True, null=True, default='New Node')
	description = models.TextField(blank=True, null=True)
	summary = models.TextField(blank=True, null=True)
	node_type = models.DecimalField(max_digits=2, decimal_places=0, null=True, default = 0) #0 input, 1 method, 2 output
	csv_node = models.DecimalField(max_digits=1, decimal_places=0, null=True, default = 0)
	dataset_node = models.DecimalField(max_digits=1, decimal_places=0, null=True, default = 0)
	result_type = models.DecimalField(max_digits=4, decimal_places=0, null=True, default = 0) # 0-undefined, 1-binary classification, etc...
	date = models.DateTimeField(default=datetime.now, blank=True)


class Images(models.Model):
	run = models.ForeignKey(Run, on_delete=models.CASCADE, blank=True, null=True)
	image= models.ImageField(upload_to='images', blank=True, null=True, max_length=1000)
	image_caption=models.TextField(blank=True, null=True, default='Add caption')
	


class subscription(models.Model):
	subscriber = models.ForeignKey(myUser, on_delete=models.CASCADE, blank=True, null=True)
	payment_date = models.DateTimeField(auto_now=True, null=True)
	payment_amount = models.DecimalField(max_digits=10, decimal_places=0, null=True, default=0)

	def __str__(self):
		return self.subscriber.name

class Feedback(models.Model):
	user = models.ForeignKey(myUser, on_delete=models.CASCADE, blank=True, null=True)
	feedback = models.TextField(blank=True, null=True)
	feedback_date = models.DateTimeField(auto_now=True, null=True)
