from rest_framework import serializers
from myapp.models import myUser

class myUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = myUser
		fields = ('id','name', 'email', 'username', 'password', 'user_type', 'image', 'phone', 'payment_proof')

class myUserSerializerUpdate(serializers.ModelSerializer):
	class Meta:
		model = myUser
		fields = ('id','name', 'email', 'phone', 'image')

