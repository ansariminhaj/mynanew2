# Generated by Django 4.2.1 on 2023-06-22 20:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0007_node_result_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='node',
            name='summary',
            field=models.TextField(blank=True, null=True),
        ),
    ]
