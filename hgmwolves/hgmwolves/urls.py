"""hgmwolves URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import *
from django.conf import settings
from django.contrib import admin

urlpatterns = patterns('',
    #url(r'^admin/', include(admin.site.urls)),
    (r'^$', 'hgm_wolves.views.index'),
    (r'^Room/$', 'hgm_wolves.views.inRoom'),
    (r'^register/$','hgm_wolves.Users.register'),
    (r'^login/$','hgm_wolves.Users.login'),
    (r'^LogOut/$', 'hgm_wolves.Users.logout'),
    (r'^getMyName/$', 'hgm_wolves.Users.getMyName'),
    (r'^SetAvatar/$', 'hgm_wolves.Users.setAvatar'),
    (r'^rewrite/$','hgm_wolves.Users.rewrite'),
    (r'^rewritePassword/$','hgm_wolves.Users.rewritePassword'),
    (r'^RoomNameValid/$','hgm_wolves.Users.RoomNameValid'),
    (r'^createRoom/$','hgm_wolves.Users.createRoom'),
    (r'^enterRoom/$','hgm_wolves.Users.enterRoom'),
    (r'^RoomList/$','hgm_wolves.Users.getRoomList'),
    (r'^getRoomPlayers/$','hgm_wolves.Game.getRoomPlayers'),
    (r'^ready/$','hgm_wolves.Game.ready'),
    (r'^getReadyStatus/$','hgm_wolves.Game.GetReadyStatus'),
    (r'^GameStart/$','hgm_wolves.Game.GameStart'),
    (r'^getGameStatus/$','hgm_wolves.Game.getGameStatus'),
    (r'^setvote/$','hgm_wolves.Game.setvote'),
    (r'^receiveMessage/$','hgm_wolves.Game.receiveMessage'),
    (r'^getMessage/$','hgm_wolves.Game.getMessage'),
    (r'^sendlastword/$','hgm_wolves.Game.sendlastword'),
    (r'^getRole/$','hgm_wolves.Game.getRole'),
    (r'^medias/(?P<path>.*)$','django.views.static.serve',{'document_root':settings.STATIC_PATH}),
)
