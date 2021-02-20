from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings
# Create your models here.


def upload_post_path(instance, filename):
    ext = filename.split('.')[-1]
    return '/'.join(['media', str(instance.userImg)+'_'+str(instance.imgPost.scrName)+'_'+str(instance.id)+str(".")+str(ext)])

class ImagePost(models.Model):
    scrName = models.CharField(max_length=100)
    userPost = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='userPost',
        on_delete=models.CASCADE
    )
    created_on = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.scrName



class Images(models.Model):
    id = models.AutoField(primary_key=True)
    userImg = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='userImg',
        on_delete=models.CASCADE
    )

    imgs = models.ImageField(blank=True, null=True,upload_to=upload_post_path)
    imgPost = models.ForeignKey(
        ImagePost, on_delete=models.CASCADE
    )


    def __str__(self):
        return str(self.userImg)+'_'+str(self.imgPost)+'_'+str(self.id)