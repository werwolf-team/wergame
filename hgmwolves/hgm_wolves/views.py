from django.shortcuts import *
from django.http import *
from hgm_wolves.models import *

def index(request):
    return render_to_response("hall.html",{'log_in':False})

def inRoom(request):
    return render_to_response("room.html",{'room_name': request.GET['RoomName']})