from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User, Group
from .models import *
from django.utils.translation import gettext, gettext_lazy as _
# Register your models here.

# Define a new User admin
class UserAdmin(UserAdmin):
	model = myUser

	add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password', 'name', 'email', 'user_type', 'payment_status', 'account_type')}
     	),
    )

	fieldsets = (
        (None, {'fields': ('username', 'password', 'phone')}),
        (_('Personal info'), {'fields': ('name', 'email', 'image')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'user_type', 'payment_status', 'key', 'account_type'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )


admin.site.register(Project)
admin.site.register(Node)
admin.site.register(Feedback)
admin.site.register(Run)
admin.site.register(Files)
admin.site.register(Images)
admin.site.register(Model)
admin.site.register(myUser, UserAdmin)
