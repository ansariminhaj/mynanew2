# Generated by Django 4.2.1 on 2023-06-28 05:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0009_images'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='run',
            name='network',
        ),
        migrations.RemoveField(
            model_name='run',
            name='weights',
        ),
    ]
