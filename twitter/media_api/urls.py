from django.urls import include, path
from . import views
from rest_framework.routers import DefaultRouter
# , AuthInfoUpdateView, AuthInfoDeleteView


router = DefaultRouter()
router.register('post', views.ImagePostViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('images/', views.images),
    path('imageslist/', views.ImagesListView.as_view()),
    path('imageslist/<str:pk>/', views.ImagesDestroy.as_view(), name='detail'),
]