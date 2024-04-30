# Generated by Django 5.0.3 on 2024-04-30 13:54

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0018_alter_user_email_remove_user_movieids_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=254, unique=True),
        ),
        migrations.RemoveField(
            model_name='user',
            name='movieIDs',
        ),
        migrations.AddField(
            model_name='user',
            name='movieIDs',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='users', to='myapp.movie'),
        ),
    ]
