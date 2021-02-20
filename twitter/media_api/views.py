from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import generics, status
from django.views.generic import DeleteView
from rest_framework import viewsets
from . import serializers
from django.views.decorators.csrf import csrf_exempt
from .models import Images, ImagePost
from . import config
import requests
import tweepy
import datetime
import urllib.request
from .models import Images
from rest_framework.response import Response
import pprint
import os
from auth_api.models import Account
import random
import string
import json
import glob
import re
# Create your views here.

CK = config.CK
CS = config.CS
AT = config.AT
AS = config.AS
auth = tweepy.OAuthHandler(CK,CS)
auth.set_access_token(AT, AS)
api = tweepy.API(auth, wait_on_rate_limit=True)

class ImagePostViewSet(viewsets.ModelViewSet):
    queryset = ImagePost.objects.all()
    serializer_class = serializers.ImagePostSerializer
    def create(self, request, *args, **kwargs):
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            Account = self.request.data['scrName']
            tweets = api.user_timeline(Account, count=1, page=1)
        except:
            return Response(serializer.data, status=status.HTTP_404_NOT_FOUND)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_queryset(self):
        return self.queryset.filter(userPost=self.request.user)

    def perform_create(self, serializer):
        
        serializer.save(userPost=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        imgs = Images.objects.filter(imgPost=instance.id)

        imgsdata = []
        for img in imgs:
            imgsdata.append(str(img.id))
        images_list = glob.glob("./media/media/*")
        url_items = "http://127.0.0.1:8000/api/mypage/"
        headers = {'Authorization': request.headers['Authorization']}
        r_get = requests.get(url_items, headers=headers)
        user = r_get.json()['username']
        for image in images_list:
            split_image = re.split('[_.]', str(image))
            check = split_image[-2]
            if check in imgsdata and user in image:
                os.remove(image)

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
        


class ImagePostListView(generics.ListAPIView):
    queryset = ImagePost.objects.all()
    serializer_class = serializers.ImagePostSerializer

    def get_queryset(self):
        return self.queryset.filter(userPost=self.request.user)


class ImagesListView(generics.ListAPIView):
    queryset = Images.objects.all()
    serializer_class = serializers.ImagesSerializer

    def get_queryset(self):
        return self.queryset.filter(userImg=self.request.user)

class ImagesDestroy(generics.DestroyAPIView):
    queryset = Images.objects.all()
    serializer_class = serializers.ImagesSerializer
    def delete(self, request, *args, **kwargs):
        pk = self.kwargs['pk']
        images_list = glob.glob("./media/media/*")
        url_items = "http://127.0.0.1:8000/api/mypage/"
        headers = {'Authorization': request.headers['Authorization']}
        r_get = requests.get(url_items, headers=headers)
        user = r_get.json()['username']
        for image in images_list:
            if str(pk) in image and user in image:
                os.remove(image)
        return self.destroy(request, *args, **kwargs)

def upload_post_path(user,instance, filename):
    ext = filename.split('.')[-1]
    return "".join(["media/media/",str(user)+'_'+str(instance.imgPost.scrName)+'_'+str(instance.id)+str(".")+str(ext)])
    
@csrf_exempt
def images(request):
    json_scrName = json.loads(request.body)
    screen_name = json_scrName["scrName"]
    search_results = (tweepy.Cursor(api.user_timeline,
                        screen_name=screen_name,
                        tweet_mode="extended",
                        include_entities=True,
                        exclude_replies=True,
                        include_rts=False).items())
    quantity = 0
    try:
        for result in search_results:
            contents = result._json
            if quantity > 20:
                break
            if "extended_entities" in contents:
                content_check = contents["extended_entities"]["media"][0]
                if len(content_check) > 0:
                    if not "video_info" in content_check:
                        
                        for photo in contents['extended_entities']['media']:
                            if ".jpg" in photo['media_url']:
                                image_url = photo['media_url'][:-4] + \
                                                "?format=jpg&name=orig"
                                print(image_url)
                                save_name = 'test.jpg'
                            elif ".png" in photo['media_url']:
                                image_url = photo['media_url'][:-4] + \
                                        "?format=png&name=orig"
                                print(image_url)
                                save_name = 'test.png'
                            else:
                                image_url = photo['media_url']
                                print(image_url)
                                save_name = 'test.jpg'

                            
                            # response = request.GET.get(image_url)
                            tgt = urllib.request.urlopen(image_url).read()
                            
                            
                            url_items = "http://127.0.0.1:8000/api/mypage/"
                            # print(request.headers)
                            # print(request.headers['Authorization'])
                            
                            headers = {'Authorization': request.headers['Authorization']}
                            r_get = requests.get(url_items, headers=headers)
                            userId = r_get.json()['id']
                            user = r_get.json()['username']
                            userImg = Account.objects.get(id=userId)
                            imgPost = ImagePost.objects.get(scrName=screen_name)
                            data = Images()
                            data.id = int("".join([str(random.randint(1, 10)) for i in range(5)]))
                            data.userImg = userImg
                            data.imgPost = imgPost
                            save_name = upload_post_path(user, data, save_name)
                            with open(save_name, mode='wb') as f:
                                f.write(tgt)
                            data.imgs = save_name.replace('media/','',1)

                            data.save()
                            quantity += 1
    except:
        return HttpResponse(status=404)

    return HttpResponse(status=201)







