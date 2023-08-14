# Generated by Django 4.2.1 on 2023-08-11 05:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0015_sweep_remove_project_objective'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='latest_sweep_index',
            field=models.DecimalField(decimal_places=0, default=0, max_digits=6, null=True),
        ),
    ]
