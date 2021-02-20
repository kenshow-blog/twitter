from django.contrib.auth import update_session_auth_hash
from rest_framework import serializers

from .models import Images,ImagePost


class ImagePostSerializer(serializers.ModelSerializer):
    created_on = serializers.DateTimeField(format="%Y/%m/%d", read_only=True)

    class Meta:
        model = ImagePost
        fields = ('id', 'scrName', 'userPost', 'created_on')
        extra_kwargs = {'userPost': {'read_only': True}}

class ImagesSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Images
        fields = ('id', 'userImg', 'imgs', 'imgPost')
        extra_kwargs = {'userImg': {'read_only': True}}