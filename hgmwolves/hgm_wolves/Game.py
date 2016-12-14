from django.shortcuts import *
from django.http import *
from hgm_wolves.models import *

def getRoomPlayers(request):
    try:
        p = Room.objects.GET(RName = request.GET['rName'])
    except Room.DoesNotExist:
        name_dict = {'str': '-1'}
        return JsonResponse(name_dict)
    else:
        list = []
        for i in range(1, 12):
            try:
                tmp = User.objects.get(URoom = p.RName, UOrder = i)
            except User.DoesNotExist:
                continue
            else:
                 name_dict = [tmp.UOrder, tmp.UName, tmp.UAvatar]
                 list.append(name_dict)
        return JsonResponse({'players': list})

