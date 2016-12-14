from django.shortcuts import *
from django.http import *
from hgm_wolves.models import *

def register(request):
    try:
        p = User.objects.get(UName = request.GET['rName'])
    except User.DoesNotExist:
        tmp = User(UName = request.GET['rName'], UPassword = request.GET['rPassword'], USex = request.GET['rSex'],UEmail = request.GET['rMail'], UOnline = False, UDate = request.GET['rDate'], UAvatar = 0, URoom = "", UOrder = 0, URole = 0, UAlive = True, UReady = False)
        tmp.save()
        feed_back = {'str' : 'Success!'}
        return JsonResponse(feed_back)
    else:
        feed_back = {'str' : 'Username is occupied!'}
        return JsonResponse(feed_back)

def login(request):
    try:
        p = User.objects.get(UName = request.GET['lName'])
    except User.DoesNotExist:
         feed_back = {'str' : '0'}
         return JsonResponse(feed_back)
    else:
        if(p.UPassword == request.GET['logInPassword']):
            feed_back = {'str' : '1', 'name' : p.UName}
            p.UOnline = True
            p.save()
            response = JsonResponse(feed_back)
            response.set_cookie('username', p.UName, 100000)
            return response
        else:
           feed_back = {'str' : '-1'}
           return JsonResponse(feed_back)

def logout(request):
    try:
        name = request.COOKIES.get('username', '')
    except:
        response = {'str':'-1'}
        return JsonResponse(response)
    else:
       try:
            p = User.objects.get(UName = name)
       except User.DoesNotExist:
            response = {'str':'-1'}
            return JsonResponse(response)
       else:
            p.UOnline = False
            p.save()
            response = JsonResponse({'str':'0'})
            response.delete_cookie('username')
            return response

def getMyName(request):
    try:
        myName = request.COOKIES.get('username', '')
    except:
        name_dict = {'str':'0'}
        return JsonResponse(name_dict)
    else:
        try:
            p = User.objects.get(UName = myName)
        except User.DoesNotExist:
            name_dict = {'str':'0'}
            return JsonResponse(name_dict)
        else:
            name_dict = {'str':'1', 'name': myName, 'score': 0, 'avatar': p.UAvatar}
            return JsonResponse(name_dict)

def setAvatar(request):
    try:
        p = User.objects.get(UName = request.COOKIES.get('username', ''))
    except User.DoesNotExist:
        name_dict = {'str': 'Fail!'}
        return JsonResponse(name_dict)
    else:
        p.UAvatar =  request.GET['id']
        p.save()
        name_dict = {'str': 'Success!', 'avatar':p.UAvatar}
        return JsonResponse(name_dict)

def rewrite(request):
    try:
        p = User.objects.get(UName = request.COOKIES.get('username', ''))
    except User.DoesNotExist:
        response = JsonResponse({'str':'No'})
        return response
    else:
        p.UDate = request.GET['CIDate']
        p.USex = request.GET['CISex']
        p.UEmail = request.GET['CIEMail']
        p.save()
        response = JsonResponse({'str':'Yes'})
        return response

def rewritePassword(request):
    try:
        p = User.objects.get(UName = request.COOKIES.get('username', ''))
    except User.DoesNotExist:
        response =  JsonResponse({'str':'1'})
        return response
    else:
        if(request.GET['CPOldPassword'] != p.UPassword):
            response =  JsonResponse({'str':'-1'})
            return response
        else:
            p.UPassword = request.GET['CPNewPassword']
            p.save()
            response =  JsonResponse({'str':'0'})
            return response

def RoomNameValid(request):
    try:
        p = Room.objects.get(RName = request.GET['CRName'])
    except Room.DoesNotExist:
        content = {'create':'1'}
    else:
        content = {'create':'0'}
    return JsonResponse(content)

def createRoom(request):
    try:
        cp = Room.objects.get(RName = request.GET['CRName'])
    except Room.DoesNotExist:
        temp = Room(RName = request.GET['CRName'])
        temp.RPassword = request.GET['CRPassword']
        temp.RCreator = request.COOKIES.get('username', '')
        temp.RType = request.GET['CRKill']
        temp.RTimer = 0
        temp.RGamer = 1
        temp.RGaming = False
        temp.RDays = 0
        temp.RPolice = 0
        temp.RConfig = 0
        temp.save()
        p = User.objects.get(UName = temp.RCreator)
        p.URoom = temp.RName;
        p.UOrder = 1;
        p.save();
        name_dict = {'str': 'Success!'}
        return JsonResponse(name_dict)
    else:
        name_dict = {'str': 'Fail!'}
        return JsonResponse(name_dict)

def enterRoom(request):
    try:
        p = Room.objects.get(RName = request.GET['rName'])
    except Room.DoesNotExist:
        name_dict = {'str': '0'}
        return JsonResponse(name_dict)
    else:
        username =  request.COOKIES.get('username', '')
        temp = User.objects.get(UName = username)
        flag = False
        for i in range(1, 12):
            try:
                tmp = User.objects.get(URoom = p.RName, UOrder = i)
            except User.DoesNotExist:
                flag = True;
                temp.UOrder = i;
                temp.URoom = p.RName;
                temp.save();
                break;
        if flag == False:
            name_dict = {'str': '-1'}
            return JsonResponse(name_dict)
        else:
            name_dict = {'str': '1'}
            return JsonResponse(name_dict)


def getRoomList(request):
    p = Room.objects.all()
    room_info = []
    name_dict = []
    for room in p:
        if room.RGaming == False:
            count = 0
            for i in range(1, 12):
                try:
                    tmp = User.objects.get(URoom = room.RName, UOrder = i)
                except User.DoesNotExist:
                    continue
                else:
                    count = count + 1
            room_info.append([room.RName, room.RType, room.RPassword, count])
    name_dict = {'Room': room_info}
    return JsonResponse(name_dict)


