# Generated by Django 5.0.3 on 2024-04-28 16:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0013_alter_movie_movieid_alter_user_movieids'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='movieID',
            field=models.CharField(blank=True, max_length=20, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='movieIDs',
            field=models.ManyToManyField(blank=True, null=True, related_name='users', to='myapp.movie'),
        ),
    ]