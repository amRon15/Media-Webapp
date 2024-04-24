from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class User(AbstractUser):
    username = models.CharField(
        max_length=10,
        unique=True,
        default='guest')
    email = models.EmailField()
    movieID = models.CharField(max_length=50, blank=True, null=True)
    
    groups = models.ManyToManyField(
        Group,
        through='UserGroup',
        through_fields=('user', 'group'),
        related_name='users',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )

    user_permissions = models.ManyToManyField(
        Permission,
        through='UserPermission',
        through_fields=('user', 'permission'),
        related_name='users',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

class UserGroup(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)

class UserPermission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)